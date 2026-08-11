# Visual Design System: My Sakthi Marketing Platform

## Design Tokens & Philosophy

The application utilizes a **Premium Corporate + SaaS Dashboard** design system prioritizing:
- High contrast typography (`Inter`, `Plus Jakarta Sans`)
- Clean rounded card components (`rounded-2xl`, `rounded-3xl`)
- Subtle border demarcation (`border-slate-200` in light mode, `border-slate-800` in dark mode)
- Soft shadows (`shadow-sm`, `shadow-xl`)
- Crisp Indian currency (`Intl.NumberFormat('en-IN')` / `₹`)

---

## Palette Tokens

| Token | Usage | Tailwind Color |
| :--- | :--- | :--- |
| **Brand Primary** | Main actions, brand accents | `brand-600` (`#dc2626` / Rose-Red accent) |
| **Corporate Dark** | Admin portal & public hero headers | `slate-900` (`#0f172a`), `slate-950` |
| **Light Canvas** | Public site & member portal background | `slate-50` (`#f8fafc`), `white` |
| **Success Emerald** | Active status, earnings, approved payouts | `emerald-600`, `bg-emerald-50` |
| **Warning Amber** | Pending payouts, featured badges | `amber-500`, `bg-amber-50` |
| **Danger Rose** | Suspended status, error states | `rose-600`, `bg-rose-50` |

---

## Thematic Identity

1. **Public Website**: Clean corporate aesthetic communicating quality, trust, and business opportunity.
2. **Member Portal**: Crisp, intuitive SaaS dashboard focusing on Wallet Balance, Direct Referrals, Downline Tree, and Payout Requests.
3. **Admin Portal**: Executive, high-density SaaS management layout focusing on System Stats, Member Management, Payout Approval Queue, and Audit Trail.
