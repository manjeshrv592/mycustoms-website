import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    sendThankYouEmail,
    sendContactNotification,
    type ContactFormData,
} from "@/lib/email";

/**
 * Validation schema for contact form data
 */
const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .regex(/^[^\d]*$/, "Name cannot contain numbers"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(1, "Please enter your phone number"),
    company: z.string().min(1, "Please enter your company name"),
    service: z.string().min(1, "Please select a service"),
    message: z.string().min(1, "Please enter your message"),
    captchaToken: z.string().min(1, "reCAPTCHA verification required"),
});

/**
 * Verify reCAPTCHA token with Google
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.error("RECAPTCHA_SECRET_KEY is not set");
        return false;
    }

    try {
        const response = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${secretKey}&response=${token}`,
            }
        );

        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return false;
    }
}

/**
 * POST /api/contact
 * Handles contact form submissions and sends emails
 */
export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();
        const validationResult = contactFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { captchaToken, ...formData } = validationResult.data;

        // Verify reCAPTCHA
        const isRecaptchaValid = await verifyRecaptcha(captchaToken);
        if (!isRecaptchaValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "reCAPTCHA verification failed. Please try again.",
                },
                { status: 400 }
            );
        }

        const emailData: ContactFormData = formData;

        // Send thank you email to customer
        try {
            await sendThankYouEmail(emailData);
        } catch (emailError) {
            console.error("Failed to send thank you email:", emailError);
            // Continue even if thank you email fails - we still want to notify the business
        }

        // Send notification to business
        try {
            await sendContactNotification(emailData);
        } catch (notificationError) {
            console.error("Failed to send contact notification:", notificationError);
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "We received your enquiry but encountered an issue. Please try again or contact us directly.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Thank you for your enquiry. We will get back to you soon.",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred. Please try again later.",
            },
            { status: 500 }
        );
    }
}
