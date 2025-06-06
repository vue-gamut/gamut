# CI/CD Workflows

This monorepo uses GitHub Actions with Changesets for automated testing, versioning, and publishing.

## 📋 Workflows Overview

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Triggers**: Pull requests and pushes to `main`

**What it does**:

- ✅ Builds all packages
- ✅ Runs tests
- ✅ Validates that PRs include changesets
- ✅ Caches dependencies for faster runs

### 2. **Release Workflow** (`.github/workflows/release.yml`)

**Triggers**: Pushes to `main` branch

**What it does**:

- 🔍 Checks for changesets
- 📦 If changesets exist → Creates a "Release PR" with version bumps
- 🚀 If Release PR is merged → Publishes packages to npm
- 📝 Generates changelogs automatically

### 3. **Dependency Update** (`.github/workflows/dependency-update.yml`)

**Triggers**: Weekly schedule (Mondays) + manual dispatch

**What it does**:

- 📈 Updates all dependencies to latest versions
- 🔄 Creates PR with dependency updates
- 🔍 Requires manual review before merging

## 🚀 Publishing Process

### Step 1: Development

```bash
# Make changes to your packages
# Add features, fix bugs, etc.
```

### Step 2: Create Changeset

```bash
# Describe your changes
pnpm changeset

# This creates a markdown file in .changeset/ describing:
# - Which packages changed
# - Type of change (patch/minor/major)
# - Human-readable description
```

### Step 3: Create Pull Request

```bash
# Push your changes + changeset
git add .
git commit -m "feat: add new component"
git push origin feature-branch

# Create PR to main branch
```

### Step 4: Automatic Release

1. **PR gets merged** → Release workflow runs
2. **Release PR created** → Contains version bumps + changelogs
3. **Merge Release PR** → Packages automatically published to npm

## 🔐 Required GitHub Secrets

Add these secrets to your GitHub repository:

### `NPM_TOKEN`

1. Go to [npmjs.com](https://npmjs.com) → Account → Access Tokens
2. Generate an "Automation" token
3. Add to GitHub: Settings → Secrets → Actions → `NPM_TOKEN`

## 📝 Best Practices

### ✅ DO

- Always include changesets in PRs that modify packages
- Use semantic versioning (patch/minor/major)
- Write clear changeset descriptions
- Let the Release workflow handle publishing

### ❌ DON'T

- Publish manually (`npm publish`)
- Bump versions manually
- Skip changesets for package changes
- Push directly to main (use PRs)

## 🔧 Workflow Customization

### Modify Publishing Trigger

If you want to publish on tags instead of main pushes:

```yaml
# In .github/workflows/release.yml
on:
  push:
    tags: ["v*"]
```

### Add Additional Validation

Add steps to CI workflow:

```yaml
- name: Lint code
  run: pnpm lint

- name: Type check
  run: pnpm type-check
```

### Environment-Specific Releases

For staging releases, add to release workflow:

```yaml
- name: Publish to staging
  if: contains(github.ref, 'beta')
  run: pnpm changeset:publish --tag beta
```

## 🐛 Troubleshooting

### "No changeset found" error

**Solution**: Run `pnpm changeset` and describe your changes

### Publishing fails

**Check**:

- NPM_TOKEN is valid and has publish permissions
- Package names are available on npm
- You have access to publish scoped packages

### Release PR not created

**Check**:

- Changesets exist in `.changeset/` folder
- Main branch is up to date
- No syntax errors in changeset files
