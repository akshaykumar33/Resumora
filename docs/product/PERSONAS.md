# User Personas

## 1. Staff Frontend & Platform Architect
- **Profile**: Leads client infrastructure for large enterprise SaaS / Fintech / Healthcare platforms.
- **Pain Point**: Product managers demand offline-tolerant complex forms, but existing solutions require completely rewriting backends to CRDTs or GraphQL.
- **Needs**: Drop-in runtime that wraps standard REST/RPC APIs, guarantees zero data leakage across multi-tenant auth boundaries, and conforms to SOC2 compliance.

## 2. Enterprise Product Engineer
- **Profile**: Builds high-volume, multi-step customer workflows (e.g. mortgage applications, procurement wizards).
- **Pain Point**: Spends weeks building ad-hoc `localStorage` auto-savers that break when schemas change or leak data across different logged-in users on shared laptops.
- **Needs**: Clean hooks (`useWorkflowRecovery`, `useCheckpoint`) with automatic recovery prompts.

## 3. The End-User
- **Profile**: Submitting lengthy financial declarations or field audit reports on flaky Wi-Fi.
- **Needs**: "Continue where you left off" dialog that faithfully restores filled inputs, uploaded attachments, and exact step positions after browser crashes.
