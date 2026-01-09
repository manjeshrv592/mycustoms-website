import { type SchemaTypeDefinition } from "sanity";

// Objects
import { blockContent } from "./objects/blockContent";
import { ctaButton } from "./objects/ctaButton";
import { featuredLogo } from "./objects/featuredLogo";

// Singleton Pages
import { homePage } from "./singletons/homePage";
import { aboutPage } from "./singletons/aboutPage";
import { portalPage } from "./singletons/portalPage";
import { contactPage } from "./singletons/contactPage";
import { servicesPage } from "./singletons/servicesPage";
import { resourcesPage } from "./singletons/resourcesPage";
import { euVatCompliancePage } from "./singletons/euVatCompliancePage";
import { guideToCustomsPage } from "./singletons/guideToCustomsPage";
import { fiscalRepresentationPage } from "./singletons/fiscalRepresentationPage";

// Document Collections
import { service } from "./documents/service";
import { teamMember } from "./documents/teamMember";
import { blog } from "./documents/blog";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    blockContent,
    ctaButton,
    featuredLogo,

    // Singleton Pages
    homePage,
    aboutPage,
    portalPage,
    contactPage,
    servicesPage,
    resourcesPage,
    euVatCompliancePage,
    guideToCustomsPage,
    fiscalRepresentationPage,

    // Document Collections
    service,
    teamMember,
    blog,
  ],
};
