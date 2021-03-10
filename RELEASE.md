# Releasing Stark

## Pre-reqs

### Local

On your local machine, you must configure the `GITHUB_TOKEN` environment variable.
It will be used by release-it to push to and create the release page on GitHub (cfr [What happens once a release is triggered](#release-process) section below).

### GitHub Actions

On GitHub Actions, the following should be configured:

- NPM_TOKEN environment variable
  - if 2FA is enabled for the account the only auth-only level can be used: https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication
  - that variable MUST NEVER be logged/exposed. If exposed then the token MUST be revoked and the account password changed ASAP

## Changelog

First of all: _**Never**_ edit [CHANGELOG.md](./CHANGELOG.md) manually!

The changelog will be updated automatically as part of the release process and based on the commit log using conventional-changelog (https://github.com/conventional-changelog)
We use the Angular format for our changelog and for it to work properly, please make sure to respect our commit conventions (see our [CONTRIBUTING](./CONTRIBUTING.md) guide).

## Creating a release

Make sure that:

- all changes have merged into master
- everything is up to date locally
- everything is clean locally
- the base version set for nightly builds (at `config.nightlyVersion` in the root `package.json`) is higher than the version to be released
- execute `npm run release`

Enjoy the show!

_NOTE:_ If any of the pre-conditions mentioned above are not met, no worries, the npm command will fail with the proper description about what needs to be fixed.

## Publishing the release on npm

Once you have pushed the tag, GitHub Actions will handle things from there.

Once done, you must make sure that the distribution tags are adapted so that the `latest` tag still points to what we consider the latest (i.e., next major/minor)!
Refer to the "Adapting tags of published packages" section below.

## <a name="release-process"></a>What happens once a release is triggered

### release

- first we make sure that there are no local changes (if there are we stop right there)
- then we execute release-it: https://github.com/webpro/release-it which
  - bumps the version in the root package.json automatically (determines the bump type to use depending on the commit message logs)
    - that version number will be used as basis in the build to adapt all other package.json files
  - checks that the base version for nightly builds (at `config.nightlyVersion` in the root `package.json`) is higher than the version to be released
  - generates/updates the [CHANGELOG.md](./CHANGELOG.md) file using: conventional-changelog: https://github.com/conventional-changelog
  - commits both package.json and CHANGELOG.md
  - creates a new git tag and pushes it
  - creates a github release page and makes it final

After this, the release is tagged and visible on github

### documentation publish

#### What

Once the tag is pushed to GitHub, GitHub Actions picks it up and initiates a build.

GitHub Actions executes builds, tests, then executes `npm run docs:publish`.

That script makes some checks then, if all succeed it publishes the API docs of the different packages as well as the production build output of the showcase to Github pages.

#### How

Checks that are performed:

- node version: should be "10"
- GITHUB_REPOSITORY should be "NationalBankBelgium/stark"
- GH_ACTIONS_TAG should be defined and not empty (this is the case when GitHub Actions builds for a tag)
- GITHUB_EVENT_NAME should be different of "pull_request"
- GITHUB_REF should be "refs/heads/master"
- GITHUB_EVENT_NAME should be "schedule" (i.e., not a nightly build or manual build)

More details here: https://github.com/NationalBankBelgium/stark/issues/282

#### Security

The docs publication uses the `${{ secrets.GITHUB_TOKEN }}` secret that has write access to the Stark repository.
The secret is available in GitHub Actions when executing a plan for a "push" or a "scheduled" event.

### npm packages publish

Finally, GitHub Actions executes `npm run release:publish`.

That script makes some checks then, if all succeed, it publishes the different packages on npm and sets the `latest` and `next` distribution tags to the published version.

Checks that are performed:

- node version: should be "10"
- NPM_TOKEN environment variable should be defined
- GITHUB_REPOSITORY should be "NationalBankBelgium/stark"
- GH_ACTIONS_TAG should be defined and not empty (this is the case when GitHub Actions builds for a tag)

Other details can be found here: https://github.com/NationalBankBelgium/stark/issues/54

## Adapting tags of published packages

If a published version doesn't have all necessary distribution tags, or if we want to adapt those for some reason (e.g., `latest` pointing to a patch release rather than the latest major/minor), then we can use the `npm dist-tag` command.
Reference: https://docs.npmjs.com/cli/dist-tag
