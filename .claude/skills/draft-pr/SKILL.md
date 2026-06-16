---
name: draft-pr
description: Creates a pull request for the current branch, generating a clear title and a description that summarizes the changes and includes instructions on how to test them. Use when asked to open, draft, or create a PR.
---

# Draft PR Skill

This skill creates a pull request for the current branch. It inspects the diff against `master`, generates a concise imperative title and a structured description (summary + how-to-test), and opens the PR with the `gh` CLI.

## Steps

### Step 1: Determine the current branch

```bash
git branch --show-current
```

If the current branch is `master` (or `release`), **stop** and tell the user to switch to a feature branch first — PRs should not be opened from `master`.

### Step 2: Inspect the changes

Gather the commits and the diff that this branch adds on top of `master`:

```bash
git log master..HEAD --oneline
git diff master...HEAD --stat
git diff master...HEAD
```

If there are **no commits/diff** versus `master`, stop and tell the user there is nothing to open a PR for.

Read the diff carefully so the title and description reflect what actually changed — not just the commit messages.

### Step 3: Make sure the branch is pushed

Check the upstream state:

```bash
git status -sb
```

If the branch has no upstream or has unpushed commits, push it:

```bash
git push -u origin <branch_name>
```

If there are **uncommitted changes**, stop and ask the user whether to commit them first — do not commit on their behalf without confirmation.

### Step 4: Check for an existing PR

```bash
gh pr list --head <branch_name> --json number,title,url
```

If a PR already exists, show its URL and ask the user whether to update it instead of creating a new one. Do not create a duplicate.

### Step 5: Write the title

Follow the repo's commit/PR conventions (see `AGENTS.md`):

-   Concise, **imperative mood** ("Add", "Fix", "Remove", "Update").
-   Mention the surface area / feature when helpful (e.g. `[Table Improvements] ...`).
-   Reference a GitHub issue/PR number when relevant.

### Step 6: Write the description

Write the body to a temp file (avoids shell-escaping issues) using this template:

```markdown
## Summary

<1-3 sentence explanation of WHAT changed and WHY. Reference the specific
file(s)/function(s) and the behavior before vs. after when it clarifies intent.>

## How to test

1. <Exact command(s) to run the relevant tests, e.g.
   `yarn test:fast --testPathPattern=<regex>`>
2. <Manual / integration steps when applicable: setup, action to trigger, and
   the expected result. Call out before-this-fix vs. after-this-fix behavior
   when it makes verification clearer.>
```

Guidance for the **How to test** section:

-   Always include the project test command: `yarn test:fast` (optionally scoped with `--testPathPattern=<regex>` or `--testNamePattern=<regex>`). Never suggest `yarn test` or `karma start`.
-   Prefer concrete, copy-pasteable steps over vague descriptions.
-   When the change is behavioral, describe how to observe the difference (e.g. "Before this fix: X. After this fix: Y.").

### Step 7: Create the PR

Use a heredoc to build the body file, then create the PR against `master`:

```bash
cat > /tmp/draft_pr_body.md << 'EOF'
<description from Step 6>
EOF
gh pr create --base master --head <branch_name> --title "<title>" --body-file /tmp/draft_pr_body.md
```

If the user asked for a **draft** PR, add the `--draft` flag.

### Step 8: Show the PR link

Display the resulting PR URL to the user and a one-line recap of the title and how-to-test summary.

## Notes

-   PRs target the `master` branch by default (per `AGENTS.md`). Only target another base if the user explicitly asks.
-   Keep the title and description grounded in the actual diff — do not invent changes or test steps that the code does not support.
-   If anything is ambiguous (e.g. which issue to reference, draft vs. ready), ask the user rather than guessing.
