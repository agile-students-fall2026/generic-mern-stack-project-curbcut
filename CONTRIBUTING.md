# Contributing to CurbCut

Follow this guide to set up CurbCut, coordinate work, and submit contributions. All four developers must review and agree to these norms before adopting them. Propose later changes through a pull request.

## Team norms

Our four developers share responsibility for completing sprint work, reviewing contributions, and helping teammates resolve blockers. We communicate through the CurbCut Discord channel, acknowledge direct messages within 24 hours, and report progress honestly. We work in two-week sprints and attend standups every Tuesday, Thursday, and Saturday at 8:00 PM New York City time.

### Team values and collaboration

Take responsibility for your work and help teammates meet the sprint goal.

- Treat teammates respectfully, share knowledge, and take responsibility for the work you claim. Share tasks fairly and help each other learn Agile and DevOps practices.
- Use the Discord **CurbCut team channel** for team communication. Keep decisions and useful solutions visible to everyone.
- Acknowledge messages directed at you within **24 hours**. If you cannot provide a full answer yet, say when you expect to respond. Let the team know ahead of time when exams, illness, or other commitments affect your availability.
- Ask for help early. Describe the issue, what you tried, and the specific help you need; link the relevant issue, error, or pull request.
- Discuss disagreements using the sprint goal, user needs, and technical constraints. Seek agreement among all four developers. If needed, the Product Owner decides scope and priority questions. Ask course staff for help with unresolved technical or interpersonal disputes. Record decisions in Discord or the relevant issue.

### Sprint cadence

We work in **two-week sprints**.

1. Agree on a sprint goal and select realistic work from the product backlog.
2. Break stories into tasks and assign owners.
3. Keep the project board current and discuss scope changes before adding work.
4. End the sprint with a review, demonstration, and retrospective. Use the findings to improve the next sprint.

### Standup schedule and expectations

Meet remotely every **Tuesday, Thursday, and Saturday at 8:00 PM New York City time** (`America/New_York`). The schedule follows daylight saving time.

- Use the CurbCut Discord standup thread for meeting reports.
- Keep standups to **15 minutes or less**. Discuss longer debugging or planning topics afterward with the relevant teammates.
- All four developers participate. The Scrum Master keeps the meeting focused and posts one combined report covering everyone's update.
- Explain what you completed since the last standup, what you are working on next, and what is blocking you. Include issue or pull request links where useful.
- Notify the team and course stakeholders in an emergency that prevents attendance. An asynchronous update is an exception for an approved, documented absence; it does not normally replace attendance. Submit that update within 24 hours.
- Report progress honestly. Do not cover for absent or non-participating teammates or claim their unfinished work is complete.

### Standup report template

After each meeting, the Scrum Master pastes the following into the CurbCut standup thread, replaces the placeholders, and selects each teammate's actual Discord mention. Paste the contents without the surrounding code fences so Discord renders the formatting. Use the actual date and attendance mode.

```markdown
# Standup Report - [Weekday DD Month YYYY]

## [Developer 1 name] [@Discord mention] (remote, synchronous)

- **did**: [Completed work since the last standup; issue/PR link]
- **doing**: [Current work or next step; issue link]
- **blockers**: [Problem and help needed, or none]

## [Developer 2 name] [@Discord mention] (remote, synchronous)

- **did**: [Completed work since the last standup; issue/PR link]
- **doing**: [Current work or next step; issue link]
- **blockers**: [Problem and help needed, or none]

## [Developer 3 name] [@Discord mention] (remote, synchronous)

- **did**: [Completed work since the last standup; issue/PR link]
- **doing**: [Current work or next step; issue link]
- **blockers**: [Problem and help needed, or none]

## [Developer 4 name] [@Discord mention] (remote, synchronous)

- **did**: [Completed work since the last standup; issue/PR link]
- **doing**: [Current work or next step; issue link]
- **blockers**: [Problem and help needed, or none]
```

### Handling blockers and participation problems

Report blockers in Discord as soon as they arise. The Scrum Master coordinates help by the next standup. If the team cannot resolve the problem, the Product Owner asks course staff for help.

