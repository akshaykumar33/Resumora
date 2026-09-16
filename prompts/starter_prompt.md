# ROLE

You are the founding Staff+ Engineer, Product Architect, Security Architect, Developer Experience Engineer, Open-Source Maintainer, UI/UX Architect, QA Lead, SRE and Technical Writer for a new developer-infrastructure project.

Your job is NOT to rush into implementation.

Your first responsibility is to turn the concept below into a production-grade, open-source-first product with:

* validated problem definition
* competitive differentiation
* product requirements
* architecture
* protocol specifications
* security model
* repository structure
* engineering standards
* AI-agent instructions
* skills
* ADRs
* RFCs
* GitHub workflow
* commit conventions
* design system
* documentation website architecture
* testing strategy
* observability strategy
* release/versioning strategy
* phased roadmap
* starter implementation

Do not create fake differentiation.

If an existing technology solves something well, use or integrate it rather than rebuilding it merely to appear unique.

The innovation must primarily come from solving an important problem better.

---

# 1. PRODUCT VISION

We are NOT building:

* another IndexedDB wrapper
* another Dexie clone
* another localStorage abstraction
* another generic database
* another offline cache
* another generic sync library

The problem we want to solve is:

> Users lose or interrupt meaningful work when applications experience refreshes, browser crashes, app termination, session expiration, authentication changes, unreliable connectivity, backend outages, partial uploads, device changes or multi-step workflow interruptions.

We want to create an:

# Application Continuity & Workflow Recovery Runtime

Its goal is:

> Make user work recoverable across network failure, application restart, browser refresh/crash, session expiration, temporary backend failure and eventually device transitions.

The browser/mobile device should be capable of remembering permitted unfinished WORK and USER INTENT rather than merely caching API responses.

---

# 2. EXAMPLE

A user completes 17 steps of a 25-step workflow.

They have:

* entered data
* uploaded files
* made selections
* written rich text
* navigated through nested sections

Then:

* Wi-Fi disappears
* token expires
* tab crashes
* browser restarts

The application should be capable of recovering the permitted state and saying:

"Continue where you left off."

Potentially recovering:

* workflow
* current step
* drafts
* unsynchronized operations
* attachments
* navigation context
* selected entities
* editor state
* relevant UI state
* checkpoints

After authentication/authorization is restored, the runtime reconciles local work with the authoritative backend.

---

# 3. IMPORTANT SECURITY PRINCIPLE

Persistence must NEVER mean authorization.

Locally stored data must never allow one:

* user
* tenant
* organization
* account
* workspace

to access another user's information.

Logout must support concepts such as:

LOCK → REAUTHENTICATE → REAUTHORIZE → UNLOCK → REVALIDATE → RECONCILE

instead of blindly assuming persisted information remains authorized.

Design for:

* tenant isolation
* user isolation
* device identity
* namespace isolation
* secure local persistence
* revocation
* expiration
* purge policies
* logout policies
* compromised-device assumptions
* XSS considerations
* encryption limitations
* sensitive-data classifications

Never claim browser-side encryption is secure merely because data is encrypted if JavaScript can freely obtain the key.

---

# 4. CORE PRODUCT ABSTRACTIONS

Investigate abstractions such as:

## Workspace

A recoverable scope belonging to an authorized identity/context.

## Resource

Application data governed by continuity policies.

## Intent

A meaningful user action that may survive interruption.

## Mutation

An operation waiting to reach the authoritative backend.

## Checkpoint

A recoverable snapshot/reference representing meaningful progress.

## Continuity Timeline

Chronological representation of important application/workflow events.

## Device

A client participating in continuity.

## Identity Namespace

Tenant/user/device/application scope controlling local data isolation.

## Sync Cursor

Incremental synchronization position.

## Policy

Rules governing persistence, offline behavior, recovery, security and synchronization.

## Conflict

Divergence requiring deterministic or domain-specific reconciliation.

## Recovery

Restoration of interrupted user work.

These are hypotheses.

Improve, rename, remove or add abstractions when architectural analysis justifies it.

---

# 5. PLATFORM TARGETS

Design one platform-independent core with adapters.

Potential packages:

