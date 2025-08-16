# Release Process

This document outlines the process for creating releases and publishing to NPM.

## Prerequisites

1. **NPM Token**: A valid NPM authentication token must be set up as a GitHub secret named `NPM_TOKEN`
2. **Repository URLs**: Update the repository URLs in `package.json` to match your actual GitHub repository
3. **Permissions**: Ensure you have publish permissions to the NPM package

## Setting up NPM Token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Go to "Access Tokens" in your profile settings
3. Create a new token with "Automation" type (for CI/CD)
4. Copy the token
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Create a new secret named `NPM_TOKEN` and paste the token value

## Release Process

### 1. Prepare the Release

1. **Update Version**: Update the version in `package.json`
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG**: Document changes in a CHANGELOG.md file (if you have one)

3. **Final Testing**: Ensure all tests pass
   ```bash
   npm test
   npm run typecheck
   npm run build
   ```

### 2. Create the Release

1. **Push Changes**: Push your changes to the main branch
   ```bash
   git push origin main
   git push origin --tags
   ```

2. **Create GitHub Release**:
   - Go to your GitHub repository
   - Click "Releases" → "Create a new release"
   - Choose the tag that was created by `npm version`
   - Add release notes describing the changes
   - Click "Publish release"

### 3. Automatic Publishing

Once the release is published:

1. The **publish.yml** workflow will automatically trigger
2. It will:
   - Install dependencies
   - Run all tests
   - Run type checking
   - Build the package
   - Verify package contents
   - Publish to NPM with provenance

### 4. Verify Publication

1. Check that the package was published to NPM
2. Test installation: `npm install -g math-mcp`
3. Test CLI functionality: `math-mcp --help`

## Workflow Files

### `.github/workflows/publish.yml`
- Triggers on release publication
- Runs full test suite
- Publishes to NPM with provenance

### `.github/workflows/ci.yml`
- Runs on push/PR to main branch
- Tests across multiple Node.js versions (18, 20, 22)
- Validates CLI functionality

## Package Configuration

The package is configured to include:
- `dist/` - Compiled JavaScript and type definitions
- `grammar.txt` - Grammar specification
- `README.md` - Documentation
- `LICENSE` - License file

Files excluded from NPM package (via `.npmignore`):
- Source TypeScript files
- Development configuration
- Tests
- GitHub workflows

## Troubleshooting

### Publication Fails
- Check NPM token is valid and has correct permissions
- Ensure package name is available on NPM
- Verify version number hasn't been published before

### Tests Fail in CI
- Ensure all dependencies are properly listed in `package.json`
- Check that build artifacts are correct
- Verify CLI commands work as expected

### Version Management
- Use semantic versioning (semver)
- patch: bug fixes (1.0.1)
- minor: new features (1.1.0)  
- major: breaking changes (2.0.0)