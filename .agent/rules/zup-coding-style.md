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
