---
trigger: always_on
---

# Zup Protocol: Design & Engineering Manifesto

## 1. The Core Philosophy (The North Star)

- **The Grandma Test:** If a user’s grandmother cannot find a 5% yield pool and deposit within 3 clicks, the UX has failed.
- **The Mother’s Care:** Every interaction must be polished. Buttons should have haptic-like scale effects (0.95x on click), hover states should be spring-based, and loading states must be beautiful skeleton screens, never blank white.

## 2. Elite UX: Progressive Disclosure & Intent-Centricity

- **Hide the Complexity:** Use "Progressive Disclosure." Only show the TVL and Yield upfront. Hide the "Gas limit," "Slippage," and "Contract address" inside a "Details" dropdown for experts.
- **No Dead Ends:** Every success/error message must provide a "Next Step" button. Never leave a user staring at a "Transaction Confirmed" screen without a way back to their dashboard.

## 3. Elite UI: "The 2026 Motion Standard"

- **Spring Over Linear:** Linear "Ease-in" animations are forbidden as they feel robotic.
- **Micro-interactions:** Icons should be "alive." The Journal should write, the Settings gear should mesh, and the Wallet icon should "breathe" when connected.

## 4. Web3 Mechanics: "It Just Works"

- **Optimistic UI:** When a user clicks "Deposit," the UI should reflect the change _instantly_ with a "Pending" badge. Do not wait 15 seconds for the blockchain to respond before updating the screen.
- **Human-Readable Transactions:** Never show "Function: swapExactTokensForTokens." Instead, show: "Action: Swapping 100 USDC for 0.04 ETH."
