export const starterStructure: string = `|
+---config
|   |
|   |   webpack-custom-config.dev.json  # webpack configuration for the development environment
|
+---src
|   |
|   +---app
|   |   |
|   |   +---foo	                        # smart component folder
|   |   |   |                           # create a folder for each component
|   |   |   |   foo.component.css       # styles for this smart component
|   |   |   |   foo.component.html      # template for this smart component
|   |   |   |   foo.component.spec.ts   # jasmine test  for this smart component
|   |   |   |   foo.component.ts        # configuration metadata for this smart component
|   |   |   |   foo.e2e.ts              # end-to-end test for this smart component
|   |   |   |   index.ts                # exports the smart component
|   |   |   |
|   |   |   app.component.css           # application base styles
|   |   |   app.component.html          # application template
|   |   |   app.component.spec.ts       # jasmine test for the app component
|   |   |   app.component.ts            # app root component and controller
|   |   |   app.e2e.ts                  # end-to-end test for the app class
|   |   |   app.module.ts               # bootstraps code of the application (configures Angular module, ...)
|   |   |   app.routes.ts               # routing configuration
|   |   |   app.services.ts             # exports the application state
|   |   |   index.ts                    # exports the app module
|   |   |   material-icons.config.ts    # helper functions for the Material Design icons
|   |   |   routes.config.ts            # helper functions for the routing
|   |   \\   translation.config.ts       # helper functions for the translations
|   |
|   +---assets                          # static assets (fonts, images, translations, ...)
|   |   |
|   |   +---fonts                       # application-specific fonts
|   |   |   \\
|   |   |
|   |   +---images                      # application-specific images
|   |   |   |
|   |   |   +---app-icons               # application icons for mobile devices
|   |   |   |   \\
|   |   |   |
|   |   |   +---touch                   # touch icons for mobile devices
|   |   |   |   \\
|   |   |   \\
|   |   |
|   |   +---mock-data                   #
|   |   |   \\
|   |   |
|   |   +---translations                # application-specific translations
|   |   |   |                           #
|   |   |   |   en.json                 # English
|   |   |   |   fr.json                 # French
|   |   |   \\   nl.json                 # Dutch
|   |   |
|   |   \\   README.md                   #
|   |
|   +---assets-base                     # static assets that will be copied to the root of the application
|   |   |                               #
|   |   |   browserconfig.xml           # application icons for Windows mobile devices
|   |   |   crossdomain.xml             # cross domain policies
|   |   |   favicon.ico                 # icon for bookmarks bar
|   |   |   humans.txt                  # contains information about the website (http://humanstxt.org/)
|   |   |   manifest.json               # application icons for Android mobile devices
|   |   |   README.md                   #
|   |   |   robots.txt                  # the robots exclusion protocol (http://www.robotstxt.org/)
|   |   \\   service-worker.js           # support for building Progressive Web Applications (PWA) with Service Workers
|   |
|   +---environments                    # configuration variables for each environment
|   |   |                               #
|   |   |   environment.e2e.prod.ts     # e2e tests configuration
|   |   |   environment.hmr.ts          # development with HMR (Hot Module Replacement) configuration
|   |   |   environment.prod.ts         # production configuration
|   |   |   environment.ts              # development configuration
|   |   \\   model.ts                    # interface defining the variables
|   |
|   +---styles                          # application-specific styles
|   |   \\
|   |
|   |   custom-typings.d.ts             # add your own type definitions that can't be found in the registry in this file
|   |   hmr.ts                          # Hot Module Replacement logic
|   |   index.html                      # the main HTML page that is served when someone visits this site
|   |   main.browser.ts                 # Angular bootstrapping
|   |   polyfills.browser.ts            # this file includes polyfills needed by Angular and should be loaded before the app
|   |   stark-app-config.json           # Stark configuration
|   \\   stark-app-metadata.json         # Application metadata like: name, description, version...
|
|   .dockerignore                       # files and directories to be excluded by the Docker build
|   .gitignore                          # files and directories to be excluded by git
|   .prettierignore                     # files and directories to be excluded by prettier
|   .prettierrc.js                      # prettier configuration file
|   .stylelintrc                        # stylelint configuration file
|   .travis.yml                         # YAML file to customize the Travis build (https://travis-ci.org/)
|   angular.json                        # Angular configuration file
|   base.spec.ts                        # Initializes the test environment
|   Dockerfile                          # the commands that will be executed by the Docker Build command
|   karma.conf.ci.js                    # Karma configuration file for Continuous Integration
|   karma.conf.js                       # Karma configuration file
|   package.json                        #
|   protractor.conf.js                  # protractor configuration file
|   README.md                           # this document
|   tsconfig.app.json                   # typescript configuration for the application, extends tsconfig.json
|   tsconfig.e2e.json                   # typescript configuration for the e2e tests, extends tsconfig.json
|   tsconfig.json                       # typescript configuration, extends stark-build/tsconfig.json
|   tsconfig.spec.json                  # typescript configuration for the Karma tests, extends tsconfig.json
|   tslint.json                         # tslint configuration file
\\   webpack.config.js                   # exports the webpack config file from config folder according to the current environment`;

export const stylesheetImport: string = `|
|   +---styles                          # application-specific styles
|   |   \
|   |
|   |   custom-typings.d.ts             # add your own type definitions that can'tbe found in the registry in this file
|   |   hmr.ts                          # Hot Module Replacement logic
|   |   index.html                      # the main HTML page that is served when someone visits this site
|   |   main.browser.ts                 # Angular bootstrapping
|   |   polyfills.browser.ts            # this file includes polyfills needed by Angular and should be loaded before the app
|   |   stark-app-config.json           # Stark configuration
|   \   stark-app-metadata.json         # Application metadata like: name, description, version...`;

export const stylesCss: string = `
@import "~basscss/css/basscss.css";
@import "theme";
@import "stark-styles.scss";
@import "../app/app.component.scss";
`;

export const starkStylesCss: string = `
/* Stark styles */
@import "~@nationalbankbelgium/stark-ui/assets/styles/header";

/* Stark components */
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo-theme";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-logo/components/app-logo.component";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-footer/components/app-footer.component";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-footer/components/app-footer-theme";
@import "~@nationalbankbelgium/stark-ui/src/modules/app-menu/components/app-menu-theme";


/* Stark session-ui pages */
@import "~@nationalbankbelgium/stark-ui/src/modules/session-ui/pages/login/login-page.component";
@import "~@nationalbankbelgium/stark-ui/src/modules/session-ui/pages/preloading/preloading-page.component";
`;
