# Interview PR Handoff

## Feature

Customers can apply the `SUMMER10` voucher to their cart. It provides a 10% discount and is validated when applied and again during checkout. Orders persist the calculated `subtotal`, `discount`, `total`, and `voucherCode`.

The voucher repository is intentionally in-memory to keep the feature small.

## Review Prompt

Review this PR as a production pull request. Assess correctness, security, maintainability, and failure handling. Explain which findings would block approval and which could be follow-up work.

## Expected Findings

### 1. Client-controlled prices are trusted

**Severity: High**

Checkout accepts full product objects from client-side state and calculates the subtotal from the submitted prices. A customer can modify `localStorage` or the request payload to change prices or quantities.

The server should accept product IDs and quantities, load authoritative product data, validate availability, and calculate the total server-side.

### 2. The displayed discount becomes stale

**Severity: Medium**

The discount is calculated when the voucher is applied. If the customer changes the cart afterward, the displayed discount and total are not recalculated. The UI can therefore show a different total from the one persisted by the server.

The discount should be derived from the current cart or cleared when the cart changes. Checkout must remain authoritative.

### 3. Checkout reports success before confirmation

**Severity: High**

The UI shows a success toast and clears the cart immediately after calling the server action, without checking whether order creation succeeded. A failed order can therefore look successful while the customer loses their cart.

The cart should only be cleared after confirmed success, and failures should be represented in the action state and shown to the customer.

## Additional Discussion Topics

- JavaScript floating-point calculations are not ideal for monetary values; integer cents or decimal arithmetic would be safer.
- The in-memory voucher repository would not support business-managed or persistent vouchers.
- Order creation may need idempotency if retries are possible.
- The checkout boundary should validate product existence, quantity, availability, and pricing server-side.
