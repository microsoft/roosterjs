---
name: hotfix
description: Proposes a scoped version bump for a roosterjs hotfix. Given one or more commits provided by the user, determines which packages had files changed by those commits, bumps the version only for the affected version groups, and creates a draft PR. Use when asked to do a hotfix, a scoped/targeted version bump, or to release only specific commits.
---

# Hotfix Skill

This skill performs a **scoped** version bump for a roosterjs hotfix. Unlike the full `version-bump` skill (which bumps everything merged into `master` since the last release), this skill bumps the version **only for the packages whose files were changed by the specific commits the user provides**.

The user supplies the commits to hotfix. Each changed file is mapped to its package, each package to a version group (`main`, `legacyAdapter`, `react`), and **only the affected groups are bumped**.

## Inputs

The user must provide the **commits** to include in the hotfix. Accept any of:

-   One or more commit hashes (e.g. `5142b51 e593ee8`)
-   A commit range (e.g. `abc123..def456`)
-   PR numbers (resolve to their merge/squash commit with `gh pr view <number> --json mergeCommit`)

If the user does **not** provide any commits, stop and ask which commits should be included in the hotfix before doing anything else.

## Version groups

The version groups live in `versions.json` and map to package sets defined in `tools/buildTools/common.js` (`buildConfig`). Use this mapping to translate changed files → group:

