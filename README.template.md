<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-light.svg">
  <img alt="Ajay Kumar Singh — Tech Lead & Frontend Architect" src="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-dark.svg" width="100%">
</picture>

<!-- BEGIN:tagline -->
<!-- END:tagline -->

**[thealchemyst.dev](https://thealchemyst.dev)** &nbsp;·&nbsp; <!-- BEGIN:links -->
<!-- END:links --> &nbsp;·&nbsp; **[aksingh1493@gmail.com](mailto:aksingh1493@gmail.com)**

</div>

---

I lead engineering on a cross-border payments platform. Nine years across fintech, Web3, and consumer scale — GlobalLogic, Paytm, a Cosmos-based Web3 product, and now a remittance stack I own end to end: Go microservices, React Native, AWS, and the compliance machinery underneath it.

Most of what I ship is in private repositories. So instead of a wall of green squares, here is how I actually think about systems.

---

## The problem I work on

Moving money across a border looks like one API call. It is really a distributed transaction across systems that share neither a clock, nor a ledger, nor an opinion about what failure means.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/architecture-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/architecture-light.svg">
  <img alt="Cross-border settlement architecture: client, auth, KYC, wallet, dual settlement rails, ledger, reconciliation" src="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/architecture-dark.svg" width="100%">
</picture>
</div>

**The happy path is not what makes it hard.**

| Failure mode | Why the naive design breaks |
|---|---|
| Provider times out after debit | Client retries, user is charged twice. Idempotency belongs at the boundary, not in the handler |
| Rate moves mid-transaction | Quote and execution must be separated, with explicit expiry and a re-quote path |
| Webhook arrives before the API response | Ordering cannot be assumed. State machines must accept events out of order |
| Partial settlement | On-chain leg succeeded, fiat leg failed. There is no rollback — only compensation |
| Two services, one shared database | A migration keyed on version alone collides silently across services |
| Config says `0` | Sometimes that means "zero", sometimes "unlimited". Only the running process can tell you |

The lesson I keep relearning: **in payments, the ledger is the product.** Everything else is a user interface over it.

### Why the state machine has to be order-independent

Providers do not promise that their webhook arrives after your HTTP response returns. Model it as a state machine that accepts events in any order, or spend your quarters debugging race conditions.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/state-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/state-light.svg">
  <img alt="KYC state machine: two entry events reach Under review in either order; duplicate webhooks and replayed decisions are self-loops that change nothing" src="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/state-dark.svg" width="100%">
</picture>
</div>

Watch the two entry edges: they run on different periods, so across cycles the acknowledgement and the webhook arrive in both orders. That is the requirement, not an edge case.

The dashed self-loops are the other half. A duplicate webhook and a replayed decision must be no-ops, not errors — otherwise every provider retry becomes an incident.

---

## Selected work

<!-- BEGIN:experience -->
<!-- END:experience -->

---

## Tooling

<!-- BEGIN:stack -->
<!-- END:stack -->

---

## How I work

- **Verify before asserting.** A function that exists is not a function that runs. I check the call site.
- **The dry run beats the argument.** Every migration gets rehearsed against real data before it touches it.
- **Measured beats inferred.** I say which numbers came from a query and which came from reasoning.
- **A plausible cause is not the cause.** Before blaming today's deploy, I look for the counter-example.

---

<div align="center">

<sub>This README is generated. <a href="https://github.com/easywebdev4u/easywebdev4u/blob/main/scripts/generate.mjs">A build step</a> pulls my role and skill data straight from the <a href="https://github.com/easywebdev4u/thealchemyst.dev">portfolio site config</a>, so the two cannot drift — <a href="https://github.com/easywebdev4u/easywebdev4u/actions">CI fails if they do</a>.</sub>

<br><br>

<sub>Open to conversations about payments infrastructure, distributed systems, and hard frontend problems.</sub>

</div>
