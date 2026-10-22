# Midterm checkpoint 1 requirements

This checklist tracks the requirements from `Final_project.pdf` against the repository. It is a working plan, not a claim that an item has been accepted by the instructor.

## Requirement status

| # | Midterm requirement | Current evidence | Status | Next work |
|---|---|---|---|---|
| 1 | Project concept and team roles | Project concept and role leads are recorded in [Architecture and Threat Model](ARCHITECTURE_AND_THREAT_MODEL.md). | Documented; roster names pending | Add team member names if required by the instructor. |
| 2 | Project architecture and threat model | Architecture, data flows, assets, trust boundaries, and STRIDE-style threats are documented. Grades/course protection is explicitly marked as future work because there is no corresponding API. | Drafted; team review needed | Student 3 and backend lead review accuracy and add project-specific decisions. |
| 3 | Developer local environment | Setup instructions, environment variables, synthetic seed accounts, and secret-handling rules are in [Developer Guide](DEVELOPER_GUIDE.md). On this workstation Node.js 22.13/npm 10.9 and both dependency trees are present. MongoDB is not installed/running; port 27017 is closed. | Documented; local database startup unverified | Install/start local MongoDB, launch the application, and repeat setup on a teammate machine. |
| 4 | Basic developer-guide plan | Tooling, branch/PR conventions, review steps, and a security checklist are in [Developer Guide](DEVELOPER_GUIDE.md). GitHub Actions and `main` branch protection were verified previously. Feature branches now use PR checks; push checks run on `main`. | Implemented; latest workflow result pending | Keep required check names aligned with workflow job names. |
| 5 | Two passing development paths | [Development and Review Examples](DEVELOPMENT_EXAMPLES.md) documents PR #1, PR #2, and PR #3. PR #2 has an approval. On 2026-10-22, PR #3 was approved by `eskendir2006` at head `d9d5e17`. Its earlier duplicate push run passed all six jobs; the PR run had an audit failure. | Review evidence for two paths exists; updated PR gate pending | Verify all six checks on the current PR head and record the result. |
| 6 | Fully working identity management deployed for the project | Backend implements username/password login, JWT authentication, Student/Teacher/Admin roles, admin user management, password change, and token-version revocation. [Identity Management Demonstration](IDENTITY_DEMO.md) records 16 API checks against an ephemeral MongoDB 8.2.6 instance. The team chose to keep the demo local for now. | API flow verified on temporary local database; ordinary MongoDB-backed startup still unverified on this workstation | Start a persistent local MongoDB and repeat the demo. There is no production deployment. Teacher academic endpoints are not implemented. |
| 7 | Cryptography used in the project | Passwords use salted scrypt hashes and timing-safe comparison; JWTs are signed with the configured secret. Unit tests and the live API scenario cover password hashing/login, password change, and token revocation. | Implementation and temporary-database API flow verified | Repeat the demonstration in the normal local environment; use a unique secret outside development. |

## Team responsibilities

- **Student 1 - Backend and application security:** database/API, identity management, roles, password handling, and server-side authorization.
- **Student 2 - DevSecOps:** GitHub workflow, CI/security checks, local setup, and developer/review guide.
- **Student 3 - Frontend and threat modeling:** user-facing pages, architecture diagram, threat model, and authorization scenarios such as preventing access to another student's grades.

The team may share evidence and review each other's work; ownership above identifies the lead for each area.

## Proposed order

1. Confirm team member names and collect links to the two existing pull requests.
2. Review and refine the architecture and threat model with Students 1 and 3.
3. Verify local setup and agree on developer/review rules.
4. Confirm CI and security scanning on GitHub; configure required status checks on `main`. **Partially verified:** branch protection is enabled; the earlier duplicate push workflow passed all six jobs, but the PR workflow had one failed audit. Feature-branch push triggers have now been limited to `main`; verify the updated PR run.
5. Demonstrate identity management and verify the cryptography implementation. **Temporary local runtime done:** 16 of 16 API checks passed against an in-memory MongoDB; the ordinary local MongoDB service is not present on this workstation yet. The team chose not to deploy publicly at this stage.
6. Capture two complete development/review/analyze examples and update this checklist with evidence. **Review evidence present on the previous head:** PR #2 is approved and PR #3 was approved by `eskendir2006` on head `d9d5e17`; a fresh review has been requested for the updated PR commit, and current CI/review evidence must be recorded after it completes.

## Scope note

The PDF separates midterm requirements from endterm requirements. The endterm list includes dynamic security analysis, a full security pipeline, AI-agent security, infrastructure security, monitoring/observability, and incident management. They are not marked as midterm blockers here, though early DevSecOps work can provide a foundation.
