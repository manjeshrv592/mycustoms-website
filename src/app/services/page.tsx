import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Container from "@/components/layouts/Container";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Import Declaration",
    image: "/images/services/import-declaration.jpg",
  },
  {
    id: 2,
    title: "Export Declaration",
    image: "/images/services/export-declaration.jpg",
  },
  {
    id: 3,
    title: "Fiscal Representation",
    image: "/images/services/fiscal-representation.jpg",
  },
  {
    id: 4,
    title: "Transit",
    image: "/images/services/transit.jpg",
  },
  {
    id: 5,
    title: "Warehousing",
    image: "/images/services/warehousing.jpg",
  },
];
export default function Services() {
  return (
    <section className="h-screen relative pt-[10vh] pb-[5vh]">
      <Image
        src="/images/services-bg.jpg"
        alt="Services background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.5)_100%)]"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#A9081C]">
                &nbsp;
              </span>
              <span className="text-[#A9081C] uppercase text-xs tracking-[5px]">
                services
              </span>
            </div>
            <h1 className="text-3xl text-[#A9081C] uppercase">
              important declarations
            </h1>
            <h3 className="text-white text-xl">
              Full import documentation and clearance under EU customs.
            </h3>
          </div>
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-4 h-full min-h-0">
              <div className="text-sm h-full overflow-y-scroll min-h-0 custom-scrollbar text-white">
                <p className="mb-4">
                  Import declarations are a core requirement for bringing goods
                  into the European Union. Whenever products arrive from a
                  non-EU country, importers must submit a formal declaration to
                  customs authorities with complete information about the
                  shipment. This process ensures that customs can verify the
                  nature, value, and origin of the goods, apply the correct
                  duties and taxes, and ensure that all EU safety and regulatory
                  standards are met. Without an approved import declaration,
                  goods cannot enter free circulation within the EU.
                </p>
                <p className="mb-4">
                  A full import declaration requires several important
                  documents. These typically include the commercial invoice,
                  packing list, transport documents such as a bill of lading or
                  air waybill, and the importer’s EORI number. Depending on the
                  type of products, customs may also require certificates,
                  licenses, health or safety approvals, and proof of origin. All
                  this information is submitted through national customs systems
                  or EU customs portals using the Single Administrative Document
                  (SAD) format. The accuracy of the data is crucial, as errors
                  can delay clearance or trigger inspections.
                </p>
                <p>
                  Once the declaration is filed, EU customs authorities review
                  the information and conduct a risk assessment. Some shipments
                  are released immediately, while others may require additional
                  documents or even a physical inspection. Customs then
                  calculates the duties, import VAT, and any other applicable
                  charges such as anti-dumping or excise duties. These must be
                  paid before the goods can be released. After clearance, the
                  products gain “free circulation” status, meaning they can move
                  freely within all EU Member States without further customs
                  checks.
                </p>
              </div>
              <div className="flex items-center justify-center flex-col text-center px-12">
                <h3 className="text-[#A9081C] text-3xl mb-4">
                  We follow a clear process to help you out
                </h3>
                <p className="text-white text-sm relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-px after:bg-white rounded-full mb-6">
                  With a specialized focus on global trade compliance, we
                  combine deep industry knowledge with a client-first approach
                  to deliver seamless. With a specialized focus on global trade
                  compliance.
                </p>
                <PrimaryButton>Contact Us</PrimaryButton>
              </div>
            </div>
          </div>
          <div className="grid grid-flow-col auto-cols-[200px] gap-4">
            {services.map((service) => (
              <article
                key={service.id}
                className="border border-[#363636] bg-black/20 flex flex-col justify-between"
              >
                <div className="p-1 pb-2">
                  <h4 className="text-[#A9081C] font-bold w-[70%] leading-[1.2]">
                    {service.title}
                  </h4>
                </div>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={160}
                  height={80}
                  className="object-cover w-full h-[80px]"
                />
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
