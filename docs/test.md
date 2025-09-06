# Testing Strategy and Notes

## 1. Unit Testing

- We use **Jest** for all unit tests.  
- Covers:
  - Functions
  - Utilities
  - Components logic (without UI rendering)
- Tests are placed alongside source files or in `__tests__` folders.

## 2. UI / End-to-End Testing

- We use **Playwright** for UI testing.  
- Features:
  - End-to-end flows
  - User interactions
  - Navigation and form submissions
- Recommended: Use **Playwright Codegen** to quickly generate test scripts for UI scenarios.
- Tests can be saved in `tests/e2e` or similar folders.

