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
  // {
  //   id: 5,
  //   title: "Warehousing",
  //   image: "/images/services/warehousing.jpg",
  // },
  {
    id: 6,
    title: "Consulting",
    image: "/images/services/consulting.jpg",
  },
];
export default function Services() {
  return (
    <section className="h-screen relative py-[12vh]">
      <Image
        src="/images/services-bg.jpg"
        alt="Services background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.7)_100%)]"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#A9081C]">
                &nbsp;
              </span>
              <span className="text-[#da1b31] uppercase text-xs tracking-[5px] font-bold">
                services
              </span>
            </div>
            <h1 className="text-5xl text-[#da1b31] font-semibold">
              Important declarations
            </h1>
            <h3 className="text-white text-xl">
              Full import documentation and clearance under EU customs.
            </h3>
          </div>
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-4 h-full min-h-0">
              <div className="text-sm h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 text-justify leading-loose">
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

              <div className="grid grid-cols-3 gap-4">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="border border-[#363636] flex flex-col justify-between hover:scale-[1.04] transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-2 py-4">
                      <h4 className="text-white w-[70%] leading-[1.2] font-semibold">
                        {service.title}
                      </h4>
                    </div>
                    <div className="flex-1 relative">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
