# Git Team Workflow Cheat Sheet (INFS803 - NZParadise Project)

## Branching Strategy
- `main`: Production (auto-deploy to prod server) — **protected**
- `test`: Testing/Staging (auto-deploy to test server) — **protected**
- `develop`: Integration branch for merging features — **semi-protected**
- `feature/*`: Individual task branches (e.g., `feature/thant-login-form`)

---

## Team Member Workflow

### 1. Sync with Latest `develop`
```bash
git checkout develop
git pull origin develop
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/yourname-taskname
```

### 3. Work on the Task
```bash
# Make changes...
git add .
git commit -m "Add login form component"
```

### 4. Rebase to Stay Up-to-date
```bash
git fetch origin
git rebase origin/develop
# Resolve conflicts if any, then:
git add .
git rebase --continue
```

### 5. Push Your Branch and Open a PR
```bash
git push origin feature/yourname-taskname
```

- Go to GitHub/GitLab
- Create a pull request **into `develop`**
- Request review from the team lead or a teammate

---

## Team Lead Responsibilities

### 1. Review & Merge Pull Requests
- Review PRs for:
  - Code quality
  - Commit message clarity
  - Functionality
- If all good:
  - Merge via GitHub/GitLab UI or CLI

### 2. Promote Code to `test` Branch
```bash
git checkout test
git pull origin test
git merge develop
git push origin test
```

- This triggers deployment to the test server

### 3. Promote Tested Code to `main`
```bash
git checkout main
git pull origin main
git merge test
git push origin main
```

- This triggers deployment to the production server

---

## Conflict Resolution (for Everyone)

1. Git will highlight conflict markers:
   ```text
   <<<<<<< HEAD
   your changes
   =======
   their changes
   >>>>>>> origin/develop
   ```
2. Edit the file to keep the correct version
3. Save and run:
   ```bash
   git add .
   git rebase --continue  # or git commit if using merge
   ```

**Tip:** Use VS Code or GitHub Desktop for GUI-based conflict resolution.

---


## Naming Conventions
| Branch Type   | Format                            |
|---------------|-----------------------------------|
| Feature       | `feature/yourname-taskname`       |
| Bugfix        | `bugfix/yourname-bug-description` |
| Hotfix        | `hotfix/critical-fix`             |
