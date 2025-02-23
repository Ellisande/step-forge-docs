---
title: Setting Up Cucumber
description: Learn how to set up and configureCucumber for Step Forge.
---

## Setting Up Cucumber

### Install Cucumber

There is no need to install cucumber explicitly, it will be installed as a dependency when you install Step Forge.

### Cucumber Setup and Configuration

#### Create a `cucumber.mjs` file

There are lots of options here which you can read about in the [Cucumber configuration docs](https://github.com/cucumber/cucumber-js/blob/HEAD/docs/configuration.md). But here is a basic sample setup:

```js
const defaultProfile = {
  format: [
    process.env.CI || !process.stdout.isTTY ? "progress" : "progress-bar",
  ],
  parallel: 1,
  requireModule: ["ts-node/register"],
  require: ["./features/steps/**/*.ts", "./features/steps/*.ts"],
  strict: false,
};
export default defaultProfile;
```

- `format` this is the format of the output you want to see in the console. There are other formatters available, see the [Cucumber formatters page](https://github.com/cucumber/cucumber-js/blob/45245acd98da065ec2b18647f8835430774b4c9b/docs/formatters.md) for more information.
- `parallel` this is the number of parallel processes you want to run.
- `requireModule` this allows Cucumber to process TypeScript files.
- `require` this is the path to your step definitions.
- `strict` this is whether to fail the build if there are any pending steps.

### Create a `./features` directory

This is where you will create your feature files and define your steps. We recommend the following structure:

```
-> /features
 -> /steps
    -> world.ts
    -> steps.ts
    -> (... other step files)
 -> sample.feature
 -> (... other feature files)
```

- `world.ts` this is where you will define your states and do any global setup.
- `steps.ts` this is what we call the file for our examples, but it can be named anything you want.
- `(... other step files)` this is where you will define your other steps. You can break this out into multiple files if you want to.
- `sample.feature` this is what we call the file for our examples, but it can be named anything you want.
- `(... other feature files)` this is where you will define your other feature files.

### Create a `./features/steps/world.ts` file

This is where you will define your states and do any global setup. The most important part for Step Forge specifically is setting up your World object with the appropriate state.

Your World object is a class that is used to store the state of the currently executing scenario. It is what carries information between steps. Step Forge has some very specific requirements for how scenario state is setup in your World object. Here is the basic setup we'll use for our examples:

```ts
import { BasicWorld } from "@step-forge/step-forge";

export interface GivenState {
  valid: boolean;
}

export interface WhenState {
  valid: boolean;
}

export interface ThenState {}

export class World extends BasicWorld<GivenState, WhenState, ThenState> {}

setWorldConstructor(World);
```

- `BasicWorld` is a class that is provided by Step Forge that divides your state into three categories: `Given`, `When`, and `Then`.
- `GivenState` is the state for the `Given` steps. You can add any properties you want with any types that are relevant to your tests. `GivenState` can be read by all steps, but can only be written to by `Given` steps.
- `WhenState` is the state for the `When` steps. You can add any properties you want with any types that are relevant to your tests. `WhenState` can be read by `When` and `Then` steps, but can only be written to by `When` steps.
- `ThenState` is the state for the `Then` steps. You can add any properties you want with any types that are relevant to your tests. `ThenState` read or written only by `Then` steps.

  **Note**: `ThenState` is used mostly for assertions on complex state and is rarely used.

- `class World` this is your custom World class that you can

**Note:** GivenState, WhenState, and ThenState represent all values that any step can use across all of your tests. Step Forge handles narrowing this down for you in individual steps.

## Want to learn more?

If you want to dive deeper into the many configuration options available for Cucumber, check out the [Cucumber JS docs](https://github.com/cucumber/cucumber-js) on GitHub.
