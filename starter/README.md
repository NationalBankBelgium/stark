# Stark Starter

## About

This is the project template for Stark based applications.

## Application structure

The Stark Starter follows the [folders-by-feature structure](https://angular.io/guide/styleguide#folders-by-feature-structure) with logical
groupings trying to match Angular concepts:

```txt
|
+---config
|       index-head-config.js                         # defines all the Head tags to be added by Webpack to the app index.html
|       webpack-custom-config.dev.json               # webpack configuration for the development environment
|
+---src
|   |
|   +---app
|   |   |   app.component.css                        # application base styles
|   |   |   app.component.html                       # application template
|   |   |   app.component.spec.ts                    # unit tests for the app component
|   |   |   app.component.ts                         # app root component and controller
|   |   |   app.e2e.ts                               # end-to-end tests for the app class
|   |   |   app.module.ts                            # main application module (configures Angular module, ...)
|   |   |   app.routes.ts                            # root routing configuration
|   |   |   app.services.ts                          # exports the application state
|   |   |   index.ts                                 # exports the app module
|   |   |   material-icons.config.ts                 # helper functions for the Material Design icons configuration
|   |   |   routes.config.ts                         # helper functions for the routing configuration
|   |   |   translation.config.ts                    # helper functions for the translations configuration
|   |   |
|   |   +---foo                                      # feature module (create a folder for each feature module)
|   |   |   |   module.ts                            # module definition (exports an NgModule)
|   |   |   |   routes.ts                            # routing configuration of this module
|   |   |   |   index.ts                             # barrel: re-export all module symbols
|   |   |   |
|   |   |   +---pages                                # smart components for this module
|   |   |   |   |   index.ts                         # barrel: re-export all smart components
|   |   |   |   |
|   |   |   |   +---foo-page                         # example smart component
|   |   |   |   |       foo-page.component.css       # styles for this smart component
|   |   |   |   |       foo-page.component.html      # template for this smart component
|   |   |   |   |       foo-page.component.spec.ts   # unit tests for this smart component
|   |   |   |   |       foo-page.component.ts        # component class for this smart component
|   |   |   |   |       index.ts                     # barrel: re-export the smart component
|   |   |   |   |
|   |   |   |   \---...
|   |   |   |
|   |   |   +---components                           # dumb components for this module
|   |   |   |   |   index.ts                         # barrel: re-export all dumb components
|   |   |   |   |
|   |   |   |   +---baz                              # example dumb component
|   |   |   |   |       baz.component.css            # styles for this dumb component
|   |   |   |   |       baz.component.html           # template for this dumb component
|   |   |   |   |       baz.component.spec.ts        # unit tests for this dumb component
|   |   |   |   |       baz.component.ts             # component class for this dumb component
|   |   |   |   |       baz.e2e.ts                   # end-to-end tests for this dumb component
|   |   |   |   |
|   |   |   |   \---...
|   |   |   |
|   |   |   +---actions                              # NGRX actions utility classes for this module
|   |   |   |       index.ts                         # barrel: re-export all actions
|   |   |   |       foo.actions.ts                   # defines Foo action types and all Foo related action classes
|   |   |   |       ...
|   |   |   |
|   |   |   +---effects                              # NGRX effects: classes that handle specific actions and react to those
|   |   |   |       index.ts                         # barrel: re-export all effects
|   |   |   |       foo.effects.ts                   # effects class that can interact with other services, dispatch other actions, etc. in reaction to actions
|   |   |   |       foo.effects.spec.ts              # unit tests for this effects class
|   |   |   |       ...
|   |   |   |
|   |   |   +---entities                             # domain model entities of this module
|   |   |   |       index.ts                         # barrel: re-export all entities
|   |   |   |       foo.entity.ts                    # entity definition
|   |   |   |       ...
|   |   |   |
|   |   |   +---reducers                             # NGRX reducers for this module
|   |   |   |       index.ts                         # defines the state sub-tree for this module, the state selector and the reducers in charge of updating this state sub-tree
|   |   |   |       foo.reducer.ts                   # reducer that updates the application state sub-tree for this module based on actions
|   |   |   |       foo.reducer.spec.ts              # unit tests for this reducer
|   |   |   |
|   |   |   +---repositories                         # DAOs of this module
|   |   |   |       index.ts                         # barrel: re-export all repositories
|   |   |   |       foo.repository.ts                # repository class implementation to communicate with the backend
|   |   |   |       foo.repository.spec.ts           # unit tests for this repository class
|   |   |   |       ...
|   |   |   |
|   |   |   \---services                             # services of this module
|   |   |           index.ts                         # barrel: re-export all services
|   |   |           foo.service.ts                   # service class implementation
|   |   |           foo.service.spec.ts              # unit tests for this service class implementation
|   |   |           ...
|   |   |
|   |   \---...
|   |
|   +---assets                          # static assets (fonts, images, translations, ...)
|   |   |
|   |   +---fonts                       # application-specific fonts
|   |   |   ...
|   |   |
|   |   +---images                      # application-specific images
|   |   |   |
|   |   |   +---app-icons               # application icons for mobile devices
|   |   |   |   ...
|   |   |   |
|   |   |   +---touch                   # touch icons for mobile devices
|   |   |   |   ...
|   |   |   |
|   |   |   \---...
|   |   |
|   |   +---mock-data                   # data to mock backend responses
|   |   |       mock-data.json          # JSON file containing all mock data
|   |   |
|   |   +---translations                # application-specific translations
|   |   |       en.json                 # English
|   |   |       fr.json                 # French
|   |   |       nl.json                 # Dutch
|   |   |
|   |   \   README.md                   #
|   |
|   +---assets-base                     # static assets that will be copied to the root of the application
|   |       browserconfig.xml           # application icons for Windows mobile devices
|   |       crossdomain.xml             # cross domain policies
|   |       favicon.ico                 # icon for bookmarks bar
|   |       humans.txt                  # contains information about the website (http://humanstxt.org/)
|   |       manifest.json               # application icons for Android mobile devices
|   |       README.md                   #
|   |       robots.txt                  # the robots exclusion protocol (http://www.robotstxt.org/)
|   |       service-worker.js           # support for building Progressive Web Applications (PWA) with Service Workers
|   |
|   +---environments                    # configuration variables for each environment
|   |       environment.e2e.prod.ts     # production environment configuration for e2e tests
|   |       environment.hmr.ts          # development with HMR (Hot Module Replacement) environment configuration
|   |       environment.prod.ts         # production environment configuration
|   |       environment.ts              # development environment configuration
|   |
|   +---styles                          # application-specific styles
|   |       styles.scss                 # imports all application styles as well as all external stylesheets
|   |       ...
|   |
|   |   custom-typings.d.ts             # add your own type definitions that can't be found in the registry in this file
|   |   index.html                      # the main HTML page that is served when someone visits this site
|   |   main.browser.ts                 # main bundle entry point, Angular bootstrapping
|   |   polyfills.browser.ts            # polyfills needed by old browsers if required. Should be loaded before the app
|   |   stark-app-config.json           # Stark configuration
|   \   stark-app-metadata.json         # Stark application metadata like: name, description, version...
|
|   .dockerignore                       # files and directories to be excluded by the Docker build
|   .gitignore                          # files and directories to be excluded by git
|   .prettierignore                     # files and directories to be excluded by prettier
|   .prettierrc.js                      # prettier configuration file
|   .stylelintrc                        # stylelint configuration file
|   .travis.yml                         # YAML file to customize the Travis build (https://travis-ci.com/)
|   angular.json                        # Angular configuration file
|   base.spec.ts                        # initializes the test environment
|   Dockerfile                          # the commands that will be executed by the Docker Build command
|   karma.conf.js                       # Karma configuration file
|   package.json                        #
|   protractor.conf.js                  # protractor configuration file
|   README.md                           # this document
|   tsconfig.app.json                   # typescript configuration for the application, extends tsconfig.json
|   tsconfig.e2e.json                   # typescript configuration for the e2e tests, extends tsconfig.json
|   tsconfig.json                       # typescript configuration, extends tsconfig.json from Stark-Build
|   tsconfig.spec.json                  # typescript configuration for the Karma tests, extends tsconfig.json
\   tslint.json                         # tslint configuration file
```

## Configuration

Most of the configuration files at the root of the starter either fully reuse or extend Stark's configuration files.
Most of the time you won't need to change these, but they allow you to customize things when needed.

## Getting Started

### System configuration

What you need to run this app:

-   `node` and `npm`
-   Ensure you're running the latest versions Node `v8.x.x`+ and NPM `5.8.x`+

> If you have `nvm` installed, which is highly recommended you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS.
> You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

### Global dependencies

Once you have those, you should install these globals with `npm install --global`:

-   Windows only: `npm install -g node-pre-gyp`

TODO review/complete; see #34

### Installing

First, clone the project:

```bash
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/NationalBankBelgium/stark.git
```

Then go to the starter folder (`cd starter`) and install all dependencies using: `npm install`.

TODO review/complete; see #34

### Running the app

After you have installed all dependencies you can now run the app.
Run `npm run server` to start a local (development) server using `webpack-dev-server` which will watch, build (in-memory), and reload for you.
The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

You may enable Hot Module Replacement (HMR) using:

```bash
npm run server:dev:hmr
```

You may also start the server in production mode using the following:

```bash
npm run build:prod
npm run server:prod
```

## Build commands

### Reference

Refer to the Stark developer guide: https://github.com/NationalBankBelgium/stark

### Build files

```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

### Hot Module Replacement (HMR) mode

```bash
npm run server:dev:hmr
```

### Watch mode

```bash
npm run watch
```

### Run unit tests

```bash
npm run test
```

### Watch and run tests

```bash
npm run watch:test
```

### Run end-to-end tests

```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update # cfr #35
# this will start a test server and launch Protractor
npm run e2e
```

### Continuous Integration (CI): run unit tests and e2e tests together

```bash
# this will test both your JIT and AoT builds
npm run ci
```

### Run Protractor's elementExplorer (for end-to-end)

```bash
npm run e2e:live
```

### Build Docker

```bash
npm run build:docker
```

For more details, refer to the deployment section below.

## Good to know

### AoT Don'ts

The following are some things that will make AoT compile fail.

-   Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
-   Don’t use default exports.
-   Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
-   Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
-   Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
-   @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

### Type definitions

When including 3rd party modules you also need to include the type definition for the module.
When you include a module that doesn't include TypeScript type definitions inside of the module you can include external type definitions with @types

```
npm install @types/node
npm install @types/lodash
```

If you can't find the type definition in the registry then you can make use of an ambient definition in the custom-typings.d.ts file.

For example:

```typescript
declare module "my-module" {
	export function doesSomething(value: string): string;
}
```

If you're prototyping and you will fix the types later you can also declare it as type any:

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from "lodash";
```

### External Stylesheets

TODO explain how stylesheets are loaded.

## Tools

### TypeScript-aware editors

We have good experience using these editors:

-   [Visual Studio Code](https://code.visualstudio.com/)
-   [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
-   [Webstorm](https://www.jetbrains.com/webstorm/download/)
-   [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
-   [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

### Visual Studio Code + Debugger for Chrome

> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the webpack development server on port `3000`.

## Deployment

### Docker

To run project you only need host machine with **operating system** with installed **git** (to clone this repo)
and [docker](https://www.docker.com/) and thats all - any other software is not needed
(other software like node.js etc. will be automatically downloaded and installed inside docker container during build step based on dockerfile).

#### Install docker

##### MacOS:

`brew install --cask docker`

And run docker by Mac bottom menu> launchpad > docker (on first run docker will ask you about password)

##### Ubuntu:

```
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker  # test:  shoud be ‘active’
```

And add your user to docker group (to avoid `sudo` before using `docker` command in future):

```
sudo usermod -aG docker $(whoami)
```

and logout and login again.

#### Build image

Because _node.js_ is big memory consumer you need 1-2GB RAM or virtual memory to build docker image.

Go to the main project folder. To build big (~280MB) image which has cached data and is able to **FAST** rebuild  
(this is good for testing or staging environment) type:

`docker build -t stark-starter .`

To build **SMALL** (~20MB) image without cache (so each rebuild will take the same amount of time as first build)
(this is good for production environment) type:

`docker build --squash="true" -t stark-starter .`

The **stark-starter** name used in above commands is only example image name.
To remove intermediate images created by docker on build process, type:

`docker rmi -f $(docker images -f "dangling=true" -q)`

#### Run image

To run created docker image on [localhost:8080](localhost:8080) type (parameter `-p 8080:80` is host:container port mapping)

`docker run --name stark-starter -p 8080:80 stark-starter &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).

#### Build and Run image using docker-compose

To create and run docker image on [localhost:8080](localhost:8080) as part of large project you may use **docker-compose**. Type

`docker-compose up &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).

#### Run image on sub-domain

If you want to run image as virtual-host on sub-domain you must setup [proxy](https://github.com/jwilder/nginx-proxy)
. You should install proxy and set sub-domain in this way:

```
docker pull jwilder/nginx-proxy:alpine
docker run -d -p 80:80 --name nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy:alpine
```

And in your `/etc/hosts` file (_nix) add line: `127.0.0.1 stark-starter.your-domain.com` or in yor hosting add
following DNS record (wildcard `_` is handy because when you add new sub-domain in future, you don't need to touch/add any DNS record)

```
Type: CNAME
Hostname: *.your-domain.com
Direct to: your-domain.com
TTL(sec): 43200
```

And now you are ready to run image on sub-domain with:

```
docker run -e VIRTUAL_HOST=stark-starter.your-domain.com --name stark-starter stark-starter &
```

#### Login into docker container

`docker exec -t -i stark-starter /bin/bash`

## Frequently asked questions

-   How do I start the app when I get `EACCES` and `EADDRINUSE` errors?
    -   The `EADDRINUSE` error means the port `3000` is currently being used and `EACCES` is lack of permission for webpack to build files to `./dist/`
-   Error: Cannot find module 'tapable'
    -   Remove `node_modules/` and run `npm cache clean` then `npm install`
-   How do I turn on Hot Module Replacement
    -   Run `npm run server:dev:hmr`
-   `RangeError: Maximum call stack size exceeded`
    -   This is a problem with minifying Angular and its recent JIT templates. If you set `mangle` to `false` then you should be good
-   Why is the size of my app larger in development?
    -   We are using inline source-maps and hot module replacement which will increase the bundle size.
-   If you're in China
    -   check out https://github.com/cnpm/cnpm
-   node-pre-gyp ERR in npm install (Windows)
    -   install Python x86 version between 2.5 and 3.0 on windows
    -   or try `--no-optional`
