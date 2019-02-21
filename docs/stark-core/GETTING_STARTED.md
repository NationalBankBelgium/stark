# Getting started

The recommended way to get started with **Stark** is to download the [starter](../../starter) and run `npm install`.

## <a name="styling"></a>Styling

Stark-Core comes with the basic CSS styles and the Stark logo to display a basic animation during app initialization. These are provided under the `assets` folder of the package.

You must include those assets in your `angular.json` so that they are copied to your application `assets` folder and the initialization animations are displayed correctly:

```text
"projects": {
    ...
    "your-app": {
        ...
        "architect": {
            ...
            "build": {
                "options": {
                    "styles": [
                        "node_modules/@nationalbankbelgium/stark-core/assets/css/pre-load-style.css",
                        ...
                    ],
                }
                ...
            },
            ...
        }
    }
}
```

**IMPORTANT:** This should be done always. As mentioned above, these are used by Stark-Core internally when the application initializes.

## <a name="assets"></a>Assets

### Base assets

Stark-Core provides also some assets that are needed for any Stark based application. Therefore you must include those assets in your `angular.json` so that they are copied to
your application `assets` folder and the Stark-Core styles are applied correctly:

```text
"projects": {
    ...
    "your-app": {
        ...
        "architect": {
            ...
            "build": {
                "options": {
                    "assets": [
                        {
                            "glob": "**/*",
                            "input": "node_modules/@nationalbankbelgium/stark-core/assets/",
                            "output": "assets/stark-core"
                        },
                        ...
                    ],
                    ...
                }
            },
            ...
        }
    }
}
```

**IMPORTANT:** This should be done always. As mentioned above, these are used by Stark-Core internally when the application initializes. In case you want to copy just certain
assets from Stark-Core, make sure that you copy them following this structure in your application `assets` folder:

```text
|
+---yourApp
|   +---assets
|   |   +---stark-core  // assets from Stark-Core should be available at this location
|   ...
```

This will ensure that your application `assets` folder will contain only the assets that are actually used in your app.
