# Security Specification - MoodFlow

## Data Invariants
1. An **Entry** must be owned by the user who created it (`userId == request.auth.uid`).
2. An **Entry** date must be in YYYY-MM-DD format.
3. Users can only `read`, `create`, `update`, and `delete` their OWN entries. No one else's.
4. `moodScore`, `clarity`, and `confidence` must be numbers between 1 and 10.
5. `suggestions` must be an array of exactly 3 strings (as per app logic).
6. `id` and `userId` and `timestamp` are immutable after creation.
7. `createdAt` (timestamp) must match `request.time`.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: User A tries to create an entry for User B (`userId: "UserB"`).
2. **Resource Poisoning**: Entry ID contains special characters or is too long.
3. **Ghost Field**: Adding `isVerified: true` to an entry.
4. **Invalid Type**: `moodScore: "excellent"` (string instead of number).
5. **Boundary Breach**: `moodScore: 11`.
6. **State Shortcutting**: Updating `userId` after creation to transfer ownership.
7. **Size Attack**: `emotionalPatterns` string is 500KB.
8. **Orphaned Write**: Requesting a write without being signed in.
9. **Unverified Auth**: Attempting a write with an unverified email (if enforced).
10. **Shadow List**: Listing all entries in the collection without a user filter.
11. **Negative Score**: `clarity: -5`.
12. **Wrong Suggestions Count**: Providing 5 suggestions instead of 3.

## Test Runner Logic
The `firestore.rules` will be mathematically audited to reject these.