Handle participation problems as follows:

1. Contact the teammate when missed commitments or unexplained absences become a concern. Offer help and agree on a next step.
2. Inform course staff if the teammate makes no progress for two consecutive standups, misses two consecutive standups without explanation, or the problem remains unresolved for two standups.
3. Redistribute work as needed. Keep the teammate informed and help them rejoin when they can.

### Coding standards

Write code that teammates can understand, verify, and maintain.

- Use **Visual Studio Code**. Follow the existing code style and course JavaScript conventions.
- Use **ESLint** for linting and **Prettier** for formatting once JavaScript components and shared configuration are added. Add the configuration and exact commands with the first application setup; these tools are not configured yet.
- Implement the smallest working version that meets the acceptance criteria, then improve it. Avoid unnecessary complexity.
- Use descriptive variable and function names. Remove dead or commented-out code in the area you change without expanding into unrelated cleanup.
- Make small, focused commits with descriptive, single-line messages.
- Verify every task and spike, obtain peer review, and pass applicable configured tests before merging into `master`.
- Push verified work for review. If your change breaks a shared build or pipeline, tell the team promptly and prioritize fixing it.
- Add automated tests for critical functionality and integration points as those components and testing tools are introduced.

## Local setup

Complete these steps before making changes in your local clone.

### Prerequisites

You need the following tools and access:

- Git and access to the team's GitHub repository.
- Visual Studio Code and its integrated terminal.
- A UNIX-compatible shell: macOS/Linux shell, Git Bash, or WSL on Windows.

### Clone and configure Git

