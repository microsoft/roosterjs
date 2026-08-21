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

-   **Patch bump** (0.0.x → 0.0.x+1): Only bug fixes, no API changes
-   **Minor bump** (0.x.0 → 0.x+1.0): New features/APIs added, but backward-compatible
-   **Major bump** (x.0.0 → x+1.0.0): Breaking changes to public interfaces

To determine the bump level:

1. Compare the exported types/interfaces between `release` and the merged code
2. Look at the `lib/index.ts` barrel files in each package for added/removed/changed exports
3. Check if any existing public interface signatures changed (breaking = major)
4. Check if new exports were added (non-breaking addition = minor)
5. If only implementation changes with no public API changes = patch

**If a major version bump appears needed**, show the interface differences to the user and ask: "A major version bump seems needed due to these interface changes. Do you want to bump the major version, or just bump minor instead?"

Update `versions.json` with the new version numbers for each affected group.

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
