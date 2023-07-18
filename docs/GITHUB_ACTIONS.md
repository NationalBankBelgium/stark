# GitHub Actions with Stark

This documentation explains the main features we use in the build plan,
based on GitHub Actions.

## Actions

### actions/checkout@v2

This official action can be used to check out the repository code in order to
execute tests, build, etc. No parameter is needed to use this action with the current repository.

All the information about this action can be found on [github.com/marketplace/actions/checkout](https://github.com/marketplace/actions/checkout).

### actions/setup-node@v2

This official action can be used to install a specific version of NodeJS in the virtual machine.
It requires the parameter `node-version: '14'` with any version of node.

In Stark build, we execute our tests/build with multiple versions of NodeJS thanks to `strategy.matrix`. See:

```yaml
name: Build and test on Node.js ${{ matrix.node_version }}
runs-on: ubuntu-latest
strategy:
  matrix:
    node_version: ["14", "16"]

steps:
  - name: Use Node.js ${{ matrix.node_version }}
    uses: actions/setup-node@v2
    with:
      node-version: ${{ matrix.node_version }}
```

All the information about this action can be found on [github.com/marketplace/actions/setup-node-js-environment](https://github.com/marketplace/actions/setup-node-js-environment).

### actions/cache@v2

This official action can be used to improve performances of build plans.
In Stark build plan, we use this action to cache the npm cache thanks to the following config:

```yaml
- name: Cache node modules
  uses: actions/cache@v2
  env:
    cache-name: cache-node-modules-${{ matrix.node_version }}-${{ matrix.os }}
  with:
    # npm cache files are stored in `~/.npm` on Linux/macOS
    path: ~/.npm
    key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
	  ${{ runner.os }}-build-${{ env.cache-name }}-
	  ${{ runner.os }}-build-
	  ${{ runner.os }}-
```

All the information about this action can be found on [github.com/marketplace/actions/cache](https://github.com/marketplace/actions/cache).

More documentation about this action be found in [GitHub documentation](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows)

### actions/upload-artifact@v2 - actions/download-artifact@v2

These official actions can be used to share data between jobs. The uploaded content is available for download after
the job execution.

See the following example to understand how these actions can be used:

```yaml
- name: Upload stark packages-dist folder
  uses: actions/upload-artifact@v2
  with:
    name: stark-dist
    path: dist/packages-dist

- name: Download stark packages-dist folder
  uses: actions/download-artifact@v2
  with:
    name: stark-dist
    path: dist/packages-dist
```

All the information about these actions can be found on [github.com/marketplace/actions/upload-a-build-artifact](https://github.com/marketplace/actions/upload-a-build-artifact)
and [github.com/marketplace/actions/download-a-build-artifact](https://github.com/marketplace/actions/download-a-build-artifact).

## BrowserStack actions

Running BrowserStack in GitHub Actions requires setting different actions as explained on [github.com/browserstack/github-actions](https://github.com/browserstack/github-actions).

You can find the Stark configuration below:

```yaml
steps:
  - name: BrowserStack Env Setup
    uses: browserstack/github-actions/setup-env@master
    with:
      username: ${{ secrets.BROWSERSTACK_USERNAME }}
      access-key: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
      project-name: "Stark Showcase"
    if: env.IS_MAIN_ENVIRONMENT == 1

  - name: BrowserStack Local Tunnel Setup
    uses: browserstack/github-actions/setup-local@master
    with:
      local-testing: "start"
      local-logging-level: "all-logs"
      local-identifier: "github-actions-${{ github.run_number }}"
    if: env.IS_MAIN_ENVIRONMENT == 1

  - name: Running application under test
    run: npm run server:prod:ci &
    if: env.IS_MAIN_ENVIRONMENT == 1
    working-directory: showcase

  - name: Running test on BrowserStack
    run: npm run protractor:browserstack
    if: env.IS_MAIN_ENVIRONMENT == 1
    working-directory: showcase

  - name: BrowserStackLocal Stop
    uses: browserstack/github-actions/setup-local@master
    with:
      local-testing: stop
    if: env.IS_MAIN_ENVIRONMENT == 1
```

## Coveralls Action

This action, provided by Coveralls itself, facilitates the usage of Coveralls in a CI plan.
It requires a GitHub token to have a read access to the repo and, optionally, a path to lcov files.

In Stark, we have the following configuration:

```yaml
- name: Coveralls
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: "combined-lcov.info"
```

All the information about this action can be found on [github.com/marketplace/actions/coveralls-github-action](https://github.com/marketplace/actions/coveralls-github-action).

## Built-in methods

### Conditional tasks

Every task can be conditional in GitHub Actions, using the `if` word in the definition.

For instance:

```yaml
jobs:
  first_job:
    # ..
    if: github.event_name != 'schedule'

    steps:
      - name: A conditional task
        run: npm run lint
        if: github.event_name == 'pull_request'
```

In this example, the job "first_job" will be executed if the build is not triggered and then
the task running `npm run lint` will be triggered only if the build is triggered for a pull request.

### Functions

GitHub Actions provide some functions that can be used in the plan definition.
The full documentation is available on [GitHub Docs](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#functions).

For instance, in `if` condition, the following functions can be used:

| Function name                                        | Description                                                | Example                                |
| ---------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| contains - `contains(search, item)`                  | Returns `true` if `search` string contains `itemp` string  | `contains(github.ref, 'dependabot')`   |
| startsWith - `startsWith(searchString, searchValue)` | Returns `true` if `searchString` starts with `searchValue` | `startsWith(github.ref, 'refs/tags/')` |

### Share variable in multiple tasks

Sometimes, it can be required to use a variable in multiple steps in a plan.

For instance, in Stark, we define a variable `IS_MAIN_ENVIRONMENT` to trigger some logic as BrowserStack or Coveralls only once.
To define our variable, we populate the `GITHUB_ENV` variable with the definition of our variable:

```yaml
- name: Set environment variable 'IS_MAIN_ENVIRONMENT'
  run: |
    if [[ '${{ matrix.node_version }}' == '14' ]] && [[ '${{ matrix.os }}' == 'ubuntu-latest' ]]; then
      echo "IS_MAIN_ENVIRONMENT=1" >> $GITHUB_ENV
    else
      echo "IS_MAIN_ENVIRONMENT=0" >> $GITHUB_ENV
    fi

# ...

- name: Generate docs coverage
  run: npm run docs:travis-ci:coverage
  if: env.IS_MAIN_ENVIRONMENT == 1
```

## Variables

GitHub Actions provide a set of environment variables that can be used in build plans.

In Stark, the following vars are used to build:

| Variable name        | Description                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------- |
| GITHUB_ACTIONS       | Value is `true` when running in GitHub Actions CI                                            |
| GITHUB_EVENT_NAME    | Describes event type of the build (ie: `"schedule"`, `"pull_request"`...)                    |
| GITHUB_SHA           | The commit SHA that triggered the workflow                                                   |
| GITHUB_REF           | The branch or tag ref that triggered the workflow (ie: `refs/heads/feature-branch-1`)        |
| GITHUB_REPOSITORY    | The repository name for which GitHub Actions are triggered (ie: `NationalBankBelgium/Stark`) |
| GITHUB_ACTOR         | The name of the person or app that initiated the workflow                                    |
| secrets.GITHUB_TOKEN | GitHub token of the actor of the commit (used for push action)                               |

All the information about the environment variables can be found in [official GitHub documentation](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables).

Besides the Environment Variables, workflow variables can also be used. All the information can be found in [official GitHub "workflow and syntax" documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions).
