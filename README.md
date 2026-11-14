# Inventory Management Â· Electron Desktop

An Electron/React desktop application for inventory, customer accounts, invoices, reports and backup/restore workflows. SQLite provides local persistence; the source includes English and Urdu interface elements.

## Run locally

```powershell
npm ci
npm start
```

Electron Forge starts the desktop development application. Native dependencies such as `better-sqlite3` must match the Electron runtime; use the project's Forge rebuild/packaging flow rather than assuming a Node-only install is sufficient. `npm run package` and `npm run make` produce platform-specific output.

The current main process stores `inventory.db` next to the executable. Use a writable installation location and protect the database and backups. Test backup/restore with disposable records before operational use. The existing `lint` script is a placeholder, not a real lint check.

The application contains legacy/local authentication behavior. Review password handling, native permissions and data protection before deployment; this presentation update does not claim a completed security modernization.

## Application preview

![Inventory React renderer sign-in](docs/images/inventory-renderer-login.jpg)

Captured from the real React renderer served by Electron Forge in a clean browser origin. The desktop application also launched against a fresh local SQLite file, but this image does not establish an authenticated native data transaction.

## Source overview

![Inventory Management Â· Electron Desktop source overview](docs/images/repository-overview.svg)

This diagram is derived from the repository structure; it is not an application screenshot.

## Development and validation

Use an isolated development database and synthetic records. Keep credentials, device sessions, signing keys and operational uploads outside Git. The presence of source code does not establish that every integration or deployment scenario has been tested. See [repository review](docs/REPOSITORY_REVIEW.md) for this audit's scope.

## Ownership and contributions

Existing author, template, asset and dependency attributions remain in place. Follow any existing license files; this documentation update does not grant a new license. For a change, describe the affected workflow, configuration and checks so it can be reviewed without guessing.
