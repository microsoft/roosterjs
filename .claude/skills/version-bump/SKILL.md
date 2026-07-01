---
name: version-bump
description: Performs a version bump for roosterjs. Merges changes from master into release, determines the correct SemVer version bump based on public interface changes, and creates a draft PR. Use when asked to do a version bump, release prep, or bump versions.
---

# Version Bump Skill

This skill performs a version bump for roosterjs. It merges changes from `master` into `release`, determines the correct SemVer version bump based on public interface changes, and creates a draft PR.

## Steps

### Step 1: Check for uncommitted changes

Run `git status --porcelain`. If there is any output (uncommitted changes exist), **stop immediately** and ask the user to deal with their uncommitted changes first before proceeding.

### Step 2: Switch to master and pull latest

```bash
git checkout master
git pull origin master
```

If either command fails, stop and report the error.

### Step 3: Switch to release and pull latest

```bash
git checkout release
git pull origin release
```

If either command fails, stop and report the error.

### Step 4: Find the last version bump commit on release

Search the git log on the `release` branch for the most recent version bump commit. Version bump commits typically have "Version bump" or "version bump" in their commit message, or modify only `versions.json`.

```bash
git log release --oneline --grep="ersion bump" -1
```

If not found via message, look for the last commit that modified `versions.json`:

```bash
git log release --oneline -1 -- versions.json
```

Record the commit hash and date of this commit.

### Step 5: Find all PRs merged into master after the last version bump

Using the date/hash from Step 4, find all merge commits (PRs) merged into `master` after that point:

```bash
git log master --oneline --merges --after="<date_of_last_bump>"
```

Alternatively, find commits on master that are not on release:

```bash
git log release..master --oneline --merges
```

If **no PRs are found**, stop and tell the user: "Version bump is not required since there is no PR merged since the last version bump."

### Step 6: Create PR descriptions

For each PR found in Step 5, create a one-line description with the PR link. Format:

```
- #<PR_NUMBER> <PR_TITLE> (https://github.com/microsoft/roosterjs/pull/<PR_NUMBER>)
```

Use `gh pr view <number> --json title,number,url` to get details if needed. Save these descriptions for use in Step 15.

### Step 7: Create a new branch based on release

Create a new branch from `release`. Use the naming convention `u/<username>/bump-<N>` where N is incremented, or as specified by the user:

```bash
git checkout -b <branch_name> release
```

### Step 8: Merge master using "accept theirs" strategy

Merge master into the new branch, preferring master's changes for any conflicts:

```bash
git merge master -X theirs
```

### Step 9: Verify no unresolved conflicts

Check for any remaining conflict markers:

```bash
git diff --check
grep -r "<<<<<<" --include="*.ts" --include="*.js" --include="*.json" .
```

If conflicts remain, stop and report them to the user.

### Step 10: Compare current branch with master

Run a diff between the current branch and master:

```bash
git diff master -- . ':!versions.json'
```

Ignore differences that are **only** whitespace/formatting (newlines, indentation). You can verify with:

```bash
git diff master --stat -- . ':!versions.json'
```

If there are substantive code differences (not just formatting), show the differences to the user and ask: "There are code differences between this branch and master (other than versions.json). Do you want to continue?"

If the user says no, stop the flow.

### Step 11: Update versions.json with SemVer bump

The `versions.json` file has 4 version groups:

