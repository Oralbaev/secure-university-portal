# Midterm checkpoint 1 requirements

This checklist tracks the requirements from `Final_project.pdf` against the repository. It is a working plan, not a claim that an item has been accepted by the instructor.

## Requirement status

| # | Midterm requirement | Current evidence | Status | Next work |
|---|---|---|---|---|
| 1 | Project concept and team roles | Project concept and role leads are recorded in [Architecture and Threat Model](ARCHITECTURE_AND_THREAT_MODEL.md). | Documented; roster names pending | Add team member names when confirmed. |
| 2 | Project architecture and threat model | Architecture, data flows, assets, trust boundaries, and STRIDE-style threats are documented. Grades/course protection is explicitly marked as future work because there is no corresponding API. | Drafted; team review needed | Student 3 and backend lead review accuracy and add project-specific decisions. |
| 3 | Developer local environment | Setup instructions, environment variables, synthetic seed accounts, and secret-handling rules are in [Developer Guide](DEVELOPER_GUIDE.md). Frontend `npm ci`, lint, and build passed locally; backend tests passed. | Documented; partial local verification | Verify MongoDB-backed startup and repeat setup on a teammate machine. |
| 4 | Basic developer-guide plan | Tooling, branch/PR conventions, review steps, and a security checklist are in [Developer Guide](DEVELOPER_GUIDE.md). | Implemented; remote CI and branch protection verified | Keep the required check list aligned if workflow job names change. |
| 5 | Two passing development paths | [Development and Review Examples](DEVELOPMENT_EXAMPLES.md) documents PR #1, PR #2, and PR #3. GitHub review records show PR #1 has no reviews; PR #2 is approved; PR #3's six CI/security jobs pass and it is ready for review. | One approved path; second review pending | Obtain a teammate approval on PR #3. |
| 6 | Fully working identity management deployed for the project | Backend code implements username/password login, JWT authentication, Student/Teacher/Admin roles, admin user management, password change, and token-version revocation. [Identity Management Demonstration](IDENTITY_DEMO.md) records 16 successful API checks against an ephemeral MongoDB 8.2.6 instance. | Local runtime verified; project deployment not configured | Select/provide a deployment target and run the same redacted scenario there. Teacher-specific academic endpoints are not implemented. |
| 7 | Cryptography used in the project | Passwords use salted scrypt hashes and timing-safe comparison; JWTs are signed with the configured secret. Unit tests and the live API scenario cover password hashing/login, password change, and token revocation. | Implementation and local API flow verified | Review deployment secret management and repeat the scenario in the project environment. |

## Team responsibilities

- **Student 1 - Backend and application security:** database/API, identity management, roles, password handling, and server-side authorization.
- **Student 2 - DevSecOps:** GitHub workflow, CI/security checks, local setup, and developer/review guide.
- **Student 3 - Frontend and threat modeling:** user-facing pages, architecture diagram, threat model, and authorization scenarios such as preventing access to another student's grades.

The team may share evidence and review each other's work; ownership above identifies the lead for each area.

## Proposed order

1. Confirm team member names and collect links to the two existing pull requests.
2. Review and refine the architecture and threat model with Students 1 and 3.
3. Verify local setup and agree on developer/review rules.
4. Confirm CI and security scanning on GitHub; configure required status checks on `main`. **Done:** PR #3 Actions run passed all six required jobs; `main` requires PR, one approval, and those checks.
5. Demonstrate identity management and verify the cryptography implementation. **Local runtime done:** 16 of 16 API checks passed on a disposable MongoDB; production deployment remains unconfigured.
6. Capture two complete development/review/analyze examples and update this checklist with evidence. **Pending:** obtain a teammate approval on PR #3.

## Scope note

The PDF separates midterm requirements from endterm requirements. The endterm list includes dynamic security analysis, a full security pipeline, AI-agent security, infrastructure security, monitoring/observability, and incident management. They are not marked as midterm blockers here, though early DevSecOps work can provide a foundation.
