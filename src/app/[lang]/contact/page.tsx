import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import PrimaryInput from "@/components/custom-ui/PrimaryInput";
import PrimaryTextarea from "@/components/custom-ui/PrimaryTextarea";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Contact() {
  return (
    <section className="h-screen relative pt-[12vh] pb-5">
      <Image
        src="/images/contact-bg.jpg"
        alt="Contact background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.1)_0%,rgba(0,0,0,0)_100%)] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,0)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_33%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full text-white flex flex-col gap-2">
          <div className="w-full md:max-w-[60%]">
            <h1 className="mb-4 md:mb-0 font-semibold text-white text-2xl">
              Contact us
            </h1>
            <p className="text-xs">
              My Customs B.V. is a trusted Dutch customs broker simplifying
              trade compliance through technology and expertise.
            </p>
            <div className="mt-6 md:mt-0 text-center">
              <h3 className="md:hidden text-2xl text-center text-[#A9081C] font-semibold">
                Contact information
              </h3>
              <p className="text-xs text-center md:text-left">
                we'd like to hear from you
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-12">
            <div className="flex flex-col justify-between max-w-[400px]">
              <div>
                <Label className="text-xs" htmlFor="name">
                  Name
                </Label>
                <PrimaryInput
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="email">
                  Email
                </Label>
                <PrimaryInput
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="phone">
                  Phone Number
                </Label>
                <PrimaryInput
                  type="text"
                  id="phone"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="company">
                  Company Name
                </Label>
                <PrimaryInput
                  type="text"
                  id="company"
                  placeholder="Enter your company name"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="service">
                  Select Service
                </Label>
                <PrimaryInput
                  type="text"
                  id="service"
                  placeholder="Choose a service"
                />
              </div>
              <div>
                <Label className="text-xs" htmlFor="service">
                  Message
                </Label>
                <PrimaryTextarea
                  id="message"
                  placeholder="Tell us more about your requirements..."
                />
              </div>
              <PrimaryButton className="w-full">Submit</PrimaryButton>
            </div>
            <div className="hidden md:flex flex-col gap-4 max-w-[400px] ml-auto ">
              <div className="flex-1 flex items-end">
                <div className="size-full rounded-xl overflow-hidden relative border border-[#dcdcdc] p-4 flex items-end max-h-[260px] ">
                  <Image
                    src="/images/contact-us.jpg"
                    alt="Contact image"
                    fill
                    className="object-cover absolute"
                  />
                  <div className="z-20 text-white relative border border-white py-1 px-4 rounded-lg bg-black/10 backdrop-blur-[5px] flex-1 text-xs">
                    <div>Based at</div>
                    <div className="font-semibold">
                      Amsterdam Central Office, Netherlands
                    </div>
                    <div>Herengrachi 123, Suite 200, Amsterdam, 1015 BG</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-white text-xs gap-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-transparent size-8"
                  >
                    <Phone className="size-3" />
                  </Button>
                  <div className="flex flex-col">
                    <span>Phone</span>
                    <span>Office : +91 6232 1151 22</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-transparent size-8"
                  >
                    <Mail className="size-3" />
                  </Button>
                  <div className="flex flex-col">
                    <span>Email</span>
                    <span>Office : hello@mycustoms.nl</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
