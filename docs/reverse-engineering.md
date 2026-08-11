# Reverse Engineering Report: My Sakthi Marketing

## 1. Executive Summary

This report documents the findings from reverse-engineering the public web application for **My Sakthi Marketing** (Source URL: `https://mysakthimarketing.in/`). The goal of this analysis is to extract the existing business identity, navigation hierarchy, public content, user authentication workflow, registration requirements, bank details collection logic, and referral mechanics in order to redesign and rebuild a modern, enterprise-grade SaaS marketing and member management platform from scratch.

---

## 2. Business Identity & Branding

- **Company Name**: My Sakthi Marketing
- **Motto / Value Proposition**: Empowering members with the opportunity to lead their lives on their own terms; spreading wealth and enriching lives through a direct marketing / referral associate model.
- **Headquarters Address**: No.2, Venus Nagar 5th Street, Kolathur, Chennai - 600099, Tamil Nadu, India.
- **Official Contact Email**: `info@mysakthimarketing.in`
- **Official Phone Number**: `+91 78456 01441`
- **Domain**: `mysakthimarketing.in`
- **Product Category Focus**: Household electronics, home appliances, consumer durables (e.g., Mixer Grinders, LED TVs, kitchenware).

---

## 3. Public Navigation & Page Map

The public website consists of 4 main public view pages and a member portal gateway:

| Page Name | Original File / Route | Key Visible Elements & Purpose |
| :--- | :--- | :--- |
| **Home** | `index.html` | Top contact bar, main header, hero slider with banners (LED TV, Mixer Grinder), "Who We Are" intro card, footer navigation, contact details. |
| **Who We Are (About Us)** | `about.html` | Page banner, detailed mission narrative, feature highlight cards ("Safe and Secure", "We Are Trusted", "Very Professional"). |
| **Products** | `products.html` | Product catalog grid displaying product photos, titles, and promotional listings (`mysakthiproduct.jpg`). |
| **Contact Us** | `contact.html` | Office address block, phone link, email link, interactive contact form (Name, Email, Message input). |
| **Member Portal Gateway** | `user/login.php` / `user/` | Entry point for member sign-in and new associate registration ("Refer & Earn"). |

---

## 4. User Authentication & Registration Reverse-Engineering

Analysis of the legacy portal files (`user/login.php` and `user/sign_up.php`) revealed the following core authentication and referral mechanics:

### 4.1 Login Architecture (`user/login.php`)
- **Primary Identifier**: `User ID` / `Distributor ID` (e.g., `MSM1001` format rather than simple email login).
- **Authentication Credentials**: User ID + Login Password.
- **Form Actions**: Directs to PHP authentication script storing session tokens.
- **Theme Framework**: Legacy Bootstrap dashboard layout (Velzon admin theme).

### 4.2 Member Registration Architecture (`user/sign_up.php`)
Reverse engineering the sign-up form revealed specific business rules for member onboarding:

1. **Sponsor Verification**:
   - Mandatory field: `Sponsor ID`.
   - Real-time AJAX lookup displays the resolved **Sponsor Name** immediately below the input.
2. **Personal Information**:
   - Full Name (`name`)
   - E-Mail Address (`email`)
   - Country (Defaulted to India, ID `103`)
   - Contact Mobile Number (`mobile_number` with `+91` prefix, 10-digit strict numerical validation)
3. **Financial / Banking Details (For Commission Payouts)**:
   - Account Holder Name (`account_name`)
   - Account Number (`account_number`)
   - IFSC Code (`ifsc_code`)
   - Bank Name (`bank_name`)
   - Branch Name (`branch_name`)
4. **Dual Password System**:
   - **Login Password**: Password used to sign in to the portal (Minimum 6 characters).
   - **Transaction Password**: Secondary security pin/password required for sensitive operations (e.g., wallet withdrawals, commission payouts, downline transfers).
5. **Agreement & Terms**:
   - Mandatory checkbox agreeing to Terms & Conditions of My Sakthi Marketing.

---

## 5. Referral ("Refer & Earn") & Business Model

From the inspectable assets and signup parameters, the business operates a **Direct Referral & Associate Marketing Model**:
- Every registered member receives a unique **Distributor / User ID**.
- New members register under an existing member using their **Sponsor ID**.
- The system maintains a parent-child sponsor tree.
- Members earn bonuses/commissions through direct referrals and product packages.
- Secondary Transaction Passwords safeguard commission balance payouts directly to members' bank accounts.

---

## 6. Legacy Technical Stack Analysis

| Component | Legacy Technology Used | Issues / Reasons for Rebuild |
| :--- | :--- | :--- |
| **Frontend Styling** | Bootstrap CSS, jQuery plugins | Dated design, lack of modern micro-interactions, monolithic script bundles. |
| **Backend** | Procedural PHP scripts | Monolithic PHP, lack of REST API separation, vulnerable to security flaws if non-sanitized. |
| **Hosting & Infra** | GoDaddy cPanel / Apache | Static file clutter, lack of modern CI/CD, limited scalability. |
| **Database** | MySQL (direct PHP queries) | No ORM abstraction, risk of unindexed query bottlenecks. |

---

## 7. Key Takeaways for the Redesign

1. **Retain Verified Identity**: Preserve official name, contact details, address, and primary product domain.
2. **Upgrade UX**: Transform the legacy PHP template into a sleek, responsive React single-page application with micro-animations and dark/light modes.
3. **Enterprise Architecture**: Replace procedural PHP with a modern Node.js/Express REST API backed by Prisma ORM and MySQL.
4. **Dual-Key Security**: Implement JWT authentication for access and secondary Transaction Password verification for payout requests.
5. **Interactive Sponsor Tree**: Rebuild referral tracking with dynamic tree visualization and full downline analytics.