@PROJECT/core
@PROJECT/protocol
@PROJECT/web
@PROJECT/react
@PROJECT/next
@PROJECT/react-native
@PROJECT/node
@PROJECT/storage-indexeddb
@PROJECT/storage-sqlite
@PROJECT/transport-rest
@PROJECT/transport-websocket
@PROJECT/devtools
@PROJECT/testing

Do NOT create all packages immediately.

Determine the smallest sensible initial package graph.

Web may use:

IndexedDB
Dexie where useful
Service Workers
BroadcastChannel
Web Locks
Web Crypto where appropriate
TanStack Query integrations

Mobile may eventually use:

SQLite
React Native
native background execution/network APIs

Desktop may eventually use:

SQLite/filesystem/native adapters

The core protocol must not depend on a particular storage engine.

---

# 6. POSSIBLE TECHNOLOGY STACK

Evaluate rather than blindly accept:

Frontend/docs:

* TypeScript
* React
* Next.js
* Tailwind CSS
* shadcn/ui or equivalent primitives
* MDX
* Storybook where useful

Core runtime:

* TypeScript initially
* strongly typed schemas
* Zod or suitable equivalent

Backend/control plane:
Evaluate:

* TypeScript/NestJS
* Go
* Rust

Use Go/Rust only where their benefits justify complexity.

Infrastructure:

* PostgreSQL
* Redis where justified
* WebSockets/SSE
* object storage
* OpenTelemetry
* Docker
* GitHub Actions
* Terraform later if needed

Monorepo:
Evaluate:

* pnpm
* Turborepo
* Nx

Choose one and document why through an ADR.

---

# 7. STORAGE MUST BE PLUGGABLE

Architecture:

Application
↓
Continuity Runtime
↓
Storage Interface
↓
Adapters
├── IndexedDB/Dexie
├── SQLite
├── Memory
└── Custom

Dexie is therefore an implementation dependency/adapter where appropriate, NOT the product itself.

---

# 8. POLICY ENGINE

Investigate a declarative API similar to:

```ts
continuity.resource("draft", {
  persistence: {
    mode: "persistent",
    maxAge: "7d"
  },

  offline: {
    read: true,
    write: true
  },

  recovery: {
    enabled: true,
    checkpoint: "automatic"
  },

  sync: {
    strategy: "background",
    priority: "high"
  },

  conflict: {
    strategy: "manual"
  },

  security: {
    logout: "lock",
    revoke: "purge"
  }
});
```

Do not treat this exact syntax as final.

Design a clean type-safe API after studying developer ergonomics.

---

# 9. NETWORK INTELLIGENCE

Do not equate:

navigator.onLine === true

with a healthy network.

Design eventual support for states such as:

OFFLINE
DEGRADED
HIGH_LATENCY
METERED
STABLE

The engine may adapt:

* retry
* batching
* prefetch
* uploads
* synchronization priority
* payload sizes

according to network conditions.

Keep V1 appropriately scoped.

---

# 10. WORKFLOW RECOVERY

This is a core differentiator.

Model:

START
↓
ACTION
↓
CHECKPOINT
↓
ACTION
↓
CHECKPOINT
↓
INTERRUPTION
↓
RECOVERY
↓
REAUTHORIZATION
↓
RECONCILIATION
↓
CONTINUE

Investigate recovery for:

* forms
* editors
* LMS assessments
* CRM workflows
* onboarding
* insurance claims
* field-service inspections
* application processes
* CMS workflows

Do not attempt every vertical in V1.

Choose one outstanding reference demo.

---

# 11. REFERENCE APPLICATION

Create a realistic reference application demonstrating the product.

Prefer a long-running workflow such as:

"25-step enterprise application/inspection workflow"

The demo should allow us to intentionally:

* disconnect network
* expire authentication
* refresh browser
* close/reopen browser
* crash simulated API
* create conflicting edits

and demonstrate recovery.

Provide a developer/debug panel displaying:

Continuity Timeline
Checkpoints
Pending Intents
Pending Mutations
Sync Cursor
Network State
Storage State
Conflict State
Recovery Events

The demo must visually prove the product's value.

---

# 12. DEVTOOLS

Plan a developer tool similar conceptually to React Query Devtools.

It should eventually show:

WORKSPACE

NETWORK
ONLINE / DEGRADED / OFFLINE

LOCAL STATE

INTENTS

MUTATION QUEUE

CHECKPOINTS

SYNC

CONFLICTS

RECOVERY

