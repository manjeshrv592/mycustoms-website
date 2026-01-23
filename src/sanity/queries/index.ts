// Home page queries
export { HOME_PAGE_QUERY, getHomePage } from "./home";

// Services queries
export {
  getAllServices,
  getServiceBySlug,
  getServicesPage,
  getFirstServiceSlug,
  getAllServiceSlugs,
} from "./services";

// Portal queries
export { getPortalPage } from "./portal";

// Contact queries
export { getContactPage } from "./contact";

// About queries
export { getAboutPage } from "./about";

// Team queries
export { getAllTeamMembers } from "./team";

// Blog queries
export {
  getAllBlogs,
  getFirstBlogSlug,
  getBlogBySlug,
  getAllBlogSlugs,
  getResourcesGridData,
} from "./resources";

// Resource page queries
export {
  getEuVatCompliancePage,
  getGuideToCustomsPage,
  getFiscalRepresentationPage,
  getResourcePageLabels,
  getResourcePageBySlug,
  getAllResourcePageSlugs,
} from "./resourcePages";

export type { ResourcePageData } from "./resourcePages";


