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

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs, we will systematically ask you to provide a minimal reproduction scenarion using [Plunker](https://plnkr.co).
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
If you want to build Stark from source, you need to:
* install NodeJS (6.0.0+) and npm (5.3.0+)
* clone this git repository
* ...
* start hacking :)

TODO: review/complete; see #30

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

TODO document commit message guidelines: #28