Clone the [CurbCut team repository](https://github.com/agile-students-fall2026/generic-mern-stack-project-curbcut). Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_COURSE_EMAIL>` with your own details:

```bash
git clone https://github.com/agile-students-fall2026/generic-mern-stack-project-curbcut.git
cd generic-mern-stack-project-curbcut
git switch master
git config user.name "<YOUR_GITHUB_USERNAME>"
git config user.email "<YOUR_COURSE_EMAIL>"
git config pull.rebase false
git pull --ff-only origin master
```

Use the same email address across course services. The repository setting `pull.rebase false` disables rebasing for pulls in this clone. Run it again for each new clone.

Enable the repository's existing commit-message hook in every clone:

```bash
chmod a+x .githooks/commit-msg
git config core.hooksPath .githooks
```

### Current application setup

The project currently has placeholder `front-end/` and `back-end/` folders, each containing `readme.txt`, and no application `package.json`. Design materials live in `ux-design/`. There are no application dependency installation or run commands to execute yet.

Read the [project README](./README.md) and relevant assignment instructions for project context. Documentation work can begin after cloning. When application components are implemented, update this section and the README with their exact directory paths, required runtime versions, dependency installation commands, environment configuration, and run commands. Do not assume `npm install` or `npm start` works before those components and scripts exist.

## Building and testing

Application build and test commands are **not available yet**. The repository includes course workflow automation, but it does not currently provide an application build or test suite.

For documentation contributions now, preview the Markdown and verify links, paths, commands, and consistency with the current repository. Describe these checks in the pull request.

When the application reaches the implementation stage, the contributor adding each component must update this section with:

- The directory from which to run each command.
- The exact build, test, lint, and formatting commands defined by that component.
- Any test dependencies, environment variables, or required services, using placeholders for secrets.
- How to run the full test suite and relevant focused tests, and how to recognize success.

Run the applicable checks before requesting review and before merging. Document checks that could not be run and resolve those limitations with the reviewer before merging.

## Git workflow

All changes go through a separate branch and a pull request into the team repository's **`master`** branch. Do not commit or push directly to `master`.

### 1. Create or claim an issue

Assign yourself an existing task or spike, or create an issue describing the work and its acceptance criteria. Check that nobody else is already doing the same work. Move it to the project's in-progress status when you start.

### 2. Update master and create a branch

Start with a clean working tree. Replace `42` below with the actual spike issue number; use a short description of the work.

```bash
git switch master
git pull --ff-only origin master
git switch -c spike/42/write-contributing-guide
```

For a task belonging to a user story, use a name such as `user-story/13/task/9/implement-user-login`. For a spike, use `spike/<issue-number>/<short-description>`. Keep each branch focused on one task or spike and aim to have it reviewed and merged within two to three days.

### 3. Make and verify changes

Follow the contribution rules below. Stage only the intended files and write a descriptive, single-line commit message. For this documentation spike:

```bash
git status
git add CONTRIBUTING.md
git commit -m "Document team norms, contribution workflow, and local setup"
```

### 4. Merge the latest master into your branch and push

Run these commands while still on your work branch:

```bash
git fetch origin
git merge origin/master
git push -u origin spike/42/write-contributing-guide
```

If conflicts occur, resolve them, stage the resolved files, complete the merge commit, and verify the changes again before pushing. Ask a teammate for help if the correct resolution is unclear.

**No rebasing:** do not use `git rebase`, `git pull --rebase`, or force pushes. Bring in updates by merging `origin/master`. Preserve merge history.

### 5. Open a pull request and request review

On GitHub, open a pull request with:

- **Base repository:** the team's CurbCut repository, rather than the instructor's original repository.
- **Base branch:** `master`.
- **Compare branch:** your work branch.
- **Description:** what changed, the linked issue (for example, `Closes #42`), and how you verified the changes. State any remaining limitations.
- **Reviewer:** at least one of the other three developers, selected under **Reviewers**. Assigning someone to the issue alone does not request a PR review.

Move the issue to the project's awaiting-review status. The reviewer reads the changes, checks the acceptance criteria, and verifies the behavior where applicable. Address requested changes on the same branch, push updates, and request another review.

### 6. Merge after approval

- A pull request needs **at least one GitHub approval from another teammate** before merging. Authors cannot approve their own work.
- Resolve review comments and conflicts, and pass all configured checks. If changes are made after approval, ask the reviewer to review and approve the final changes before merging.
- A teammate merges the approved pull request using GitHub's **Create a merge commit** option. Do not use **Rebase and merge** or **Squash and merge**.
- After merging, confirm the linked issue is closed, move its card to done, and delete the merged work branch when it is no longer needed.
- Each developer then updates their local `master` with `git switch master` followed by `git pull --ff-only origin master`.

## Contribution rules

Agree on the scope of your contribution before starting work.

### What to contribute

Contributions may include:

- Features and accessibility improvements agreed on during sprint planning.
- Bug fixes. Include reproduction steps and expected versus actual behavior in the issue.
- Documentation and tests.
- Research spikes. Record findings and recommended next steps in the issue or linked documentation. A spike does not need to belong to a user story.

Propose larger changes in an issue before implementation.

### Submission requirements

Check your contribution before requesting review:

- Create or claim an issue before starting; agree on the goal and acceptance criteria.
- Keep changes focused. Avoid unrelated refactoring or formatting changes in the same pull request.
- Follow existing code style and course JavaScript conventions. Use clear names, small commits, and descriptive single-line commit messages. Follow the team's formatting/linting configuration when it is added.
- Verify changes before requesting review. For documentation, preview the Markdown and check commands, links, paths, and consistency with the repository. For code, test the affected behavior and run applicable configured tests, lint, and build checks once available. Report what you checked in the PR.
- Update documentation when setup, commands, configuration, or behavior changes.
- Never commit secrets, credentials, API keys, or `.env` files. Keep real configuration local; use documented placeholders in example configuration. Check staged changes before committing.
- Share blockers and ask for help early. Review teammates' pull requests promptly and give specific, respectful feedback.

## Definition of done

Mark a task or spike as done only when all applicable conditions are met:

- [ ] The acceptance criteria are met.
- [ ] The changes have been verified, and applicable configured checks pass.
- [ ] Relevant documentation is updated.
- [ ] At least one teammate has approved the final changes.
- [ ] The pull request is merged into `master`.
- [ ] The linked issue and project board reflect completion.
