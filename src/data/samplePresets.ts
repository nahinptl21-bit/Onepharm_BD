export interface SamplePreset {
  id: string;
  name: string;
  badge: 'Exact Match' | 'Subtle Typo' | 'Whitespace/Case' | 'JSON Match' | 'Completely Different';
  description: string;
  infoA: string;
  infoB: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'exact-match',
    name: 'Identical Text',
    badge: 'Exact Match',
    description: 'Both information inputs are 100% character-for-character identical.',
    infoA: `Order Confirmation #89421
Customer: Alex Morgan
Items:
- 1x Ergonomic Keyboard ($120.00)
- 2x USB-C Cables ($24.00)
Shipping Address: 742 Evergreen Terrace, Springfield
Total: $144.00 USD`,
    infoB: `Order Confirmation #89421
Customer: Alex Morgan
Items:
- 1x Ergonomic Keyboard ($120.00)
- 2x USB-C Cables ($24.00)
Shipping Address: 742 Evergreen Terrace, Springfield
Total: $144.00 USD`
  },
  {
    id: 'subtle-diff',
    name: 'Small Typo / Discrepancy',
    badge: 'Subtle Typo',
    description: 'High similarity but with slight discrepancies in numbers and wording.',
    infoA: `Contract Clause 4.2:
The Supplier shall deliver all requested hardware components within 14 business days following receipt of the written purchase order. Late penalties shall incur at a rate of 1.5% per calendar week.`,
    infoB: `Contract Clause 4.2:
The Supplier shall deliver all requested hardware equipment within 30 business days following receipt of the signed purchase order. Late penalties shall incur at a rate of 2.5% per calendar week.`
  },
  {
    id: 'case-whitespace',
    name: 'Case & Formatting Difference',
    badge: 'Whitespace/Case',
    description: 'Same text, but differences in letter casing, extra spaces, and line breaks.',
    infoA: `AUTHENTICATION TOKEN:
SK_LIVE_9824_XKD90_SECRET_KEY
AUTHORIZED ROLES: ADMIN, BILLING`,
    infoB: `authentication token:
    sk_live_9824_xkd90_secret_key    
authorized roles: admin, billing`
  },
  {
    id: 'json-reorder',
    name: 'JSON Data (Reordered Keys)',
    badge: 'JSON Match',
    description: 'Identical data attributes in JSON, but different indentation and key order.',
    infoA: `{
  "id": "usr_9921",
  "name": "Sarah Connor",
  "active": true,
  "roles": ["developer", "reviewer"]
}`,
    infoB: `{
  "active": true,
  "roles": ["developer", "reviewer"],
  "name": "Sarah Connor",
  "id": "usr_9921"
}`
  },
  {
    id: 'unmatched',
    name: 'Completely Different Information',
    badge: 'Completely Different',
    description: 'Two totally unrelated pieces of content.',
    infoA: `Flight Booking Confirmed:
Flight: AI-302 from Tokyo (HND) to San Francisco (SFO)
Departure: October 14, 2026 at 18:30 JST
Seat: 14A (Window)`,
    infoB: `Grocery Shopping Checklist:
- Almond milk (unsweetened)
- Organic honey crisp apples
- Sourdough loaf
- Ethiopian coffee beans`
  }
];
