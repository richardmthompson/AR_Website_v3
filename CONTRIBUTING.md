# Contributing to AR Automation Website

Thank you for contributing to the AR Automation project! This guide outlines our development workflow and best practices.

## Development Philosophy

We follow these core principles (see [CLAUDE.md](./CLAUDE.md) for details):

- **KISS** (Keep It Simple, Stupid) - Simple solutions over complex ones
- **YAGNI** (You Aren't Gonna Need It) - Build only what's needed now
- **Progressive Enhancement** - Start simple, add complexity when required

## Getting Started

### Quick Reference Workflow

```bash
# Start new work
git checkout main && git pull origin main
git checkout -b feat/your-feature

# Make changes, then commit
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push -u origin feat/your-feature
gh pr create
```

### In-Depth Reference Workflow

Follow this workflow for all contributions:

### 1. Initial Setup (First Time Only)

```bash
# Clone the repository
git clone https://github.com/your-org/ar3_website.git
cd ar3_website

# Set up your environment
cp .env.example .env
# Edit .env with your API keys and configuration

# Install dependencies and verify setup
docker-compose up --build
# Or follow README.md for manual setup
```

### 2. Starting New Work

**Always start from an updated main branch:**

```bash
# Switch to main branch
git checkout main

# Pull the latest changes from remote
git pull origin main

# Create a new feature branch (see naming conventions below)
git checkout -b feat/your-feature-name
```

### 3. Making Changes

```bash
# Make your code changes in your editor
# ...

# Check what files you've modified
git status

# Stage specific files you want to commit
git add path/to/file1.ts path/to/file2.tsx

# Or stage all changes (use carefully!)
git add .

# Review what you're about to commit
git diff --staged
```

### 4. Testing Your Changes

Before committing, always test:

```bash
# Frontend tests
cd frontend
npm run check    # TypeScript
npm run lint     # ESLint
npm run build    # Build test
cd ..

# Backend tests
cd backend
pytest           # Run tests
cd ..

# Manual testing - verify functionality works
```

### 5. Committing Changes

```bash
# Commit with a descriptive message (see commit guidelines below)
git commit -m "feat: add email notification feature

Implemented email notifications using Resend API when leads
are qualified through the chatbot."

# If you have multiple logical changes, make separate commits
git add path/to/feature1.ts
git commit -m "feat: add feature 1"

git add path/to/feature2.ts
git commit -m "feat: add feature 2"
```

### 6. Keeping Your Branch Updated

**If main has been updated while you're working:**

```bash
# Fetch latest changes
git fetch origin

# Switch to main and update
git checkout main
git pull origin main

# Switch back to your branch
git checkout feat/your-feature-name

# Merge main into your branch
git merge main

# Resolve any conflicts if they occur
# Then test everything still works!
```

### 7. Pushing Your Branch

```bash
# Push your branch to remote (first time)
git push -u origin feat/your-feature-name

# Subsequent pushes (after more commits)
git push
```

### 8. Creating a Pull Request

```bash
# Option 1: Use GitHub CLI (recommended)
gh pr create --title "feat: Add email notifications" --body "Description of changes"

# Option 2: Use GitHub web interface
# Visit https://github.com/your-org/ar3_website/pulls
# Click "New Pull Request"
# Select your branch and create PR
```

See [Pull Request Process](#pull-request-process) below for PR guidelines.


## Branching Strategy

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

```
feat/your-feature-name       # New features
fix/bug-description          # Bug fixes
refactor/component-name      # Code refactoring
docs/what-you-updated        # Documentation updates
chore/task-description       # Maintenance tasks (deps, config, etc.)
test/what-you-tested         # Test additions/updates
```

**Examples:**
- `feat/email-notifications`
- `fix/chatbot-language-switch`
- `refactor/database-models`
- `docs/deployment-guide`
- `chore/update-dependencies`

### Branch Workflow

1. **Always branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature
   ```

2. **Keep your branch up to date:**
   ```bash
   git checkout main
   git pull origin main
   git checkout feat/your-feature
   git merge main
   ```

3. **Push your branch:**
   ```bash
   git push origin feat/your-feature
   ```

## Working on Multiple Features in Parallel

### The Problem

Working on multiple features simultaneously without proper branching leads to:
- Mixed changes in the same files
- Inability to cleanly separate features for PRs
- Difficulty tracking which changes belong to which feature
- Complex merge conflicts

### The Solution: Isolate Each Feature in Its Own Branch

#### 1. Start Each Feature on Its Own Branch

```bash
# Always branch from main (or your base branch)
git checkout main
git pull origin main  # Get latest changes

# Create and switch to feature branch
git checkout -b feat/feature-name
```

**Example workflow for parallel features:**
```bash
# Start Feature 1: EdTech Summit Page
git checkout main
git checkout -b feat/edtech-summit-page
# Work on EdTech files...
# Edit EdTechSummitPage.tsx, add to App.tsx
git add frontend/src/pages/EdTechSummitPage.tsx frontend/src/App.tsx
git commit -m "feat: add EdTech Summit internal page"
git push -u origin feat/edtech-summit-page

# Start Feature 2: Contact Bot (from fresh main)
git checkout main
git checkout -b feat/contact-bot-email
# Work on contact bot files...
# Edit ContactPage.tsx, add to App.tsx
git add frontend/src/pages/ContactPage.tsx frontend/src/App.tsx
git commit -m "feat: add contact bot email automation"
git push -u origin feat/contact-bot-email
```

#### 2. Keep Features Isolated

```bash
# Working on EdTech Summit
git checkout feat/edtech-summit-page
# Edit only EdTech-related files
# Commit frequently

# Need to switch to contact bot?
git checkout feat/contact-bot-email
# Edit only contact bot files
# Commit frequently
```

#### 3. Handling Shared Files

When multiple features need to modify the same file (like `App.tsx`), you have three options:

**Option A: Sequential Development (Safest)**
```bash
# Complete and merge feature 1 first
git checkout feat/edtech-summit-page
# Complete work
git push -u origin feat/edtech-summit-page
# Create PR, get it merged to main

# Then start feature 2 from updated main
git checkout main
git pull origin main  # Now has feature 1's changes
git checkout -b feat/contact-bot
# Work on feature 2 - will have feature 1's changes as base
```

**Option B: Rebase Strategy (Advanced)**
```bash
# Feature 1 is done and merged to main
# Feature 2 is in progress but needs feature 1's changes

git checkout feat/contact-bot
git fetch origin
git rebase origin/main  # Brings in feature 1's changes
# Resolve any conflicts
git push --force-with-lease  # Update remote branch
```

**Option C: Stash and Switch**
```bash
# You're working on feature A but need to quickly fix feature B

# On feat/feature-a with uncommitted changes
git stash  # Saves your work temporarily
git stash list  # See what you've stashed

git checkout feat/feature-b
# Make changes to feature B
git add <files>
git commit -m "fix: issue in feature B"
git push

git checkout feat/feature-a
git stash pop  # Restores your feature A work
```

### Advanced: Partial Staging with git add -p

If you've already made mixed changes to a file, you can stage parts of it:

```bash
# Interactive staging - choose which changes to stage
git add -p App.tsx

# Git will show each change (hunk) and ask:
# Stage this hunk [y,n,q,a,d,s,e,?]?
# y = yes, stage this change
# n = no, skip this change
# s = split into smaller hunks
# e = manually edit the hunk
# q = quit (don't stage remaining hunks)
# a = stage this hunk and all remaining hunks
# d = don't stage this hunk or remaining hunks
```

**Example scenario:**
```diff
@@ -20,6 +20,8 @@
     <Switch>
       <Route path="/" component={HomePage} />
+      <Route path="/edtechsummit" component={EdTechSummitPage} />
       <Route path="/solutions" component={SolutionsPage} />
+      <Route path="/contact" component={ContactPage} />
```

To separate these changes:
1. Type `s` to split the hunk
2. Type `y` for EdTech route (stage it)
3. Type `n` for contact route (skip it)
4. Commit staged changes: `git commit -m "feat: add EdTech Summit page"`
5. Stage remaining changes: `git add App.tsx`
6. Commit: `git commit -m "feat: add contact page route"`

### Typical Daily Workflow

```bash
# Morning: Check current state
git status                    # See what branch you're on, what's changed
git branch                    # List all branches (* shows current)

# Start new feature
git checkout main
git pull origin main
git checkout -b feat/new-feature

# Work on the feature...
# Make changes in your editor

# Commit your work
git add <specific-files>      # Or git add . for all changes
git commit -m "feat: descriptive message"

# Push to remote (backs up your work + enables PR)
git push -u origin feat/new-feature  # First time
git push                             # Subsequent times

# Need to switch features?
git status                    # Check for uncommitted changes
git commit -am "WIP"          # Commit work in progress, OR
git stash                     # Stash uncommitted changes

git checkout feat/other-feature
# Work on other feature...
git add <files>
git commit -m "feat: other thing"
git push

# Back to first feature
git checkout feat/new-feature
git stash pop                 # If you stashed earlier

# End of day: Make sure all work is pushed
git status                    # Check for uncommitted changes
git add .
git commit -m "feat: end of day progress"
git push
```

### When You Realize You Have Mixed Changes

**Option 1: Accept it** (pragmatic)
- Commit everything together
- Note in commit message that it contains work from multiple features
- Move on
- Use this when changes are small or time-sensitive

**Option 2: Split with git add -p**
- Use `git add -p` to stage only related changes
- Create separate commits for each feature
- Requires changes to be in different parts of files
- Use this when features are logically separate

**Option 3: Start over with branches** (cleanest but time-consuming)
- Commit current state as WIP
- Create proper feature branches
- Cherry-pick or manually copy changes to correct branches
- Reset original branch to clean state
- Use this when features must be completely separated

### Best Practices for Parallel Development

✅ **DO:**
- Branch from `main` for each new feature
- Commit frequently with clear messages
- Push branches early (even if incomplete) - backs up your work
- Keep feature scope focused and small
- Merge/rebase `main` into your branch regularly to avoid conflicts
- Use `git status` and `git branch` often to stay oriented

❌ **DON'T:**
- Work on multiple features in the same branch
- Wait days to commit (commit at least daily)
- Commit unrelated changes together
- Work directly on `main`
- Let branches get too far behind `main`
- Use `git add .` without reviewing `git status` first

### Useful Git Commands for Parallel Work

```bash
# See what branch you're on and what's changed
git status

# List all branches
git branch
git branch -a              # Include remote branches

# See detailed diff of changes
git diff                   # Unstaged changes
git diff --staged          # Staged changes
git diff main              # Diff between current branch and main

# See commit history
git log --oneline          # Compact view
git log --graph --oneline --all  # Visual branch view

# See what files changed in a commit
git show <commit-hash>     # Full diff
git show --name-only <commit-hash>  # Just file names

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all uncommitted changes (dangerous!)
git reset --hard HEAD
git clean -fd              # Remove untracked files
```

### Git GUI Tools

Consider using a visual Git client for easier branch management:

- **GitKraken** - Powerful, visual, cross-platform
- **SourceTree** - Free, feature-rich
- **GitHub Desktop** - Simple, beginner-friendly
- **VS Code Git Panel** - Built-in, convenient
- **Fork** - Fast, native UI

These tools make it easier to:
- See all branches at a glance
- Stage partial file changes visually
- Visualize branch history and merges
- Resolve merge conflicts with diff view

## Commit Messages

### Format

Use clear, descriptive commit messages:

```
<type>: <subject>

<optional body>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional changes)
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc. (no code change)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates

### Examples

**Good commits:**
```
feat: add email notification for new leads

Implemented email notifications using Resend API when new leads
are qualified through the chatbot.
```

```
fix: resolve language switcher state persistence

Language preference now correctly persists across page refreshes
using localStorage.
```

```
refactor: simplify chatbot message handling

Consolidated message state management into single hook to reduce
component complexity.
```

**Bad commits (avoid these):**
```
update stuff
fixed bug
WIP
changes
```

### Commit Best Practices

- **One logical change per commit** - Makes reviews easier
- **Present tense** - "add feature" not "added feature"
- **Imperative mood** - "fix bug" not "fixes bug"
- **Keep subject under 72 characters**
- **Add body for complex changes** - Explain why, not what
- **Reference issues** - Use `#123` to link to issues

## Pull Request Process

### Before Creating a PR

1. **Test your changes:**
   ```bash
   # Frontend
   cd frontend
   npm run check    # TypeScript
   npm run lint     # ESLint
   npm run build    # Build test

   # Backend
   cd backend
   pytest           # Run tests
   ```

2. **Update documentation** if needed (README, CLAUDE.md, etc.)

3. **Ensure clean commit history:**
   - Squash WIP commits if needed
   - Rebase on latest `main` if behind

### Creating a PR

1. **Go to GitHub** and create a pull request

2. **Use descriptive PR title:**
   ```
   feat: Add email notifications for qualified leads
   fix: Resolve chatbot language switching bug
   ```

3. **Fill out PR description:**
   ```markdown
   ## Summary
   Brief description of what this PR does

   ## Changes
   - Added email notification service
   - Updated lead model with email fields
   - Added Resend API integration

   ## Testing
   - [ ] Tested locally with Docker
   - [ ] Verified email sends correctly
   - [ ] Checked error handling

   ## Screenshots (if applicable)
   [Add screenshots for UI changes]

   ## Related Issues
   Closes #123
   ```

### PR Review Process

1. **Request review** from team member
2. **Respond to feedback** constructively
3. **Make requested changes** in new commits (don't force push during review)
4. **Notify reviewer** when ready for re-review
5. **Squash merge** to main (keeps history clean)

### PR Checklist

Before requesting review, ensure:

- [ ] Code follows project style guidelines (CLAUDE.md)
- [ ] All tests pass
- [ ] No TypeScript/linting errors
- [ ] Documentation updated if needed
- [ ] PR description is clear and complete
- [ ] Commits are clean and meaningful
- [ ] Branch is up to date with main

## Code Review Guidelines

### As a Reviewer

**Be constructive:**
- ✅ "Consider extracting this into a reusable hook"
- ❌ "This code is bad"

**Focus on:**
- Logic errors and bugs
- Security issues
- Performance concerns
- Code maintainability
- Alignment with CLAUDE.md guidelines

**Approve when:**
- Code works as intended
- Tests pass
- No major concerns
- Minor issues can be addressed in follow-up

### As an Author

**Be receptive:**
- Assume good intent
- Ask for clarification if needed
- Explain your reasoning
- Be willing to make changes

**Respond to all comments:**
- "Fixed in abc123"
- "Good catch, updated"
- "I kept X because Y, let me know if you disagree"

## Versioning Strategy

We use **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

### Version Format

```
1.2.3
│ │ │
│ │ └─ PATCH: Bug fixes, minor changes
│ └─── MINOR: New features (backwards compatible)
└───── MAJOR: Breaking changes
```

### When to Bump Versions

- **MAJOR (1.x.x → 2.0.0)** - Breaking changes (API changes, removed features)
- **MINOR (1.1.x → 1.2.0)** - New features (backwards compatible)
- **PATCH (1.1.1 → 1.1.2)** - Bug fixes, small improvements

### Version Workflow

1. **Update version** in relevant files when ready to release:
   - `frontend/package.json`
   - `backend/app/__init__.py` (add `__version__` if needed)

2. **Create release commit:**
   ```bash
   git commit -m "chore: bump version to 1.2.0"
   ```

3. **Tag the release:**
   ```bash
   git tag -a v1.2.0 -m "Release version 1.2.0"
   git push origin v1.2.0
   ```

4. **Create GitHub release** with changelog

### Current Version

Check version in:
- Frontend: `frontend/package.json`
- Backend: TBD (add `__version__` when needed)

## Code Style Guidelines

### Frontend (TypeScript/React)

Follow guidelines in [CLAUDE.md](./CLAUDE.md#frontend-development-guidelines):

- Use TypeScript, no `any` types
- Components under 200 lines
- Use Tailwind CSS for styling
- Use TanStack Query for data fetching
- Prefer functional components with hooks

### Backend (Python/FastAPI)

Follow guidelines in [CLAUDE.md](./CLAUDE.md#backend-development-guidelines):

- Use Pydantic for validation
- Type hints for all functions
- Keep routes simple, extract logic to services
- Use SQLAlchemy for database operations

### General

- **DRY** (Don't Repeat Yourself) - Extract reusable code
- **SOLID** principles where appropriate
- **Meaningful names** - Clear variable/function names
- **Comments** - Explain why, not what
- **Keep it simple** - Don't over-engineer

## Testing

### Frontend

```bash
cd frontend
npm run check    # Type checking
npm run lint     # Linting
npm run build    # Build test
```

### Backend

```bash
cd backend
pytest           # Run tests
pytest -v        # Verbose output
pytest --cov     # With coverage
```

### Manual Testing

Before submitting PR:

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile viewport
- [ ] Test both light/dark themes
- [ ] Test both EN/DE languages
- [ ] Test chatbot flow end-to-end
- [ ] Verify no console errors

## Environment Setup

### Local Development

See [README.md](./README.md#getting-started) for detailed setup.

**Quick start:**
```bash
# Copy environment template
cp .env.example .env

# Add your API keys to .env
# OPENAI_API_KEY=your-key

# Start with Docker
docker-compose up --build
```

### Environment Variables

Never commit:
- API keys
- Database passwords
- Secrets

Always use `.env` files (gitignored).

## Common Tasks

### Add a New Frontend Component

```bash
cd frontend/src/components
# Create YourComponent.tsx
# Import in parent component
# Add translations if needed in i18n/
```

### Add a New Backend Endpoint

```bash
cd backend/app
# Add route in main.py
# Add Pydantic models if needed
# Update OpenAPI docs (automatic)
```

### Update Dependencies

```bash
# Frontend
cd frontend
npm update
npm audit fix

# Backend
cd backend
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

### Database Migrations

Currently using SQLAlchemy auto-create. For production:

```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Deployment

See [PROGRESS.md](./PROGRESS.md#deployment-strategy) for deployment options.

**Production checklist:**
- [ ] Environment variables configured
- [ ] Database set up (Neon recommended)
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Error logging configured (Sentry)
- [ ] Analytics configured

## Getting Help

- **Technical questions**: See [CLAUDE.md](./CLAUDE.md)
- **Setup issues**: See [README.md](./README.md)
- **Project status**: See [PROGRESS.md](./PROGRESS.md)
- **Questions**: Open an issue or ask in team chat

## Recognition

We appreciate all contributions! Contributors will be acknowledged in release notes.

---

**Remember:** Keep it simple. When in doubt, refer to our core principles (KISS, YAGNI) and ask for feedback early.

*Last updated: October 2025*
