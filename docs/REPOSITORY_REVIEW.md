# Repository review

Reviewed on **14 November 2026** against the accessible default branch.

- Repository and its default-branch tree were accessible; this was not an empty upload.
- Existing README-local image references were checked against exact repository paths: 0 missing references found in the initial check.
- Descriptions and relevant GitHub topics are maintained for discovery; topics do not make private source publicly searchable.
- The source overview is an explicitly labeled architecture illustration, not an application screenshot.
- Existing project images are used only in their original documented context. New screenshots, when present, state the capture method and any demo limitations.
- No repository visibility change, source-history rewrite or production data migration is part of this review.

## Scope

This is a source/publication/documentation review. It is not a certification of every screen, integration, security property or native device. Existing earlier build/demo results are not silently re-dated as fresh tests. New runtime checks are recorded separately where performed.

## Configuration and sensitive data

Keep credentials, signing identities, device sessions and operational records outside Git. Removing a committed credential from today's branch does not remove it from old commits; revoke/replace any previously committed live credential. Use local configuration or deployment secrets. Existing license and template/asset attributions remain unchanged.


## Screen walkthrough follow-up

Captured 18 actual renderer screenshots covering every primary application route, both report tabs and principal entry/edit/detail dialogs. Used a fresh local SQLite database and a temporary loopback adapter to the real Electron IPC handlers. Verified seeded login, one sample invoice save, persisted invoice details, report totals and dashboard after reload. Native Windows capture failed; no native OS dialogs, backup/restore, printing, user creation or password change was exercised. Fixed webpack native-asset cache initialization after reproducing a SQLite binding startup failure. See [screen guide](SCREEN_GUIDE.md) for the complete gallery, workflow and remaining refresh issues.
