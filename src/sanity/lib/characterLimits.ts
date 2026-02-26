/**
 * Character Limits Configuration
 * ================================
 * This file contains character limits for all text-based fields in Sanity schemas.
 * Each localized field has separate limits for each language: en, nl, de, cn
 * Update the limit values as needed - default is 10 for easy identification.
 *
 * USAGE:
 * - Set a number (e.g., 50) to limit characters
 * - Set to null for UNLIMITED characters (no counter shown)
 *
 * Example:
 *   title: { en: 100, nl: 100, de: 100, cn: null },  // CN has no limit
 *   link: null,  // No limit on link field
 *
 * EXCLUDED from this config:
 * - Image fields
 * - Image alt fields
 * - Rich text / Block content fields
 * - Boolean, Number, DateTime, Slug, URL fields
 */

export const characterLimits = {
    // ==========================================
    // DOCUMENTS
    // ==========================================

    // Blog Document
    blog: {
        title: { en: 55, nl: 55, de: 55, cn: 55 },
        summary: { en: 120, nl: 120, de: 120, cn: 120 },
    },

    // Service Document
    service: {
        title: { en: 22, nl: 22, de: 22, cn: 22 },
        summary: { en: 55, nl: 55, de: 55, cn: 55 },
    },

    // Team Member Document
    teamMember: {
        firstName: 10,
        lastName: 15,
        designation: { en: 25, nl: 25, de: 25, cn: 25 },
        description: { en: 75, nl: 75, de: 75, cn: 75 },
    },

    // ==========================================
    // SINGLETONS
    // ==========================================

    // About Page
    aboutPage: {
        title: { en: 12, nl: 12, de: 12, cn: 12 },
        description: { en: 750, nl: 750, de: 750, cn: 750 },
        visionTitle: { en: 10, nl: 10, de: 10, cn: 10 },
        visionDescription: { en: 300, nl: 300, de: 300, cn: 300 },
        missionTitle: { en: 10, nl: 10, de: 10, cn: 10 },
        missionDescription: { en: 300, nl: 300, de: 300, cn: 300 },
    },

    // Contact Page
    contactPage: {
        title: { en: 12, nl: 12, de: 12, cn: 12 },
        description: { en: 150, nl: 150, de: 150, cn: 150 },
        address: 150,
        phone: 20,
        email: 35,
        // Form labels
        formLabelName: { en: 20, nl: 20, de: 20, cn: 20 },
        formPlaceholderName: { en: 40, nl: 40, de: 40, cn: 40 },
        formLabelEmail: { en: 20, nl: 20, de: 20, cn: 20 },
        formPlaceholderEmail: { en: 40, nl: 40, de: 40, cn: 40 },
        formLabelPhone: { en: 20, nl: 20, de: 20, cn: 20 },
        formLabelCompany: { en: 25, nl: 25, de: 25, cn: 25 },
        formPlaceholderCompany: { en: 40, nl: 40, de: 40, cn: 40 },
        formLabelService: { en: 25, nl: 25, de: 25, cn: 25 },
        formPlaceholderService: { en: 40, nl: 40, de: 40, cn: 40 },
        formLabelMessage: { en: 20, nl: 20, de: 20, cn: 20 },
        formPlaceholderMessage: { en: 60, nl: 60, de: 60, cn: 60 },
        formSubmitButton: { en: 20, nl: 20, de: 20, cn: 20 },
        formSubmittingButton: { en: 25, nl: 25, de: 25, cn: 25 },
        // Contact info labels
        basedAtTitle: { en: 20, nl: 20, de: 20, cn: 20 },
        viewOnMapText: { en: 25, nl: 25, de: 25, cn: 25 },
        phoneSectionLabel: { en: 15, nl: 15, de: 15, cn: 15 },
        emailSectionLabel: { en: 15, nl: 15, de: 15, cn: 15 },
    },

    // EU VAT Compliance Page
    euVatCompliancePage: {
        label: { en: 21, nl: 21, de: 21, cn: 21 },
        title: { en: 55, nl: 55, de: 55, cn: 55 },
    },

    // Fiscal Representation Page
    fiscalRepresentationPage: {
        label: { en: 21, nl: 21, de: 21, cn: 21 },
        title: { en: 55, nl: 55, de: 55, cn: 55 },
    },

    // Guide to Customs Page
    guideToCustomsPage: {
        label: { en: 21, nl: 21, de: 21, cn: 21 },
        title: { en: 55, nl: 55, de: 55, cn: 55 },
    },

    // Home Page
    homePage: {
        mainTitleLine1: { en: 10, nl: 10, de: 10, cn: 10 },
        mainTitleLine2: { en: 12, nl: 12, de: 12, cn: 12 },
        description: { en: 90, nl: 90, de: 90, cn: 90 },
    },

    // Portal Page
    portalPage: {
        label: { en: 12, nl: 12, de: 12, cn: 12 },
        title: { en: 25, nl: 25, de: 25, cn: 25 },
        sidePanelTitle: { en: 17, nl: 17, de: 17, cn: 17 },
        sidePanelDescription: { en: 105, nl: 105, de: 105, cn: 105 },
    },

    // Services Page
    servicesPage: {
        label: { en: 12, nl: 12, de: 12, cn: 12 },
    },

    // ==========================================
    // OBJECTS
    // ==========================================

    // CTA Button Object
    ctaButton: {
        text: { en: 15, nl: 15, de: 15, cn: 15 },
        link: null,
    },

    // Featured Logo Object
    featuredLogo: {
        alt: 10,
    },
} as const;

export type CharacterLimits = typeof characterLimits;