TIMELINE

STORAGE

POLICIES

DEVICES

Allow fault simulation in development:

Go Offline
Simulate 2G
Expire Session
Crash API
Create Conflict
Restart Runtime
Clear Memory Cache
Simulate App Restart

---

# 13. OPEN SOURCE + COMMERCIAL MODEL

Core should be open-source friendly.

Possible structure:

FREE OSS

* runtime
* web adapter
* storage adapters
* React integrations
* local recovery
* basic sync
* devtools
* self-hostable reference backend/protocol

OPTIONAL CLOUD

* hosted synchronization
* device registry
* recovery analytics
* conflict analytics
* failed-sync monitoring
* fleet/device visibility
* enterprise policy management
* audit history
* observability
* SLA/support
* managed infrastructure

Do not intentionally cripple OSS to force cloud adoption.

---

# 14. PRODUCT METRICS

Investigate metrics such as:

Work Saved
Interrupted Workflows
Recovery Success Rate
Recovery Failure Rate
Median Recovery Time
Pending Mutation Age
Sync Success Rate
Conflict Rate
Data Reconciliation Latency
Offline Session Rate

Clearly define every metric.

---

# 15. NAMING RESEARCH

Before choosing the repository/product name, perform current web/package research.

Generate at least 30 candidate names.

Prefer:

* invented words
* 5–10 characters where possible
* easy pronunciation
* strong developer-tool identity
* no obvious "AI" suffix
* not tied exclusively to offline/storage

Ideas to investigate, NOT assume available:

Resumora
Persistara
Continuara
Workloom
FlowVault
StateHarbor
RepriseKit
RevivaState
Unlost

For finalists verify, as far as available research allows:

* GitHub organization/repository collision
* npm package collision
* domain availability indicators
* major software/product collision
* obvious trademark/business collision
* search-engine ambiguity

Create:

docs/brand/NAMING_RESEARCH.md

Select:

PRIMARY
BACKUP 1
BACKUP 2

Explain the evidence and limitations.

Never claim a name is legally/trademark safe without appropriate evidence.

---

# 16. REPOSITORY STRUCTURE

Design a professional monorepo.

Possible direction:

/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── apps/
│   ├── docs/
│   ├── playground/
│   └── reference-app/
│
├── packages/
│   ├── core/
│   ├── protocol/
│   ├── web/
│   ├── react/
│   ├── storage-memory/
│   ├── storage-indexeddb/
│   └── devtools/
│
├── examples/
│
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── protocols/
│   ├── security/
│   ├── engineering/
│   ├── testing/
│   ├── operations/
│   ├── product/
│   ├── brand/
│   ├── adr/
│   ├── rfc/
│   └── roadmap/
│
├── skills/
├── scripts/
├── tooling/
├── tests/
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── CHANGELOG.md
└── package.json

Improve this structure and avoid empty-directory theater.

Every directory must have a reason to exist.

---

# 17. REQUIRED DOCUMENTATION

Before major implementation, create useful versions of:

README.md

docs/product/

* VISION.md
* PROBLEM.md
* PERSONAS.md
* USE_CASES.md
* NON_GOALS.md
* DIFFERENTIATION.md
* PRODUCT_REQUIREMENTS.md
* SUCCESS_METRICS.md

docs/architecture/

* SYSTEM_OVERVIEW.md
* CORE_RUNTIME.md
* STORAGE_ARCHITECTURE.md
* SYNC_ARCHITECTURE.md
* RECOVERY_ARCHITECTURE.md
* INTENT_MODEL.md
* CHECKPOINT_MODEL.md
* POLICY_ENGINE.md
* PLATFORM_ADAPTERS.md
* MULTI_DEVICE.md
* FAILURE_MODEL.md

docs/protocols/

* PROTOCOL_OVERVIEW.md
* RESOURCE_SPEC.md
* INTENT_SPEC.md
* MUTATION_SPEC.md
* CHECKPOINT_SPEC.md
* SYNC_SPEC.md
* CONFLICT_SPEC.md
* VERSIONING_SPEC.md

docs/security/

* THREAT_MODEL.md
* DATA_CLASSIFICATION.md
* LOCAL_STORAGE_SECURITY.md
* AUTH_BOUNDARIES.md
* TENANT_ISOLATION.md
* LOGOUT_REVOCATION.md
* ENCRYPTION_MODEL.md
* SECURITY_CHECKLIST.md

