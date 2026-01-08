# Multi-Level User Management System (MEAN)

This system enforces strict parent–child hierarchy for user creation and balance flow.
Admin acts as a supervisory role without owning balance; all credits are deducted from the immediate parent.

A secure MEAN stack application demonstrating:
- JWT auth via **HttpOnly cookies**
- CAPTCHA-based login
- N-level user hierarchy (parent → child)
- Balance transfer (parent → direct child only)
- Transaction statements (credit/debit)
- Admin features: view users, downline tree, credit any user (deduct from parent), summary


## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: Angular
- Auth: JWT + HttpOnly Cookies
- Validation: Zod
- Logging: Morgan



