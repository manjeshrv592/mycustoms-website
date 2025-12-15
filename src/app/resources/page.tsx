import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    <section className="h-screen relative py-[10vh]">
      <Image
        src="/images/resources-bg.jpg"
        alt="Resources background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-between max-w-[60%] pr-10">
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#A9081C]">
                &nbsp;
              </span>
              <span className="text-[#A9081C] uppercase text-xs tracking-[5px]">
                resources
              </span>
            </div>
            <div>
              <span className="text-[#A9081C] text-sm">01 / 10</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-[3fr_2fr] gap-4 h-full min-h-0">
              <div className="text-sm h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-2">
                <h3 className="text-[#A9081C] text-xl font-bold mb-4">
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
                        className="cursor-pointer rounded-full bg-white text-[#131313]"
                      >
                        <ArrowLeft />
                      </Button>
                      <Button
                        size="icon"
                        className="cursor-pointer rounded-full bg-[#A9081C] text-white"
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                    <span className="text-white text-sm">02 / 10</span>
                  </div>
                  <div className="text-right text-[#A9081C] text-xs my-auto">
                    Updated on - 28/11/2025
                  </div>
                  <h3 className="text-[#A9081C] text-xl mb-2">
                    Navigating the Global Lifelines
                  </h3>
                  <p className="text-sm mb-2">
                    The world's oceans are an intricate and dynamic network of
                    trade, silently connecting continents and economies with an
                    efficiency that underpins modern life. Every single day...
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
                    className="cursor-pointer self-start"
                  >
                    <ArrowLeft />{" "}
                    <span className="text-[#A9081C]">Show more</span>
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
