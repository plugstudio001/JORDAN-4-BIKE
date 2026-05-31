# Security Specification: PulseGrid AI

## 1. Data Invariants
- **Products**: Must have a valid name, price (>0), and stockQuantity (>=0).
- **Transactions**: Must link to a customer/employee, have at least one item, and a valid status. Total amount must match the sum of items (simplified for rules).
- **Employees**: Only admins can manage employee profiles. Every employee must have a valid email and role.
- **Customers**: Any authenticated user can create/read customer profiles (common CRM behavior), but only creator or admin can update/delete.
- **Campaigns**: Only marketing leads/admins can manage campaigns.

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
1. **Shadow Field Injection**: `{"name": "X", "price": 10, "stockQuantity": 5, "isVerified": true}` -> Should fail due to `hasOnly`.
2. **Identity Spoofing**: `{"ownerId": "victim_id", ...}` -> Should fail.
3. **Resource Poisoning (ID)**: Document ID `../../evil` -> Should fail `isValidId`.
4. **Denial of Wallet (Size)**: `{"name": "A".repeat(1001)}` -> Should fail size check.
5. **Negative Value Poisoning**: `{"price": -100}` -> Should fail `isValidProduct`.
6. **Orphaned Write**: Creating a transaction for a non-existent product.
7. **Privilege Escalation**: User updating their own `role` in `employees`.
8. **Terminal State Bypass**: Updating a `completed` transaction status to `pending`.
9. **Unverified Auth**: Accessing data with `email_verified: false`.
10. **Blanket Querying**: Listing all transactions without a `where` clause on `ownerId` (if applicable).
11. **Regex Bypass**: Document ID with special characters like `!@#$%`.
12. **Timestamp Forgery**: Providing a manual `createdAt` instead of `request.time`.

## 3. Test Runner (Draft)
```ts
// firestore.rules.test.ts
// (Conceptual tests for the "Dirty Dozen")
// These tests verify PERMISSION_DENIED for each payload listed above.
```
