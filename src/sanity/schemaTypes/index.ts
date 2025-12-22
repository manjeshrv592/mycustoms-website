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

// Document Collections
import { service } from "./documents/service";
import { teamMember } from "./documents/teamMember";
import { resourceCategory } from "./documents/resourceCategory";
import { article } from "./documents/article";

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

    // Document Collections
    service,
    teamMember,
    resourceCategory,
    article,
  ],
};
