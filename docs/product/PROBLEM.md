# Problem Definition & Failure Modes

## 1. The Volatility Gap

Web application development operates under an optimistic illusion: the browser runtime is assumed stable, network connections are assumed continuous, and authentication tokens are assumed fresh.

In reality, end-users experience regular interruptions:

- **Tab Discarding & Memory Eviction**: Browsers discard background tabs when system RAM exceeds thresholds.
- **Accidental Navigation & Refresh**: Form inputs, unsaved rich text, and dynamic wizard steps vanish instantly.
- **Session & Token Expiration**: Long form-filling workflows trigger 401 Unauthorized responses upon final submission, wiping out 45 minutes of user input.
- **Network Flapping & Captive Portals**: Requests drop silently; optimist UI updates fail or cause inconsistent local state.
- **Micro-Deployments**: CI/CD pipelines ship new frontend bundles mid-session, forcing hard cache refreshes that clear in-memory state.

## 2. Real-World Impact

- **Enterprise Onboarding**: A 20-step KYC verification workflow lost at Step 18 causes 42% permanent funnel drop-off.
- **Field Inspection / Insurance Claims**: Disconnected mobile safari tabs wipe photos and damage notes in low-reception zones.
- **Internal Tools & CRMs**: Support agents losing ticket drafts during shift transitions and concurrent tab updates.
