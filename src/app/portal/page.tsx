import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Portal() {
  return (
    <section className="h-screen py-[10vh]">
      <Image
        src="/images/portal-bg.jpg"
        alt="Services background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="relative z-20 h-full ">
        <Container className="h-full grid grid-cols-[1.3fr_1fr]">
          <div className="">
            <div>
              <div className="flex items-center gap-4">
                <span className="inline-block h-px w-[50px] bg-[#A9081C]">
                  &nbsp;
                </span>
                <span className="text-[#ec2a41] uppercase text-xs tracking-[5px]">
                  Our Portal
                </span>
              </div>
              <h1 className="text-5xl text-white font-bold mt-6">
                Overview of the Portal
              </h1>
              <p className="text-[#E5E5E5] text-sm mt-6 [word-spacing:3px] leading-loose">
                The My-Customs Digital Portal is a centralized online platform
                designed to streamline and simplify the full customs-clearance
                journey for importers and exporters. It provides real-time
                visibility of all customs activities, ensures full compliance
                with Dutch regulations, and enables customers to manage
                submissions, documents, and communication in one unified
                interface. The portal is accessible across devices and built
                with secure, scalable technology to support both high-volume and
                standard workflows.
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A9081C] uppercase tracking-[0.2em] ">
                What Customers Can Track
              </p>
              <p className="text-[#E5E5E5] text-sm [word-spacing:3px] leading-loose">
                Through the portal, customers can track and manage a wide range
                of customs-related information, including:
              </p>
              <ul className="text-[#E5E5E5] text-sm [word-spacing:3px] leading-loose list-disc pl-4">
                <li>
                  Application Status – Submission progress, pending items,
                  approvals, and final clearance.
                </li>
                <li>
                  Customs Status – Inspection status, holds, releases, and any
                  required actions.
                </li>
                <li>
                  Tariffs and Duties – Duty calculations, tariff
                  classifications, and applicable taxes for each shipment.
                </li>
                <li>
                  Updates and Notifications – Automated alerts for milestones,
                  discrepancies, and changes in customs requirements.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center flex-col text-center py-10 px-30">
              <h3 className="text-3xl text-[#A9081C]">Access the Portal</h3>
              <p className="text-xs text-[#E5E5E5] mt-4">
                A secure online platform that gives customers real-time
                visibility and control over all customs-clearance activities.
              </p>
              <PrimaryButton className="mt-4 mx-auto text-[#E5E5E5]">
                Portal
              </PrimaryButton>
            </div>
            <div className="flex-1 relative">
              <Image
                src="/images/team/portal-image.jpg"
                fill
                alt="General Manager"
                className="absolute object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