docs/engineering/

* ENGINEERING_PRINCIPLES.md
* CODING_STANDARDS.md
* TYPESCRIPT_STANDARDS.md
* API_DESIGN.md
* ERROR_HANDLING.md
* OBSERVABILITY.md
* PERFORMANCE_BUDGETS.md
* DEPENDENCY_POLICY.md

docs/testing/

* TEST_STRATEGY.md
* UNIT_TESTING.md
* INTEGRATION_TESTING.md
* E2E_TESTING.md
* CHAOS_TESTING.md
* SECURITY_TESTING.md
* COMPATIBILITY_MATRIX.md

docs/roadmap/

* ROADMAP.md
* PHASE_0_RESEARCH.md
* PHASE_1_CORE.md
* PHASE_2_WEB.md
* PHASE_3_RECOVERY.md
* PHASE_4_SYNC.md
* PHASE_5_DEVTOOLS.md
* PHASE_6_MOBILE.md
* PHASE_7_CLOUD.md
* BACKLOG.md

docs/brand/

* NAMING_RESEARCH.md
* BRAND_GUIDE.md
* DESIGN_PRINCIPLES.md

Create ADRs for significant decisions.

Create RFCs for major new protocols/features.

Do not create hundreds of meaningless Markdown files.

Documentation must contain decisions, reasoning, examples and acceptance criteria.

---

# 18. AI AGENT INSTRUCTIONS

Create an agent-friendly repository.

Investigate conventions supported by major coding agents and create appropriate repository instructions without duplicating contradictory rules.

Create something like:

AGENTS.md

and platform-specific instruction files only where useful.

AGENTS.md should explain:

* product mission
* architectural boundaries
* package dependency rules
* security invariants
* testing requirements
* documentation requirements
* prohibited shortcuts
* commit rules
* definition of done

Agents must read relevant architecture/ADR documentation before modifying critical subsystems.

---

# 19. SKILLS

Create reusable project skills under:

skills/

Potential skills:

architecture-review/
security-review/
protocol-change/
storage-adapter/
sync-engine/
recovery-feature/
react-integration/
testing/
documentation/
release/
performance-review/

Each skill should explain:

WHEN TO USE
INPUTS
PROCESS
CHECKS
OUTPUTS
FAILURE CONDITIONS

Do not create fake "skills" containing generic motivational instructions.

They should behave like engineering runbooks for AI agents and humans.

---

# 20. DESIGN SYSTEM

The docs/playground/reference application must look like a premium developer infrastructure product.

Take inspiration conceptually from high-quality developer products such as Stripe, Linear, Vercel, Raycast and modern infrastructure documentation, but DO NOT copy proprietary layouts, branding or assets.

Visual direction:

* sophisticated
* technical
* minimal
* highly responsive
* excellent typography
* dark/light themes
* restrained gradients
* subtle depth
* smooth motion
* accessible
* fast
* non-generic AI-generated appearance

Create:

docs/brand/DESIGN_PRINCIPLES.md
docs/brand/BRAND_GUIDE.md

Define:

* typography hierarchy
* spacing system
* radius
* surfaces
* elevation
* semantic colors
* status indicators
* motion principles
* responsive behavior
* accessibility requirements
* diagrams
* code blocks
* data visualization principles

Avoid excessive glassmorphism and meaningless animations.

---

# 21. DOCUMENTATION WEBSITE

Design docs information architecture:

Getting Started

Concepts

* Continuity
* Workspaces
* Resources
* Intents
* Mutations
* Checkpoints
* Recovery
* Sync
* Conflicts
* Policies

Platforms

* Web
* React
* Next.js
* React Native [future]

Guides

* Recover a form
* Survive refresh
* Offline mutations
* Session expiration
* Secure logout
* Build custom storage adapter
* Build custom transport

Architecture

Security

API Reference

Examples

Devtools

Self Hosting

Cloud [future]

---

# 22. GITHUB ENGINEERING MODEL

Configure professional contribution workflows.

Branches:

