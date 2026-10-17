# OrderFlow — Web Engineering Assignment 01

**Student:** Sayyam Shahid  
**Registration / MIS ID:** 41488  
**Section:** 5A · BS Computer Science · Semester 5  
**Subject:** Web Engineering  
**Business profile:** CEO, SYFA Digital — https://syfadigital.com  
**Submission date:** 19 October 2026

## Run the prototype
1. Extract the ZIP folder.
2. Open `index.html` in a modern browser. No build step or server is required.
3. Sign in using the Employee or Administrator demo role.
4. All records are dummy/sample data. New orders and approval actions are stored in this browser only, using localStorage.
5. This is a front-end learning prototype, not a secure production system. Do not enter real customer or payment data.

## Folder structure
```text
41488_Sayyam_Shahid_WE_Assignment01/
├── index.html
├── employee-dashboard.html
├── new-order.html
├── my-orders.html
├── commission.html
├── admin-dashboard.html
├── approvals.html
├── reports-dispatch.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
└── README.md
```

## Problem statement
Small businesses often receive orders through employees and manage customer information, payment details, approvals, commissions, and dispatch records across separate messages or spreadsheets. This fragmented process can lead to missing details, delayed approvals, unclear payment balances, and difficulty tracking parcel status. Employees need a consistent interface to submit orders and monitor their progress. Administrators need a centralized view to review submissions, check payment information, and prepare dispatch reports. OrderFlow proposes a single, role-oriented interface to make this workflow easier to understand and manage. This prototype demonstrates the intended screens using realistic dummy data before backend development.

## Functional requirements
1. The system shall provide a shared sign-in screen with Admin and Employee demo role choices.
2. The Employee dashboard shall display order counts and a sample commission summary.
3. Employees shall be able to enter customer contact and delivery information.
4. Employees shall be able to record order items, category, amount, payment method, and amount received.
5. Employees shall be able to select a receipt file for the prototype form.
6. Employees shall be able to view sample orders and their statuses.
7. Employees shall be able to view a sample monthly commission summary.
8. The Admin dashboard shall summarize orders, payments, pending approvals, employees, and commissions.
9. Admins shall be able to approve or reject sample pending orders in the local prototype.
10. Admins shall be able to filter/search orders and dispatch records.
11. Admins shall be able to view customer address, payment status, and parcel tracking number.
12. The interface shall provide responsive navigation and printable summary/report views.

## Non-functional requirements
- **Usability:** Clear labels, consistent navigation, readable tables, and visible status indicators.
- **Performance:** Plain HTML, CSS, and JavaScript with no framework or build process.
- **Maintainability:** Shared stylesheet and JavaScript file; meaningful file names and semantic HTML.
- **Responsive design:** Layouts adapt to mobile, tablet, laptop, and desktop screens.
- **Security awareness:** Demo credentials are not authenticated; localStorage is not a secure database and must not hold sensitive production data.
- **Consistency:** Shared typography, colors, buttons, form controls, and status styles across pages.

## Users and responsibilities
### Employee
- Enter customer contact and delivery details.
- Submit order and payment information.
- Provide receipt information when applicable.
- View submitted order statuses.
- Review a sample commission summary.

### Administrator
- Review submitted orders.
- Inspect payment details/receipt placeholders.
- Approve or reject orders at interface level.
- Review payment and outstanding balance summaries.
- Review employee activity and commissions.
- Prepare dispatch and report information.

## Sitemap
```text
Sign in (index.html)
├── Employee workspace
│   ├── Employee dashboard
│   ├── Create new order
│   ├── My orders / status
│   └── My commission
└── Administrator workspace
    ├── Admin dashboard
    ├── Order approvals
    └── Reports & dispatch
```

## Prototype scope and limitations
This version includes lightweight JavaScript for navigation role selection, demo notifications, form validation, sample order creation, local status changes, table search/filter, receipt filename display, print, and copying tracking numbers. This is intentionally limited to the browser. There is no server, database, real login, real payment verification, or production authorization. In future phases, replace the demo logic with a backend API, database, server-side validation, authenticated role-based access, secure file handling, tests, and deployment.

## Developer links
- SYFA Digital: https://syfadigital.com
- LinkedIn: https://www.linkedin.com/
- GitHub: https://github.com/
- Instagram: https://www.instagram.com/
- Facebook: https://www.facebook.com/

Update the social links to your exact profile URLs before final submission.