| Group           | Packages                                                                                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`          | roosterjs, roosterjs-content-model-types, roosterjs-content-model-dom, roosterjs-content-model-core, roosterjs-content-model-api, roosterjs-content-model-plugins, roosterjs-color-utils, roosterjs-content-model-markdown |
| `legacyAdapter` | roosterjs-editor-adapter                                                                                                                                                                                                   |
| `react`         | roosterjs-react                                                                                                                                                                                                            |
| `overrides`     | Per-package overrides (usually empty)                                                                                                                                                                                      |

The grouping is defined in `/tools/buildTools/common.js` in the `buildConfig` object.

**SemVer rules:**

-   **Patch bump** (0.0.x → 0.0.x+1): Only bug fixes, no public API changes
-   **Minor bump** (0.x.0 → 0.x+1.0): New public exports added, but backward-compatible
-   **Major bump** (x.0.0 → x+1.0.0): Public exports removed or existing exported signatures changed (breaking)

The bump level is **determined by the public interface diff, not by request**. Do NOT default to a patch bump. You MUST run the procedure below and let its result decide the level. The only time you ask the user is the major-bump confirmation described at the end — there is no "patch bump per request" shortcut.

**Determining the bump level (mandatory procedure):**

The public interface of every package is defined by its `lib/index.ts` barrel file. A change to the bump level can ONLY come from a change to one of these barrel files. Run this for each of the 8 `main`-group packages (and separately for `react` and `legacyAdapter`):

1. Diff every barrel file between `release` and the current branch. This is the single source of truth for the bump decision:

    ```bash
    git diff release -- "packages/*/lib/index.ts"
    ```

    If this diff is **empty** across all packages in a group → that group is a **patch** bump (implementation-only changes). Stop here for that group.

2. If the diff is non-empty, classify each changed line:

    - A line that only **adds** an `export` (a new `+export ...` line, or a new symbol added to an existing multi-symbol `export { ... }` block, or a new member added to a union/interface that is only additive) → candidate for **minor**.
    - A line that **removes** an `export` (a `-export ...` line, or a symbol removed from an `export { ... }` block) → **major** (breaking).
    - A line that **changes an existing exported signature** (e.g. a `-export function foo(a): X` replaced by `+export function foo(a, b): Y`, a renamed export, or a changed type alias that narrows/alters the existing shape) → **major** (breaking).

3. Decide the level for the group using the highest-severity change found:

    - Any removal or changed signature anywhere in the group's barrels → **major**.
    - Otherwise, any added export → **minor**.
    - Otherwise (barrels changed only in comments/formatting) → **patch**.

4. Record, for the PR description and your reasoning, the concrete list of added/removed/changed exports that drove the decision. If you decided **patch** despite barrel files having changed, you must be able to point to the specific changed lines and explain why they are non-interface (comment/formatting only).

**Worked example (why this matters):** if a merged PR adds `export interface ContentModelData`, `export { addData }`, and `export type DataValueFormat`, the barrel diff is non-empty and additive with no removals → this is a **minor** bump. Treating it as a patch bump would be incorrect.

**If a major version bump appears needed** (any removal or changed signature detected in step 2), show the specific interface differences to the user and ask: "A major version bump seems needed due to these interface changes. Do you want to bump the major version, or just bump minor instead?"

Update `versions.json` with the new version numbers for each affected group, applying the level determined by the procedure above.

### Step 12: Build and test

Run the full build and test suite:

```bash
yarn build
yarn test:fast
```

If **any errors** occur, show the full error output and **stop the flow**. Do not proceed with a broken build.

### Step 13: Commit the change

```bash
git add versions.json
git commit -m "Version bump to <new_versions>"
```

Include all changed version numbers in the commit message.

### Step 14: Push the branch

```bash
git push origin <branch_name>
```

### Step 15: Create a draft PR

Create a draft PR targeting the `release` branch using the `gh` CLI:

**Title:** `Version bump <group>: <old_version> → <new_version>` (list all groups that changed)

**Description:** Include:

1. A table showing old and new versions for each group:

```markdown
| Group         | Old Version | New Version |
| ------------- | ----------- | ----------- |
| main          | x.y.z       | x.y.z+1     |
| react         | x.y.z       | x.y.z+1     |
| legacyAdapter | x.y.z       | x.y.z+1     |
```

2. The PR descriptions from Step 6:

```markdown
## Changes included

-   #123 Add feature X (https://github.com/microsoft/roosterjs/pull/123)
-   #124 Fix bug Y (https://github.com/microsoft/roosterjs/pull/124)
```

Command:

```bash
gh pr create --draft --base release --title "<title>" --body "<description>"
```

### Step 16: Show the PR link

Display the PR URL to the user. Example output:

```
✅ Version bump PR created successfully!
PR: https://github.com/microsoft/roosterjs/pull/<number>
```

## Error Handling

-   If any git operation fails, show the error and stop
-   If build/test fails, show errors and stop
-   If there are unexpected code differences, ask the user before continuing
-   If major version bump is detected, confirm with user before applying
-   Always leave the repo in a clean state if stopping early
