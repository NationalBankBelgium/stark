# Releasing Stark

## Pre-reqs
### Local
On your local machine, you must configure the `GITHUB_TOKEN` environment variable.
It will be used by release-it to push to and create the release page on GitHub (cfr release:prepare section below).

### Travis
On Travis, the following should be configured:
* NPM_TOKEN environment variable
  * if 2FA is enabled for the account the only auth-only level can be used: https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication
  * that variable MUST NEVER be logged/exposed. If exposed then the token MUST be revoked and the account password changed ASAP

## Changelog
First of all: *Never* edit CHANGELOG.md manually!

The changelog will be updated automatically as part of the release process and based on the commit log using conventional-changelog (https://github.com/conventional-changelog)
We use the Angular format for our changelog and for it to work properly, please make sure to respect our commit conventions (see CONTRIBUTING guide).

## Creating a release
Make sure that:
* all changes have merged into master
* everything is up to date locally
* everything is clean locally
* execute `npm run release`

Enjoy the show.

## Publishing the release on npm
Once you have pushed the tag, Travis will handle things from there.

Once done, you must make sure that the tags are adapted so that the "latest" tag still points to what we consider the latest (i.e., next major/minor)!
Refer to the "Adapting tags of published packages" section below.

## What happens once a release is triggered

### release
* first we make sure that there are no local changes (if there are we stop right there)
* then we execute release-it: https://github.com/webpro/release-it which
  * bumps the version in the root package.json automatically (determines the bump type to use depending on the commit message logs)
    * that version number will be used as basis in the build to adapt all other package.json files
  * generates/updates the CHANGELOG.md file using: conventional-changelog: https://github.com/conventional-changelog
  * commits both package.json and CHANGELOG.md
  * creates a new git tag and pushes it
  * creates a github release page and makes it final

After this, the release is tagged and visible on github

### publish
Once the tag is pushed to GitHub, Travis picks it up and initiates a build.
Travis executes builds, tests, then executes `npm run release:publish`.

That script makes some checks then, if all succeed it publishes the different packages on npm.
Checks that are performed:
* node version: should be "8"
* NPM_TOKEN environment variable should be defined
* TRAVIS_REPO_SLUG should be "NationalBankBelgium/stark"
* TRAVIS_TAG should be defined and not empty (this is the case when Travis builds for a tag) 

Other details can be found here: https://github.com/NationalBankBelgium/stark/issues/54

## Adapting tags of published packages
If a published version doesn't have all necessary tags, or if we want to adapt those for some reason (e.g., latest pointing to a patch release rather than the latest major/minor), then we can use the `npm dist-tag` command.
Reference: https://docs.npmjs.com/cli/dist-tag