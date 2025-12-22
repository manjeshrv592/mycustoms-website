import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Portal() {
  return (
    <section className="h-screen py-[12vh]">
      <Image
        src="/images/portal-bg.jpg"
        alt="Services background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="relative z-20 h-full ">
        <Container className="h-full grid grid-cols-[1fr] md:grid-cols-[1.3fr_1fr] gap-4 md:gap-16">
          <div className="">
            <div>
              <div className="flex items-center gap-4">
                <span className="inline-block h-px w-[50px] bg-[#A9081C]">
                  &nbsp;
                </span>
                <span className="text-[#da1b31] uppercase text-sm md:text-xs tracking-[7px] md:tracking-[5px] md:font-bold">
                  Our Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-5xl uppercase md:normal-case text-[#da1b31] md:text-white md:font-bold mt-2 md:mt-4">
                Overview of the Portal
              </h1>
            </div>
            <div className="text-justify mt-2 md:mt-4">
              <p className="text-[#E5E5E5] text-sm md:leading-loose leading-[15px]">
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
              <p className="block md:hidden text-[#E5E5E5] text-sm md:leading-loose mt-4 leading-[15px]">
                A full import declaration requires several important documents.
                These typically include the commercial invoice, packing list,
                transport documents such as a bill of lading or air waybill, and
                the importer’s EORI number.
              </p>
              <p className="block md:hidden text-[#E5E5E5] text-sm md:leading-loose mt-4 leading-[15px]">
                Depending on the type of products, customs may also require
                certificates, licenses, health or safety approvals, and proof of
                origin. All this information is submitted through national
                customs systems or EU customs portals using the Single
                Administrative Document (SAD) format. The accuracy of the data
                is crucial, as errors can delay clearance or trigger
                inspections.
              </p>
              <div className="hidden md:block">
                <p className="text-xs text-[#da1b31] uppercase tracking-[0.2em] my-4">
                  What Customers Can Track
                </p>
                <p className="text-[#E5E5E5] text-sm  leading-loose">
                  Through the portal, customers can track and manage a wide
                  range of customs-related information, including:
                </p>
                <ul className="text-[#E5E5E5] text-sm  leading-loose list-disc pl-4">
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
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center flex-col text-center py-4 md:py-10 px-10 md:px-30">
              <h3 className="text-2xl md:text-3xl text-[#da1b31]">
                Access the Portal
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-4 leading-[20px] md:leading-0">
                A secure online platform that gives customers real-time
                visibility and control over all customs-clearance activities.
              </p>
              <PrimaryButton className="mt-4 mx-auto text-[#E5E5E5]">
                Portal
              </PrimaryButton>
            </div>
            <div className="flex-1 relative hidden md:block">
              <Image
                src="/images/team/portal-image.jpg"
                fill
                alt="Container Image"
                className="absolute object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
