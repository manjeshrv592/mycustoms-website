# My Customs Website — Static Code Analysis

Analysis performed on the current codebase using:

- **TypeScript compiler** (`tsc --noEmit`) — type correctness across the project.
- **ESLint** (`next lint`, with `eslint-config-next`, `typescript-eslint`, and the
  React Compiler plugin) — code quality, React rules, and unused code.
- **Manual review** of the API routes handling external input (contact form,
  Sanity webhook) for common security issues (input validation, injection,
  authentication/signature checks).

## Summary

| Check                | Result                                  |
| --------------------- | ---------------------------------------- |
| TypeScript (`tsc --noEmit`) | 0 errors                          |
| ESLint                | 16 errors, 18 warnings across 13 files   |
| Automated test suite   | None present (no Jest/Playwright/Cypress config found) |

---

## ESLint findings

### Errors (16)

| Category                              | Count | Notes                                                                 |
| --------------------------------------- | ----- | ----------------------------------------------------------------------- |
| `react-hooks/rules-of-hooks`            | 1     | `ResourcesSearch.tsx` — a hook is called conditionally. Real bug risk: can cause React state to desync between renders. |
| `react-hooks/set-state-in-effect`       | 3     | `ContactFormContext.tsx`, `NavigationContext.tsx`, `TextWithCharacterCount.tsx` — state is set synchronously inside `useEffect`, which can cause an extra render pass. Functional today, but flagged by React as a performance anti-pattern. |
| `@typescript-eslint/no-explicit-any`    | 9     | All in Sanity Studio schema/config code (`schemaTypes/`, `structure.ts`, custom input components). Reduces type safety in the CMS layer; does not affect the public site. |

### Warnings (18)

Unused imports/variables across several page and component files (e.g.
`STATIC_RESOURCES` in `ResourcesGrid.tsx`, unused icon imports, unused
destructured props). No functional impact — safe cleanup, not urgent.

One additional informational warning: `ContactForm.tsx` uses `watch()` from
`react-hook-form`, which the React Compiler cannot safely memoize. This is
expected/known behavior of that library and not a defect.

### Full breakdown

- `src/components/resources/ResourcesSearch.tsx:50` — conditional hook call (error)
- `src/context/ContactFormContext.tsx:35` — setState in effect (error)
- `src/context/NavigationContext.tsx:130` — setState in effect (error)
- `src/sanity/components/TextWithCharacterCount.tsx:40` — setState in effect (error)
- `src/sanity/components/LocalizedStringInput.tsx:40` — `any` type (error)
- `src/sanity/components/StringWithInlineCounter.tsx:18` — `any` type (error)
- `src/sanity/components/TextWithCharacterCount.tsx:19` — `any` type (error)
- `src/sanity/queries/resourcePages.ts:152,153` — `any` type (2 errors)
- `src/sanity/schemaTypes/documents/teamMember.ts:21,36` — `any` type (2 errors)
- `src/sanity/schemaTypes/singletons/contactPage.ts:101,138,158` — `any` type (3 errors)
- `src/sanity/structure.ts:24,35` — `any` type (2 errors)
- 18 unused-variable/import warnings spread across page and component files.

---

## Manual security review

| Area                          | Result |
| ------------------------------ | ------- |
| Contact form input validation  | ✅ Server-side schema validation via `zod` (`src/app/api/contact/route.ts`), rejecting malformed submissions before any email is sent. |
| Bot protection                 | ✅ Google reCAPTCHA v2 token is verified server-side against Google's API before processing. |
| Sanity webhook authentication   | ✅ Incoming revalidation webhooks are verified with `next-sanity/webhook`'s signature check (`isValidSignature`) using `SANITY_WEBHOOK_SECRET`; unsigned/invalid requests are rejected with 401. |
| Secrets handling                | ✅ No secrets committed to source; all read from environment variables (see SETUP.md). |
| **Email templates (finding)**   | ⚠️ **Medium/low risk.** In `src/lib/email.ts`, contact-form fields (`name`, `company`, `message`) are inserted directly into the outgoing HTML email without escaping. A submitter could include HTML in these fields, which would render in the notification email sent to your team inbox (and in the confirmation email sent back to the submitter's own address). Recommend HTML-escaping these values before interpolation. Low severity since it does not affect the website itself, but worth fixing before go-live. |

---

## Recommendations (priority order)

1. Fix the conditional hook call in `ResourcesSearch.tsx` — genuine bug risk.
2. HTML-escape user-submitted contact form fields before embedding them in
   email templates.
3. Replace `any` types in the Sanity Studio layer with proper types where
   practical (lower priority — CMS-only, not customer-facing).
4. Move the three `setState`-in-effect calls to event handlers or derived
   state where feasible (performance cleanup, not a functional bug).
5. Remove unused imports/variables (cosmetic).
