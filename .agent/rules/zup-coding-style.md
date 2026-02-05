---
trigger: always_on
---

# Zup Coding Style & Standards

This document defines the mandatory engineering and aesthetic standards for the Zup codebase. Adherence to these rules is non-negotiable to maintain long-term maintainability and readability.

---

## 1. Naming Conventions: Clarity Over Brevity

We prioritize **Semantic Intent**. A developer should understand a file's purpose just by looking at the file tree.

- **Descriptive Naming:** Always choose clear, descriptive names over short, ambiguous ones.
  - **Bad:** `user/name.ts`, `utils/logic.ts`
  - **Good:** `user/user-display-name-formatter.ts`, `auth/session-validation-service.ts`
- **Kebab-Case:** All folders and file names must use `kebab-case`.
- **Functional Suffixes:** Use suffixes to identify the file type at a glance:
  - `-provider.tsx` (Context Providers)
  - `-hook.ts` (Custom React Hooks)
  - `-processor.ts` (Data transformation logic)
  - `-service.ts` (External API/Business logic)

---

## 2. The "No Junk" Comment Policy

Comments are often a sign of unclear code. Focus on making the logic **self-documenting**.

- **Why, not What:** Never use comments to explain _what_ the code is doing—the code itself should be readable enough to show that. Use comments only to explain **why** a specific, non-obvious decision or workaround was made.
- **Refactor Trigger:** If you feel a block of code needs a comment to be understood, extract that logic into a well-named private function instead.
- **Prohibited Comments:** Never use "separator" comments (e.g., `// --- HANDLERS --- //`). Use logical grouping and white space for separation.

---

## 3. Reusable Component Architecture

We follow a strict hierarchy to prevent "Prop-Drilling" and code duplication.

### 3.1 Global Atoms (The Library)

Generic UI elements (Buttons, Inputs, Modals) must reside in `/src/components/ui`.

- **Statelessness:** These must be purely presentational and agnostic of any business or "Zup-specific" logic.
- **Composition:** Use composition patterns (e.g., passing `children`) rather than adding dozens of boolean props to handle variations.

### 3.2 Feature-Specific Components

Components tied to a specific screen (e.g., `DepositForm`) should stay within that feature's directory.

- **Contextual Attachment:** If a component is specific to one screen and unlikely to be used elsewhere, keep it local to that screen to avoid cluttering the global UI library.
- **Promotion Rule:** If a feature-specific component is needed in **two or more** distinct features, it must be refactored into a Global Atom/Molecule.

---

## 4. Logical File Structure

To ensure consistency, every file must follow this structural sequence:

1.  **Imports:** External libraries first, internal project paths second.
2.  **Types & Interfaces:** Definitions local to the file.
3.  **Constants:** Static values.
4.  **Main Export:** The primary function or component.
5.  **Private Helpers:** Small, non-exported functions used by the main export.

---

## 5. Decision Log

For any complex architectural changes, briefly explain the "Why" behind your choice within the commit message or a localized `README.md` to maintain the project's long-term "Hierarchy of Truth."

## 6. Strict Type Safety & Nominal Integrity

TypeScript must be used to enforce business logic, not just to suppress compiler warnings. Avoid "Primitive Obsession" by ensuring that every value carries its own semantic type and intent through the mandatory use of **Enums** and **Branded Types**.

### 6.1 The "Enum-First" Mandate

Raw `string` and `number` types are strictly prohibited for values with a fixed set of options or high-stakes logic (e.g., Statuses, Chain IDs, Action Types).

- **Mandatory Enums:** All sets of related constants must be defined as Enums. This provides a single, named source of truth and enables robust IDE autocomplete and refactoring.
- **String Enums for Transparency:** Favor **String Enums** (e.g., `enum Status { Pending = 'PENDING', Active = 'ACTIVE' }`) for business-critical states. This ensures that logs, database entries, and API responses remain human-readable while maintaining strict type safety.
- **Numeric Enums for Protocols:** Use **Numeric Enums** only when the underlying protocol or smart contract requires direct integer mapping (e.g., specific internal status codes or byte values).
- **Rationale:** Relying on raw strings across files is a failure of architecture. If a value needs to change, it must be updated in exactly one place: the Enum definition.

### 6.2 Nominal Typing (Branded Types)

For critical Web3 primitives like `Address`, `TransactionHash`, or `BigInt` amounts, use **Branded Types** (Opaque Types) to prevent logical cross-contamination between different types that share the same underlying primitive.

- **The Pattern:** Use intersection types (e.g., `type Address = string & { __brand: 'Address' }`) to ensure a standard string cannot be passed where a validated address is required.
- **Validation Requirement:** All branded types must be instantiated through a "Constructor" or "Guard" function that performs necessary validation (e.g., lowercase check, checksum check) before casting to the Branded Type.

### 6.3 Single Source of Truth

All Enums and shared types must be centralized in the `/src/lib` layer.

- **No Inline Logic:** Never check for a specific value using a raw string or number literal. You must always reference the Enum (e.g., `if (id === IndexerNetwork.Ethereum)`).
- **Maintenance:** By referencing the Enum rather than the raw value, updating a protocol name or a chain ID becomes a one-line change that safely propagates across the entire project via the compiler.

---

## Type Safety Summary

| Scenario       | Lazy Typing (Prohibited)   | Strict Safety (Required)              |
| :------------- | :------------------------- | :------------------------------------ |
| **User Role**  | `let role = "admin"`       | `enum UserRole { Admin = 'ADMIN' }`   |
| **Address**    | `function send(a: string)` | `function send(a: ValidAddress)`      |
| **Chain ID**   | `if (id === 1)`            | `if (id === IndexerNetwork.Ethereum)` |
| **Sync State** | `state = "syncing"`        | `state = IndexerState.Syncing`        |

---

## 7. Named Params
