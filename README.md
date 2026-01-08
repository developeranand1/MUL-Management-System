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


# OWNER

Owner Register

![alt text](image.png)

Owner Login

![alt text](image-1.png)

Owner Dashboard & seft Recharge here & transfer Monery by the Direct User Child & see the Statement

![alt text](image-2.png)

Owner Balance 

![alt text](image-3.png)


Owner can register the new User 

![alt text](image-4.png)


Owner can Send Money to Direct User

![alt text](image-9.png)

Owner See the Downline

![alt text](image-5.png)

Owner Can change the password of next user 

![alt text](image-6.png)


# ADMIN

Admin Register here 

![alt text](image-7.png)


admin login here

![alt text](image-8.png)

admin see the all users in level wise and admin can credit the balance

![alt text](image-10.png)

![alt text](image-11.png)


Admin can see the all donwline of User list 

![alt text](image-12.png)


Admin Balance Summary

![alt text](image-13.png)