main
feature/*
fix/*
docs/*
refactor/*
test/*
chore/*
release/*

Prefer short-lived branches.

Protect main.

Require:

* PR
* CI
* tests
* lint
* typecheck
* appropriate review
* security checks where relevant

Create PR template covering:

WHAT
WHY
HOW
TESTING
SECURITY
PERFORMANCE
DOCS
BREAKING CHANGES

---

# 23. COMMIT CONVENTION

Use Conventional Commits.

Examples:

feat(core): add workspace lifecycle
feat(web): add IndexedDB adapter
feat(recovery): persist workflow checkpoint
fix(sync): prevent duplicate mutation replay
docs(protocol): define checkpoint semantics
test(recovery): cover browser restart scenario
refactor(core): isolate persistence interface
perf(web): reduce checkpoint serialization
security(auth): purge revoked workspace keys
chore(repo): configure changesets

Rules:

* one logical change per commit
* meaningful commit messages
* no "changes"
* no "fix stuff"
* no giant mixed commits
* tests travel with behavior changes
* docs travel with public API changes

Create:

docs/engineering/COMMIT_GUIDE.md

---

# 24. VERSIONING + RELEASES

Design:

Semantic Versioning
Changesets or justified alternative
npm publishing
GitHub Releases
CHANGELOG generation
pre-release channels

Potential:

0.x experimental
1.0 stable protocol/runtime

Public protocol changes require explicit compatibility review.

---

# 25. TESTING

Use appropriate tools such as:

Vitest
Playwright
fake timers
network simulation
storage fault injection

Test failure scenarios, not merely happy paths.

Required scenarios eventually include:

refresh
tab crash simulation
browser restart
offline
intermittent network
request timeout
duplicate request
session expiry
token refresh failure
backend unavailable
storage quota exceeded
corrupted local record
schema migration
conflicting changes
duplicate mutation replay
multi-tab operation
logout
revocation
tenant switching

Property-based testing should be evaluated for core state-machine/protocol invariants.

---

# 26. CHAOS / FAULT LAB

Create a development Fault Lab.

Allow deterministic simulation of:

* network disconnect
* packet/request delay
* API 500
* API timeout
* auth expiry
* storage failure
* sync interruption
* duplicate delivery
* out-of-order events
* stale versions
* conflicts

Recovery infrastructure cannot be considered reliable if it is only tested under perfect conditions.

---

# 27. OBSERVABILITY

Design structured events around:

continuity.workspace.created
continuity.intent.recorded
continuity.checkpoint.created
continuity.recovery.started
continuity.recovery.completed
continuity.recovery.failed
continuity.sync.started
continuity.sync.completed
continuity.sync.failed
continuity.conflict.detected
continuity.workspace.locked
continuity.workspace.purged

Support OpenTelemetry integration eventually.

Never leak sensitive user data into telemetry.

---

# 28. PERFORMANCE

Define measurable budgets.

Investigate:

startup overhead
bundle size
checkpoint latency
serialization cost
IndexedDB latency
memory footprint
recovery latency
sync overhead

The SDK must not make applications noticeably slower in order to make them resilient.

---

# 29. PHASE PLAN

Design detailed deliverables, dependencies, exit criteria and tests for every phase.

Suggested starting point:

PHASE 0
Research + problem validation + naming + architecture

PHASE 1
Core state machine + interfaces + memory adapter

PHASE 2
Web persistence + IndexedDB adapter

PHASE 3
Workflow checkpoints + browser recovery

PHASE 4
Mutation queue + synchronization protocol

PHASE 5
Conflict handling + fault simulation + Devtools

PHASE 6
React/Next integrations + polished reference app

PHASE 7
Mobile/SQLite research + prototype

PHASE 8
Self-hosted sync service

PHASE 9
Optional managed cloud/control plane

PHASE 10
Production hardening + 1.0

Do not blindly accept this ordering.

Improve it after architecture analysis.

Each phase document must contain:

GOAL
WHY
SCOPE
NON-SCOPE
DEPENDENCIES
IMPLEMENTATION TASKS
TESTS
SECURITY REVIEW
PERFORMANCE REVIEW
DOCUMENTATION
DEMO
EXIT CRITERIA

---

# 30. PHASE EXECUTION RULE

Do NOT implement all phases now.

First:

1. research the problem
2. research existing products
3. research names
4. write product docs
5. establish architecture
6. write ADRs
7. define protocol boundaries
8. establish repo conventions
9. define security invariants
10. create phased roadmap

Then scaffold only what Phase 0/Phase 1 genuinely requires.

Stop before building later phases.

---

# 31. COMPETITIVE RESEARCH

Research relevant technologies/products including categories such as:

IndexedDB wrappers
local-first databases
offline-first databases
sync engines
workflow engines
form recovery/autosave
mobile sync
CRDT frameworks
state persistence
application recovery

Examples worth investigating include Dexie, RxDB, ElectricSQL, PowerSync, Replicache and other current alternatives.

Create:

docs/product/COMPETITIVE_LANDSCAPE.md

For each relevant product explain:

WHAT PROBLEM IT SOLVES
WHAT IT DOES WELL
WHAT WE SHOULD USE/LEARN
WHERE OUR TARGET PROBLEM DIFFERS
WHETHER WE COMPETE, COMPLEMENT OR INTEGRATE

Never manufacture weaknesses.

---

# 32. DIFFERENTIATION TEST

Before implementation, answer:

Why does this need to exist?

Why isn't Dexie enough?

Why isn't IndexedDB enough?

Why isn't TanStack Query persistence enough?

Why isn't a sync database enough?

Why isn't autosave enough?

Who experiences the problem?

How painful is it?

Who pays for solving it?

What is the smallest compelling use case?

What can we demonstrate in five minutes that makes a developer understand the value?

What measurable outcome improves?

If these questions do not produce convincing answers, revise the product before building it.

---

# 33. PRODUCT NORTH STAR

The north-star concept should be:

WORK RECOVERED

not:

ROWS STORED

or:

CACHE HITS

Potential product statement:

"Your user should never lose meaningful work because the application environment became unreliable."

Treat this as a hypothesis to validate, not marketing truth.

---

# 34. DEFINITION OF DONE

A feature is not done merely because code compiles.

For relevant changes require:

implementation
types
tests
failure-path tests
security consideration
performance consideration
docs
example
telemetry where appropriate
migration consideration
backwards compatibility consideration
clean commit

---

# 35. FIRST EXECUTION

Execute only the following now.

## STEP A — Research

Research:

* existing solutions
* current libraries
* prior art
* package names
* product names
* architectural approaches

## STEP B — Product Definition

Create:

VISION
PROBLEM
PERSONAS
USE_CASES
NON_GOALS
DIFFERENTIATION
COMPETITIVE_LANDSCAPE
SUCCESS_METRICS

## STEP C — Architecture

Create initial:

SYSTEM_OVERVIEW
CORE_RUNTIME
RECOVERY_ARCHITECTURE
STORAGE_ARCHITECTURE
SECURITY_MODEL
PROTOCOL_OVERVIEW

## STEP D — Decisions

Create initial ADRs for:

monorepo
runtime language
storage abstraction
web storage implementation
state/intent model
sync boundary
testing stack

## STEP E — Repository

Create:

professional monorepo skeleton
GitHub configuration
linting
formatting
TypeScript
testing
CI
changesets/versioning
agent instructions

## STEP F — Roadmap

Create detailed phase documents.

## STEP G — Starter

Implement only enough to prove:

Application
↓
Core Runtime
↓
Workspace
↓
Intent
↓
Checkpoint
↓
Memory Storage Adapter

with tests.

Do NOT implement production synchronization yet.

---

# 36. FINAL OUTPUT AFTER STARTER GENERATION

At completion print:

1. selected project name + backups
2. problem statement
3. USP hypothesis
4. competitive positioning
5. architecture summary
6. repository tree
7. package graph
8. generated documentation
9. generated ADRs
10. security invariants
11. testing strategy
12. roadmap
13. Phase 0 status
14. Phase 1 status
15. exact next task
16. exact command to run locally
17. tests executed and results
18. known risks/open questions

Do not claim tests passed unless they were actually executed.

Do not claim availability/research findings unless they were actually checked.

---

# FINAL PRINCIPLE

Do not optimize this project for:

"How much code can an AI generate?"

Optimize it for:

"Can this become infrastructure developers trust with unfinished user work?"

Architecture > code volume.

Correctness > cleverness.

Recovery > caching.

Authorization > persistence.

Developer experience > unnecessary complexity.

Real problem > artificial uniqueness.

Start with research and documentation, establish the repository foundation, implement only the Phase 0/1 starter, run the relevant tests, and stop with a precise next-step report.
