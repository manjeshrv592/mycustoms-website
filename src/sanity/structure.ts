import type { StructureResolver } from "sanity/structure";

// Define singleton document IDs
const singletonTypes = new Set([
  "homePage",
  "aboutPage",
  "portalPage",
  "contactPage",
  "servicesPage",
  "resourcesPage",
  "euVatCompliancePage",
  "guideToCustomsPage",
  "fiscalRepresentationPage",
]);

// Define singleton document actions (only publish)
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export const singletonPlugin = {
  name: "singletonPlugin",
  document: {
    // Hide 'create new' for singleton types
    newDocumentOptions: (
      prev: any[],
      { creationContext }: { creationContext: { type: string } }
    ) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (templateItem) => !singletonTypes.has(templateItem.templateId)
        );
      }
      return prev;
    },
    // Only allow specific actions for singletons
    actions: (prev: any[], { schemaType }: { schemaType: string }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter((action) => singletonActions.has(action.action));
      }
      return prev;
    },
  },
};

// Structure builder for organizing content in the studio
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Pages Group
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home Page")
                .id("homePage")
                .child(
                  S.document().schemaType("homePage").documentId("homePage")
                ),
              S.listItem()
                .title("About Page")
                .id("aboutPage")
                .child(
                  S.document().schemaType("aboutPage").documentId("aboutPage")
                ),
              S.listItem()
                .title("Portal Page")
                .id("portalPage")
                .child(
                  S.document().schemaType("portalPage").documentId("portalPage")
                ),
              S.listItem()
                .title("Contact Page")
                .id("contactPage")
                .child(
                  S.document()
                    .schemaType("contactPage")
                    .documentId("contactPage")
                ),
              S.listItem()
                .title("Services Page")
                .id("servicesPage")
                .child(
                  S.document()
                    .schemaType("servicesPage")
                    .documentId("servicesPage")
                ),
              S.listItem()
                .title("Resources Page")
                .id("resourcesPage")
                .child(
                  S.document()
                    .schemaType("resourcesPage")
                    .documentId("resourcesPage")
                ),
              S.listItem()
                .title("EU VAT Compliance Page")
                .id("euVatCompliancePage")
                .child(
                  S.document()
                    .schemaType("euVatCompliancePage")
                    .documentId("euVatCompliancePage")
                ),
              S.listItem()
                .title("Guide to Customs Page")
                .id("guideToCustomsPage")
                .child(
                  S.document()
                    .schemaType("guideToCustomsPage")
                    .documentId("guideToCustomsPage")
                ),
              S.listItem()
                .title("Fiscal Representation Page")
                .id("fiscalRepresentationPage")
                .child(
                  S.document()
                    .schemaType("fiscalRepresentationPage")
                    .documentId("fiscalRepresentationPage")
                ),
            ])
        ),

      S.divider(),

      // Services
      S.documentTypeListItem("service").title("Services"),

      // Team Members
      S.documentTypeListItem("teamMember").title("Team Members"),

      S.divider(),

      // Blogs
      S.documentTypeListItem("blog").title("Blogs"),
    ]);