| Group           | Packages                                                                                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`          | roosterjs, roosterjs-content-model-types, roosterjs-content-model-dom, roosterjs-content-model-core, roosterjs-content-model-api, roosterjs-content-model-plugins, roosterjs-color-utils, roosterjs-content-model-markdown |
| `legacyAdapter` | roosterjs-editor-adapter                                                                                                                                                                                                   |
| `react`         | roosterjs-react                                                                                                                                                                                                            |

Notes:

-   A file path under `packages/<package-name>/` identifies the package; look up which group lists that package.
-   The legacy packages (`roosterjs-editor-*`, except `roosterjs-editor-adapter`) are **not** in `versions.json` and are not versioned by this skill. If a commit only touches legacy packages or non-package files (e.g. `tools/`, `demo/`, root configs), see Step 4.
-   Always re-read the group→package mapping from `tools/buildTools/common.js` in case packages were added or moved.

## Steps

### Step 1: Confirm the commits

Confirm the commits the user provided (see **Inputs**). If none were provided, stop and ask. Resolve PR numbers to commit hashes if needed. Verify each commit exists:

```bash
git cat-file -t <commit>
```

If any commit is invalid/unknown, stop and report it.

### Step 2: Check for uncommitted changes

Only **tracked** modifications (staged or unstaged edits to files git knows about) interfere with switching branches and cherry-picking. **Untracked** files (e.g. a new, not-yet-added skill folder or scratch files) do **not** interfere — do not block on them.

Check for blocking (tracked) changes only:

```bash
git status --porcelain --untracked-files=no
```

-   If this produces output, **stop immediately** and ask the user to deal with their tracked uncommitted changes first.
-   If it is empty but `git status --porcelain` (with untracked) shows untracked files, mention them in one line and **continue** — they will be carried along untouched and excluded from the bump commit (which stages only `versions.json`). Note that `gh pr create` may print a harmless "uncommitted change" warning because of them.

### Step 3: Switch to release and pull latest

The hotfix branch is based on `release` (that is what ships).

```bash
git checkout release
git pull origin release
```

If either command fails, stop and report the error.

**Then check whether each provided commit is already on `release`** — this is the common hotfix situation: the fix lives on `master` and must be cherry-picked onto `release`. Do **not** assume the commit is already there.

```bash
git merge-base --is-ancestor <commit> release && echo "on release" || echo "NOT on release"
```

-   If a commit is **already on release**, it does not need cherry-picking (it will be released from `release` directly).
-   If a commit is **not on release**, it must be cherry-picked onto the hotfix branch in Step 5b. Note which commits need cherry-picking and confirm the plan with the user before proceeding (a single `AskUserQuestion` covering cherry-pick + bump level works well).

### Step 4: Determine the files changed by the provided commits

For each provided commit, list the files it changed. Combine across all commits (deduplicate):

```bash
git show --name-only --pretty=format: <commit>
```

For a range, use:

```bash
git diff --name-only <from>..<to>
```

Collect the full set of changed file paths.

**Map files to groups:**

1. For each changed path under `packages/<package-name>/...`, record `<package-name>`.
2. Look up each package's group using the mapping in **Version groups** (re-confirm from `tools/buildTools/common.js`).
3. The set of affected groups is the union across all changed files.

**Handle edge cases:**

-   If **no package files** were changed (only `tools/`, `demo/`, root configs, docs, etc.), stop and tell the user: "The provided commits do not change any versioned package files, so no version bump is needed." List the changed files so they can confirm.
-   If commits only touch **legacy** packages (`roosterjs-editor-*` other than `roosterjs-editor-adapter`), tell the user those packages are not versioned via `versions.json` and ask how they want to proceed.

Show the user a summary before continuing:

```
Affected packages and groups:
- roosterjs-content-model-plugins → main
- roosterjs-react → react
Affected groups to bump: main, react
```

### Step 5: Create a new branch based on release

Create a new branch from `release`. Use the naming convention `u/<username>/hotfix-<N>`, picking the next free N (check existing branches so you don't collide), or a name the user specifies:

```bash
git branch --list 'u/<username>/hotfix-*'      # see which N are taken
git checkout -b <branch_name> release
```

### Step 5b: Cherry-pick commits not on release

For each commit identified in Step 3 as **not on release** (in the order the user provided), cherry-pick it onto the new branch:

```bash
git cherry-pick <commit>
```

-   If a cherry-pick conflicts, **stop**, show the conflicting files, and ask the user how to proceed (do not guess a resolution). Leave the repo clean if abandoning (`git cherry-pick --abort`).
-   Commits already on release are skipped here.

### Step 6: Determine the SemVer bump for each affected group

A hotfix is normally a **patch** bump (bug fixes, no public API changes). Determine the bump per affected group:

-   **Patch** (0.0.x → 0.0.x+1): Bug fixes only, no public interface changes — the default for a hotfix.
-   **Minor** (0.x.0 → 0.x+1.0): New backward-compatible exports/APIs added.
-   **Major** (x.0.0 → x+1.0.0): Breaking changes to public interfaces.

To check whether more than a patch is warranted, inspect the commits' changes to each affected package's `lib/index.ts` barrel files and exported types/interfaces:

```bash
git show <commit> -- 'packages/**/lib/index.ts'
```

-   New exports added → minor.
-   Changed/removed existing public signatures → major.
-   Implementation-only changes → patch.

**If a minor or major bump appears needed**, show the interface differences to the user and ask whether they want that bump or to keep it a patch. A hotfix is usually intended to stay a patch — confirm before doing anything larger.

Only bump the groups identified in Step 4. **Leave all other groups untouched.**

### Step 7: Update versions.json

Read the current versions from `versions.json` and apply the bump computed in Step 6 to **only** the affected groups. Do not change groups that were not affected.

### Step 8: Build and test

```bash
yarn build
yarn test:fast
```

If **any errors** occur, show the full error output and **stop the flow**. Do not proceed with a broken build.

### Step 9: Commit the change

```bash
git add versions.json
git commit -m "Hotfix version bump <group>: <old_version> → <new_version>"
```

List all changed groups/versions in the commit message.

### Step 10: Push the branch

```bash
git push origin <branch_name>
```

### Step 11: Create a draft PR

Create a draft PR targeting the `release` branch:

**Title:** `Hotfix version bump <group>: <old_version> → <new_version>` (list all affected groups)

**Description:** Include:

1. A table of old/new versions for the affected groups only:

```markdown
| Group | Old Version | New Version |
| ----- | ----------- | ----------- |
| main  | x.y.z       | x.y.z+1     |
| react | x.y.z       | x.y.z+1     |
```

2. The commits included in the hotfix and the packages they touched:

```markdown
## Hotfix commits

-   <short_hash> <commit_subject>

## Affected packages

-   roosterjs-content-model-plugins → main
-   roosterjs-react → react
```

Command:

```bash
gh pr create --draft --base release --title "<title>" --body "<description>"
```

### Step 12: Show the PR link

```
✅ Hotfix version bump PR created successfully!
PR: https://github.com/microsoft/roosterjs/pull/<number>
Affected groups: <list>
```

## Error Handling

-   If no commits are provided, stop and ask the user which commits to hotfix.
-   If any provided commit is invalid, stop and report it.
-   If the commits change no versioned package files, stop — no bump needed.
-   If any git operation fails, show the error and stop.
-   If build/test fails, show errors and stop.
-   If a minor/major bump appears needed, confirm with the user before applying (hotfixes default to patch).
-   Only ever bump groups affected by the provided commits; never touch unaffected groups.
-   Always leave the repo in a clean state if stopping early.
