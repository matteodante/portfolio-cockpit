# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this project, please report it
privately. **Do not open a public GitHub issue.**

Preferred channels:

1. **GitHub Security Advisory** — open a private advisory at
   <https://github.com/matteodante/portfolio-cockpit/security/advisories/new>.
2. **Email** — `matteo.dante659@gmail.com` with subject
   `[SECURITY] portfolio-cockpit: <short description>`.

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof of concept
- The affected version / commit SHA
- Any suggested mitigation

## Scope

In scope:

- `/api/chat` endpoint (rate limiting, prompt injection, moderation bypass,
  resource exhaustion)
- Authentication and authorization paths (currently none — the site is
  read-only public)
- Dependency vulnerabilities not yet disclosed upstream
- Configuration weaknesses (headers, CSP, env exposure)

Out of scope:

- Self-XSS requiring user interaction outside the application
- Reports from automated scanners without verified impact
- Issues already disclosed in `bun audit` / GitHub advisories for upstream
  dependencies (please open a PR with the version bump instead)
- Social engineering or physical attacks

## Response

The maintainer will acknowledge receipt within **5 business days** and
provide a status update within **15 business days**. Coordinated disclosure
is preferred — please allow reasonable time for a fix before public
disclosure.
