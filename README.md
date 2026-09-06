<!-- Generated from README.template.md by scripts/generate.mjs. Do not edit directly. -->
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-light.svg">
  <img alt="Ajay Kumar Singh — Tech Lead & Frontend Architect" src="https://raw.githubusercontent.com/easywebdev4u/easywebdev4u/main/assets/header-dark.svg" width="100%">
</picture>

<!-- BEGIN:tagline -->
Building products at the intersection of GenAI, Web3, fintech, and great UX
<!-- END:tagline -->

<!-- BEGIN:links -->
**[thealchemyst.dev](https://thealchemyst.dev)** &nbsp;·&nbsp; **[linkedin.com/in/ajay-singh-69a083108](https://www.linkedin.com/in/ajay-singh-69a083108/)** &nbsp;·&nbsp; **[easywebdev4u@gmail.com](mailto:easywebdev4u@gmail.com)**
<!-- END:links -->

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
<details open>
<summary><b>ZoltMoney</b> — Tech Lead, Feb 2025 — Present &nbsp;·&nbsp; <i>Next.js, Go, TypeScript, AWS, GenAI, LLM APIs, CloudFront</i></summary>

<br>

<sub>Bengaluru</sub>

- Solo-architecting and building the entire product from ground up — frontend, backend, and infrastructure
- Designing and implementing the backend in Go Lang, handling API architecture, business logic, and system design
- Building the frontend with Next.js and TypeScript for a modern fintech experience
- Managing cloud infrastructure on AWS — S3, CloudFront, Amplify, Secrets Manager
- Owning the full product lifecycle: architecture → development → deployment → iteration
- Leveraging Generative AI for rapid prototyping, AI-assisted development, and accelerated product delivery

</details>

<details>
<summary><b>Six Sigma Sports (ST Labs)</b> — SDE-3 — Web3, Jun 2022 — Feb 2025 &nbsp;·&nbsp; <i>Remix, React, CosmJS, Web3Auth, gRPC, TypeScript</i></summary>

<br>

<sub>Bengaluru</sub>

- Led frontend architecture for a blockchain-based betting platform on Cosmos (SGE token)
- Built with Remix (React + Node.js), achieving 40% better engagement and halving load times
- Integrated Web3Auth, OAuth2, and Synaps KYC — driving 35% engagement increase
- Implemented DeFi wallet integrations (Keplr, Leap, Cosmostation) across desktop & mobile
- Architected gRPC-based blockchain data framework powering 2 key projects
- Published an npm package for Cosmos message composing & broadcasting
- Built real-time data layer with WebSockets and intelligent fallback mechanisms

</details>

<details>
<summary><b>Paytm (One97 Communications)</b> — Senior Software Engineer, Mar 2020 — May 2022 &nbsp;·&nbsp; <i>React, JavaScript, Node.js</i></summary>

<br>

<sub>Bengaluru</sub>

- Hotels: Built React-based booking interface → 20% booking increase in 3 months
- ONDC: Improved platform interoperability by 40% and efficiency by 25%
- Paytm Mall: Designed return & exchange flow serving 2M+ customers
- Created email template system reducing design-testing iterations by 50%
- Seller Panel: Reduced operational issues by 35%, boosted seller satisfaction by 15%
- Hi5: Built group-buying platform → 30% engagement rise, 50% more transactions in 4 months

</details>

<details>
<summary><b>Trakinvest</b> — Senior Software Engineer, Sep 2019 — Feb 2020 &nbsp;·&nbsp; <i>React, Gatsby.js, Next.js</i></summary>

<br>

<sub>Bengaluru</sub>

- Revamped React-based trading platform with modern architecture
- Built Gatsby.js landing page with comprehensive SEO optimization
- Developed Next.js SSR product for improved performance
- Automated certificate issuance system
- Created dynamic event page system — 20% more participation

</details>

<details>
<summary><b>Good Earth</b> — Software Engineer, Feb 2019 — Aug 2019 &nbsp;·&nbsp; <i>React, OAuth2, Turn.js</i></summary>

<br>

<sub>Delhi</sub>

- Built responsive React pages for the e-commerce platform
- Implemented OAuth2 social authentication
- Created interactive book feature using Turn.js
- Developed address module with map integration

</details>

<details>
<summary><b>GlobalLogic</b> — Software Engineer, Oct 2016 — Feb 2019 &nbsp;·&nbsp; <i>Ember.js, Angular.js, C#</i></summary>

<br>

<sub>Noida</sub>

- Built Ember.js Employee Consortium Portal for DISA
- Developed Angular.js Employee Directory application
- Created CMS system for content management
- Built C# to Ember model converter tool

</details>
<!-- END:experience -->

---

## Tooling

<!-- BEGIN:stack -->
| | |
|---|---|
| **Frontend** | **JavaScript** · **React.js** · **Next.js** · **TypeScript** · Remix · Gatsby.js |
| **State Management** | **Redux** · **Context API** · React Query |
| **Web3 & Blockchain** | CosmJS · Web3Auth · Cosmos Kit · DeFi Wallets · DFNS · Coinbase SDK |
| **Cloud & DevOps** | AWS S3 · CloudFront · AWS Amplify · Secrets Manager · Webpack · Vite |
| **Styling** | **Tailwind CSS** · Material UI · Styled Components · Bootstrap |
| **GenAI & AI Tools** | Prompt Engineering · AI-Assisted Development · LLM Integration · OpenAI API · AI Agents · RAG Systems |
| **Backend & Languages** | **REST APIs** · Go Lang · Node.js · GraphQL |
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
