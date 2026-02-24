# SauceDemo Test Strategy Document

**Author:** Harout P.
**Date:** February 19, 2026
**Application Under Test:** SauceDemo
**Version/Date Tested:** Unknown — Assuming 1.0.0 / February 19, 2026

---

## Purpose

To define the testing approach for user flow through the e-commerce website SauceDemo to ensure a stable user experience. Identify defects early (shift-left) to reduce rework.

---

## Application Overview

SauceDemo is an intentionally flawed, free, and fictional e-commerce website created by Sauce Labs for practicing web UI automation and testing. It simulates an almost complete shopping experience, including user login, product navigation, cart management, and checkout. It provides 6 pre-created user accounts with varying behaviors and is commonly used to test tools like Selenium, Cypress, and Playwright.

---

## Scope

### In Scope
- **Features:** Login, Inventory, Sorting/Filtering, Cart, Checkout
- **Browsers:** Chrome
- **User Types:** standard_user

### Out of Scope
- **Unit tests:** SauceDemo does not provide source code to testers
- **Performance testing:** No staging environment available to produce meaningful results
- **Security penetration testing:** No staging or dedicated security environment
- **Mobile app:** No mobile app version of SauceDemo exists
- **Third-party integrations:** Backend is unavailable to testers

---

## Test Objectives

- Verify core functionality works across the complete user flow (login → browse → cart → checkout)
- Identify defects in edge cases and error handling
- Validate business logic integrity

---

## Test Approach

- **Test Types:** UI, Functional, User Flow — the application is user-facing only with no backend access
- **Test Level:** E2E — validate the complete user flow from login through checkout
- **Techniques:**
  - **Decision Tables** — test multiple conditions combined at the same moment (e.g., checkout with various valid/invalid field combinations)
  - **State Transition** — validate that actions produce correct behavior based on current application state (e.g., cart state after add/remove sequences)

---

## Risk Analysis

### Priority Thresholds
| Score Range | Priority | Testing Approach |
|-------------|----------|------------------|
| 15-25 | High | Test first, deepest coverage, most edge cases |
| 8-14 | Medium | Test second, solid coverage with key negative cases |
| 1-7 | Low | Test last, basic happy-path coverage. Cut first if time-constrained |

*Note: Scenarios involving financial loss, data leakage, security breaches, or legal exposure may be elevated to High priority regardless of raw score.*

### Risk Matrix

| Feature | What Could Go Wrong | Likelihood (1-5) | Impact (1-5) | Risk Score | Priority |
|---------|---------------------|-------------------|--------------|------------|----------|
| Login | User unable to log in due to account being locked from multiple failed attempts | 3 | 5 | 15 | High |
| Login | User able to login with invalid credentials | 2 | 5 | 10 | High (account compromise) |
| Login | User able to see previous user's session state | 2 | 5 | 10 | High (data leakage) |
| Inventory | User unable to load inventory due to server down | 2 | 5 | 10 | Medium |
| Inventory | User can access inventory without authentication | 2 | 5 | 10 | Medium |
| Inventory | User can purchase items that are never delivered | 1 | 5 | 5 | Low |
| Cart | User unable to add items to cart due to Add to Cart button not functioning | 2 | 5 | 10 | Medium |
| Cart | User sees incorrect total price on cart screen | 1 | 5 | 5 | Low |
| Checkout | User can skip checkout information step using direct URL manipulation | 3 | 5 | 15 | High |
| Checkout | User can complete checkout with an empty cart | 1 | 3 | 3 | Low |
| Checkout | User charged twice for a single purchase | 2 | 5 | 10 | High (financial loss) |
| Sorting | Filter options have no effect on inventory display | 2 | 3 | 6 | Low |
| Sorting | Filter button not visible or not rendering | 1 | 2 | 2 | Low |

---

## Test Environment

**Environment:** SauceDemo is a hosted production environment maintained by Sauce Labs. QA tests directly against this live environment. There is no separate Dev, QA, or Staging environment available.

**Data Management:** QA uses seeded test accounts provided by SauceDemo. The application provides a reset state button that restores the application to baseline between test runs.

### Known Limitations

1. **No real payment processing** — Checkout tests verify UI flow only, not actual transaction handling. Bugs in payment integration would not be caught.
2. **Fixed pre-created accounts** — Cannot test registration, password reset, or account creation flows. Authentication testing is limited to login/logout with known credentials.
3. **No real API layer** — Cannot test backend validation, database integrity, or server-side business logic. All testing is UI-level only.

### Environment Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Session state persists across user accounts | High | High | Use reset state button to clear session state before each test case |
| SauceDemo goes down or updates without notice (no control) | Low | High | Join Sauce Labs forums for update schedules. Document date tested as version reference |
| Fixed test data limits coverage to known user accounts only | Medium | Medium | Maximize coverage across all 6 user types. Document which scenarios could not be tested due to data constraints |

---

## Entry Criteria

- SauceDemo website is running and accessible
- Environment is in a known, clean state (reset applied)
- Valid login credentials available and verified
- Checkout information test data prepared
- Test cases written, reviewed, and ready to execute

---

## Exit Criteria

- No unresolved Critical or High severity bugs
- 85% of all planned test cases executed and passing

---

## Deliverables

1. Test cases
2. Risk matrix (included in this document)
3. Test execution report
4. Defect logs (if any defects found)
5. Coverage matrix
6. This test strategy document

---

## Assumptions and Dependencies

- SauceDemo will remain publicly accessible throughout the testing period
- Test accounts and credentials will remain unchanged
- The application will not undergo major updates during the testing cycle
- The application will remain available at all times of the day
- Testing is limited to Chrome; cross-browser behavior is not validated

---

*Document Version: 1.0*
*Last Updated: February 19, 2026*
