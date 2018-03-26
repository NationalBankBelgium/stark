# Contributing to Stark
Stark has been created to fulfill the National Bank of Belgium's front-end development needs, but is now an open source project.

As such, third party contributions are more than welcome! Here you'll find all the information you need to get started.

We would love for you to contribute to Stark and make it better and better.
As a contributor, here are the guidelines we would like you to follow.

## Code of Conduct
Help us keep Stark open and inclusive. Please read and follow our [Code of Conduct](/CODE_OF_CONDUCT.md).

## Got a question or problem?
Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/stark) where the questions should be tagged with tag `stark`

Stack Overflow is a much better place to ask questions since:
* there are thousands of people willing to help on Stack Overflow
* questions and answers stay available for public viewing so your question / answer might help someone else
* Stack Overflow's voting system assures that the best answers are prominently visible.

You may also create GH issues with the "question" label. We'll do our best to help.

## Don't know where to start?
Take a look at the project's open [issues](https://github.com/NationalBankBelgium/stark/issues) and [milestones](https://github.com/NationalBankBelgium/stark/issues/milestones).
This contains tons of ideas to help us out.

## Found a bug?
If you feel like you've discovered a bug, then a GH issue is clearly the way to go, with a follow-up PR indeed ;-)

## Missing a feature?
You can _request_ a new feature by submitting an issue to our repository. If you would like to _implement_ a new feature, please submit an issue with a proposal for your work first, to be sure that we can use it.

## Submission guidelines

### Submitting an issue
Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs, we will systematically ask you to provide a minimal reproduction scenario using [Plunker](https://plnkr.co).
Having a live, reproductible scenario gives us a wealth of important information without going back & forth to you with additional questions like:
* version of Stark & Angular used
* 3rd party libraries and their versions
* and most importantly, a use-case that fails

A minimal reproduce scenario allows us to quickly confirm a bug (or point out coding problem) as well as confirm that we are fixing the right problem. If plunker is not a suitable way to demonstrate the problem (for example for issues related to our npm packaging), please create a standalone git repository demonstrating the problem.

We will be insisting on a minimal reproduce scenario in order to save maintainers time and ultimately be able to fix more bugs.

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by filling out our [new issue form](https://github.com/NationalBankBelgium/stark/issues/new).

### Forking
Stark development is done using a forking model with Pull Requests (PRs), so the very first thing you should do is create your fork: https://help.github.com/articles/fork-a-repo/

### Integrating changes to your fork
Once you're found what you want to contribute to Stark, then:
* Create a feature branch in your fork: `git checkout -b my-new-branch master`
* Configure the upstream: https://help.github.com/articles/configuring-a-remote-for-a-fork/

From then on, you may work on your feature at your own rhythm and commit/push to your fork.

Meanwhile, don't forget to keep your fork up to date: https://help.github.com/articles/syncing-a-fork/
Certainly so before creating a Pull Request (PR). If you don't do it then we'll request it anyways.

Don't forget to write test cases (or adapt existing ones) for your changes! 

### Proposing your changes by submitting a Pull Request (PR)
Before you propose your changes, make sure that your fork is up to date with the upstream and that the whole test suite passes.
Also, try and rebase / squash your commits in order to keep the history clean.

Make sure to commit your changes using a descriptive commit message that follows our [commit message conventions](#commit).

Once done, you may submit a new Pull Request (PR): https://github.com/NationalBankBelgium/stark/pull/new/master

## Main project's structure
TODO add project structure details

## Building from source
If you want to build Stark from source, you need to...
* install NodeJS (6.0.0+) and npm (5.3.0+)
* clone this git repository: `git clone https://github.com/NationalBankBelgium/stark.git`
* run `npm install` from the root directory of Stark
* run `npm run install:all` from the root directory of Stark (this command will also install and build all Stark packages)

### Executing Stark's main build script
Anytime you make modifications to a Stark package (e.g., stark-build, stark-core, ...), you'll need to
* execute `npm run build` from the root directory of Stark
* execute `npm install` again on the starter to get those changes

Stark's main build script is a fun Bash shell script heavily inspired by Angular's that
* typechecks all Stark packages
* transpiles all Stark packages
* generates umd, esm5, ... bundles
* minifies the bundles
* generates sourcemaps
* generates releasable versions of each package
* adds license banners to the generated code
* generates temporary tar.gz files for local testing
* adapts the starter's dependencies to point to the local tar.gz files
* ...

### Hacking the starter
If you want to modify the starter:
* go to the starter's folder: `cd starter`
* install dependencies: `npm install`
* run it: `npm start`
* open up your browser at http://localhost:3000
* make your changes

If you make modifications, they'll be applied automatically after a Webpack rebuild.

By default the starter depends on published Stark packages over at npm.
But once the main build script at Stark's root (cfr previous section) is executed (e.g., using `npm install` or `npm run build` at the root), then the starter will depend on the contents of the dist folder.

### Hacking the Stark packages
If you want to modify Stark packages (e.g., stark-build, stark-core, ...):
* go to the package folder. `cd packages/<name>`
* install its dependencies: `npm install`
* make your changes
* execute `npm run build` at Stark's root 
* update the Starter and test in it

Start hacking :)

If you want to test/validate your changes against the starter, then you can use the following scripts from the root:
* rebuild: `npm run build`
* update the starter: `npm run update-starter`
* run the starter: `npm run starter`

If you only want to build a subset of stark then you can
* execute one of the `build:stark-<name>` npm scripts; for example: `npm run build:stark-core` or `npm run build:stark-build`
* execute the `build` script through npm with the list of packages to build: `npm run build -- --packages=stark-core`
* execute the build script from the command line: `bash ./build.sh --packages=stark-core`


## Releasing a version
* commit all changes to include in the release
* edit the version in package.json
  * respect semver
* update CHANGELOG.MD
* commit
* git tag <version>
* git push --tags
* draft the release on GitHub (add description, etc)
* npm publish

TODO: review/complete; see #31

## <a name="commit"></a> Commit Message Guidelines
We have precise rules over how our git commit messages can be formatted. This leads to **more readable messages** that are easy to follow when looking through the **project history**.
We also use the git commit messages to generate our changelog.

We're using Angular's commit message format: `type(scope): subject`

#### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope
The scope can be anything specifying place of the commit change. For example `stark-core`, `table`, `theme`, `sidenav`, etc. If you make multiple commits for the same component, please keep the naming of this component consistent. For example, if you make a change to navigation and the first commit is `fix(sidenav)`, you should continue to use `sidenav` for any more commits related to navigation.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* do not capitalize first letter
* do not place a period `.` at the end
* entire length of the commit message must not go over 50 characters
* describe what the commit does, not what issue it relates to or fixes
* **be brief, yet descriptive** - we should have a good understanding of what the commit does by reading the subject

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
[reference GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/).

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

## Examples
Here are some commit examples:

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

```
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

Closes #351
```

```
style($location): add couple of missing semi colons
```

```
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace
```

```
feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```