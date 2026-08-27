# Security Specification: Zayn.Fashion Firestore ABAC Security

## 1. Data Invariants
- **Products**: Any visitor can read public product catalogs (`allow read: if true`). Only verified Store Admin (`nayeemalizayn@gmail.com` / `mskhereiam5610@gmail.com` or doc in `/admins/$(request.auth.uid)`) can create, update, or delete products. Product IDs must conform to alphanumeric/hyphen/underscore patterns (`^[a-zA-Z0-9_\-]+$`) with max size 128 chars.
- **Categories**: Any visitor can read store categories (`allow read: if true`). Only verified Store Admin can create, update, or delete categories.
- **Orders**: Orders can be created with valid order details (non-empty items, valid total, shipping address). Customers can read their own orders (`resource.data.userId == request.auth.uid` or matching user email). Store Admin can read, list, and update all order statuses. Once an order is delivered or cancelled, only Admin can alter its status.
- **Users**: User profiles (`/users/{userId}`) are private. Only the authenticated owner (`request.auth.uid == userId`) or Store Admin can read or write their user profile. Role elevation to `admin` by regular users is strictly prevented.
- **Admins**: Admin documents (`/admins/{adminId}`) are only readable and writable by verified admins. Default deny catch-all prevents any rogue subcollection access.

## 2. The "Dirty Dozen" Attack Payloads (Targeting Rejection)
1. **Payload 1 (Ghost Field Injection on Product)**: Attacker attempts to create a product with injected hidden arbitrary field `__shadowRoot: true`. -> *Rejected by exact key/schema validation*.
2. **Payload 2 (Unauthenticated Product Create)**: Unauthenticated visitor attempts to `setDoc` on `/products/p-fake`. -> *Rejected (Admin check fails)*.
3. **Payload 3 (Non-Admin Product Update)**: Regular customer attempts to change price of a product to `৳1`. -> *Rejected (Admin check fails)*.
4. **Payload 4 (Privilege Escalation on User Profile)**: Normal customer attempts to update `/users/{uid}` with `role: "admin"`. -> *Rejected by role immutability / non-admin prohibition*.
5. **Payload 5 (Cross-User Profile Read)**: User A attempts to `getDoc` on `/users/UserB`. -> *Rejected (isOwner check fails)*.
6. **Payload 6 (Order Spoofing / Injected Negative Price)**: Malicious client attempts to create order with `total: -500`. -> *Rejected by order integrity validation (total >= 0)*.
7. **Payload 7 (Cross-User Order Deletion)**: Customer attempts to delete another customer's order. -> *Rejected (Admin only delete)*.
8. **Payload 8 (Terminal State Tampering)**: Customer attempts to reopen a `delivered` or `cancelled` order. -> *Rejected by terminal state gate*.
9. **Payload 9 (ID Poisoning Attack)**: Attacker sends 2MB long junk characters string as document ID. -> *Rejected by `isValidId()` regex and length constraint*.
10. **Payload 10 (Denial of Wallet Huge Payload)**: Attacker attempts to write a 1MB string into product name. -> *Rejected by `.size() <= 200` constraint*.
11. **Payload 11 (Unverified Email Admin Spoofing)**: Attacker creates email account with unverified token pretending to be admin email. -> *Rejected by `email_verified == true` gate*.
12. **Payload 12 (Blanket Query Scraping)**: Unauthenticated scraper attempts blanket collection query on `/users`. -> *Rejected by strict list security enforcement*.
