import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
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
export default function Resources() {
  return (
    <section className="h-screen relative pt-[12vh] pb-5">
      <Image
        src="/images/resources-bg.jpg"
        alt="Resources background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_33%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="border-white/50 border rounded-full flex gap-8 p-1">
              <Button className="bg-[#3871C1] cursor-pointer hover:bg-[#2d5a9a] rounded-full w-[180px] h-8">
                Blogs
              </Button>
              <Button
                variant={"outline"}
                className=" cursor-pointer rounded-full w-[180px] bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8 border-white/50"
              >
                Guide to Customs
              </Button>
              <Button
                variant={"outline"}
                className=" cursor-pointer rounded-full w-[180px] bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8"
              >
                Fiscal Representation
              </Button>
              <Button
                variant={"outline"}
                className=" cursor-pointer rounded-full w-[180px] bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8"
              >
                EU VAT Compliance
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between max-w-[60%] pr-10">
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                &nbsp;
              </span>
              <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                blogs
              </span>
            </div>
            <div>
              <span className="text-white text-sm">01 / 10</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-[3fr_2fr] gap-4 h-full min-h-0">
              <div className="text-sm h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 leading-loose text-justify">
                <h3 className="text-[#3871C1] text-2xl font-bold mb-4">
                  How Tariffs Impact Global Trade: What It Means for Logistics &
                  Shipping
                </h3>
                <p className="mb-4">
                  In today’s interconnected world, global trade fuels economies
                  and connects markets. But with rising tariffs and trade
                  barriers across key trade routes, importers, exporters, and
                  logistics providers face growing challenges. Understanding the
                  impact of tariffs on global trade and logistics is essential
                  for navigating uncertainty and staying competitive.
                </p>
                <p className="mb-4">
                  What Are Tariffs?
                  <br />
                  Tariffs are government-imposed taxes on imports or exports
                  between countries. While they are often used to protect
                  domestic industries, they can lead to higher costs, supply
                  chain disruptions, and trade tensions — particularly in
                  sectors like manufacturing, food, electronics, and shipping.
                </p>
                <p>The Impact of Tariffs on Global Trade</p>
                <ol className="list-decimal list-inside">
                  <li>
                    Increased Costs for Importers & ExportersTariffs directly
                    raise the price of goods crossing borders. This leads to
                    increased freight costs, price hikes for end consumers, and
                    squeezed profit margins for businesses.
                  </li>
                  <li>
                    Shift in Trade RoutesHigher tariffs between certain
                    countries can cause businesses to reroute cargo through
                    alternative ports or free trade zones to minimize costs,
                    affecting traditional logistics patterns.
                  </li>
                  <li>
                    Disruption in Supply Chains Sudden tariff changes disrupt
                    established just-in-time supply chains, forcing companies to
                    hold more inventory, delay shipments, or re-evaluate
                    suppliers.
                  </li>
                  <li>
                    Reduced Trade Volumes Increased trade restrictions may
                    result in lower cargo volumes, which affects shipping
                    companies, freight forwarders, and port operations globally.
                  </li>
                  <li>
                    Rise in Non-Tariff Barriers Besides tariffs, many countries
                    also impose quotas, licensing rules, and inspections that
                    delay shipments and increase compliance burdens for global
                    trade participants.
                  </li>
                </ol>
              </div>
              <div className="text-white">
                <article className="bg-black/5 backdrop-blur-[20px] h-full w-full rounded-xl px-2 py-4 flex flex-col ">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Button
                        size="icon"
                        className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
                      >
                        <ArrowLeft />
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                    <div className="bg-[#3871C1] p-1 rounded-full">
                      <div className="flex items-center">
                        <Input
                          className="bg-white rounded-full text-neutral-800"
                          type="text"
                          placeholder="Search..."
                        />
                        <Button
                          size="icon"
                          className="rounded-full bg-transparent hover:bg-transparent cursor-pointer"
                        >
                          <Search className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[#3871C1] text-xs mt-auto">
                    <div className="text-white text-sm mb-1">02 / 10</div>
                    <div>Updated on - 28/11/2025</div>
                  </div>
                  <h3 className="text-[#3871C1] text-lg mb-2">
                    Navigating the Global Lifelines
                  </h3>
                  <p className="text-xs mb-2">
                    The world's oceans are an intricate and dynamic network of
                    trade, silently connecting continents and economies...
                  </p>
                  <Image
                    src="/images/resources-bg.jpg"
                    width={600}
                    height={700}
                    className="w-full h-[200px] object-cover mb-2"
                    alt="Placeholder"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer self-start text-[#3871C1]"
                  >
                    <ArrowLeft />{" "}
                    <span className="text-[#3871C1]">Show more</span>
                  </Button>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
