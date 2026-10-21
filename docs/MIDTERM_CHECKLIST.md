# Midterm checkpoint 1 requirements

This checklist tracks the requirements from `Final_project.pdf` against the repository. It is a working plan, not a claim that an item has been accepted by the instructor.

## Requirement status

| # | Midterm requirement | Current evidence | Status | Next work |
|---|---|---|---|---|
| 1 | Project concept and team roles | Project concept and role leads are recorded in [Architecture and Threat Model](ARCHITECTURE_AND_THREAT_MODEL.md). | Documented; roster names pending | Add team member names when confirmed. |
| 2 | Project architecture and threat model | Architecture, data flows, assets, trust boundaries, and STRIDE-style threats are documented. Grades/course protection is explicitly marked as future work because there is no corresponding API. | Drafted; team review needed | Student 3 and backend lead review accuracy and add project-specific decisions. |
| 3 | Developer local environment | Setup instructions, environment variables, synthetic seed accounts, and secret-handling rules are in [Developer Guide](DEVELOPER_GUIDE.md). | Documented; local setup not yet verified | Confirm with a clean setup on a teammate machine. |
| 4 | Basic developer-guide plan | Tooling, branch/PR conventions, review steps, and a security checklist are in [Developer Guide](DEVELOPER_GUIDE.md). | Drafted; CI configured locally | Verify remote workflow runs and configure required status checks on `main`. |
| 5 | Two passing development paths | [Development and Review Examples](DEVELOPMENT_EXAMPLES.md) documents PR #1 and PR #2. PR #2's merge message records approval; PR #1's local history confirms merge but not reviewer approval. Current automated checks pass locally; new GitHub workflows have not run remotely. | One approval confirmed; second example needs evidence | Save PR #1 review evidence or create one additional reviewed PR. Then record the GitHub Actions run. |
| 6 | Fully working identity management deployed for the project | Backend code implements username/password login, JWT authentication, Student/Teacher/Admin roles, admin user management, password change, and token-version revocation. A reproducible local scenario is in [Identity Management Demonstration](IDENTITY_DEMO.md). | Implemented in code; operation unverified | Run the scenario against MongoDB and save redacted evidence for login, role denial, password change, and logout/revocation. Teacher-specific endpoints are not implemented. |
| 7 | Cryptography used in the project | Passwords use salted scrypt hashes and timing-safe comparison; JWTs are signed with the configured secret. The choices and configuration are documented in the threat model and Developer Guide. | Implemented and documented; operation unverified | Confirm through the identity demonstration and review key handling. |

## Team responsibilities

- **Student 1 - Backend and application security:** database/API, identity management, roles, password handling, and server-side authorization.
- **Student 2 - DevSecOps:** GitHub workflow, CI/security checks, local setup, and developer/review guide.
- **Student 3 - Frontend and threat modeling:** user-facing pages, architecture diagram, threat model, and authorization scenarios such as preventing access to another student's grades.

The team may share evidence and review each other's work; ownership above identifies the lead for each area.

## Proposed order

1. Confirm team member names and collect links to the two existing pull requests.
2. Review and refine the architecture and threat model with Students 1 and 3.
3. Verify local setup and agree on developer/review rules.
4. Confirm CI and security scanning on GitHub; configure required status checks on `main`.
5. Demonstrate identity management and verify the cryptography implementation.
6. Capture two complete development/review/analyze examples and update this checklist with evidence.

## Scope note

The PDF separates midterm requirements from endterm requirements. The endterm list includes dynamic security analysis, a full security pipeline, AI-agent security, infrastructure security, monitoring/observability, and incident management. They are not marked as midterm blockers here, though early DevSecOps work can provide a foundation.
