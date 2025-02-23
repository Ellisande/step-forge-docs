---
title: Defining Steps
description: Learn how to define steps for your feature file.
---

## Defining Steps

Let's implement steps for our simple feature file and break down the code.

```ts title="src/features/steps.ts"
import { givenBuilder, whenBuilder, thenBuilder } from "@step-forge/step-forge";
import { GivenState, WhenState, ThenState } from "./world";

givenBuilder<GivenState>()
  .statement("a valid step")
  .step(() => {
    return {
      valid: true,
    };
  });

whenBuilder<GivenState, WhenState>()
  .statement("I check for valid input")
  .step(() => {
    return {
      valid: true,
    };
  });

thenBuilder<GivenState, WhenState, ThenState>()
  .statement("the input is valid")
  .dependencies({ when: { valid: "required" } })
  .step(({ when: { valid } }) => {
    expect(valid).toBe(true);
  });
```

### Breaking Down the Code

#### Given Builder

- `givenBuilder` is used for defining given steps

> **Note:** In standard Cucumber the Given, When, and Then clauses are interchangeable but in Step Forge they are not. This is because Step Forge has rules and restrictions for each section.

- `statement` this is the wording that will match the step language in your feature file. It can have variables, see the references for more information.
- `step` this is the function that will be called when the step is matched. You can execute any code you want here, and what you return will be loaded into your `GivenState`. All builder types have access to reading from `GivenState`, but only `givenBuilder` has access to writing to it.

#### When Builder

- `whenBuilder` is used for defining when steps
- `statement` this is the wording that will match the step language in your feature file. It can have variables, see the references for more information.
- `step` this is the function that will be called when the step is matched. You can execute any code you want here, and what you return will be loaded into your `WhenState`. `WhenState` can only be set from `whenBuilder` but can be read by other `when` steps or `then` steps.

#### Then Builder

- `thenBuilder` is used for defining then steps
- `statement` this is the wording that will match the step language in your feature file. It can have variables, see the references for more information.
- `dependencies` to use state from other steps you have to declare the pieces you need in the `dependencies` object.
- `step` this is the function that will be called when the step is matched. You can execute any code you want here, and what you return will be loaded into your `ThenState`. `ThenState` can only be set from `thenBuilder` but can be read by other `then` steps.

## How It Works

When we run our tests using Cucumber it will walk through each step of the feature file sequentially. It will then match that step language to one of the steps we've defined in our step files.

For example, let's say we just started running our tests from the feature file we created in the [previous section](./write-a-feature) and we're on the very first step:

```gherkin title="features/sample.feature"
Feature: A simple feature

    Scenario: A simple scenario
    ->  Given a valid step
        When I check for valid input
        Then the input is valid
```

Cucumber will match the `Given a valid step` to the `givenBuilder` we created in our step file.

```ts title="src/features/steps.ts"
givenBuilder<GivenState>()
  .statement("a valid step")
  .step(() => {
    return {
      valid: true,
    };
  });
```

After it executes the step we'll have the following `GivenState`:

```ts
const world: World = {
  given: {
    valid: true,
  },
};
```

Cucumber will then continue to the next step in the feature file and execute the `WhenBuilder` step.

```ts title="src/features/steps.ts"
whenBuilder<GivenState, WhenState>()
  .statement("I check for valid input")
  .step(() => {
    return {
      valid: true,
    };
  });
```

After it executes the step we'll have the following scenario state:

```ts
const world: World = {
  given: {
    valid: true,
  },
  when: {
    valid: true,
  },
};
```

Cucumber will then continue to the next step in the feature file and execute the `ThenBuilder` step.

```ts title="src/features/steps.ts"
thenBuilder<GivenState, WhenState, ThenState>()
  .statement("the input is valid")
  .dependencies({ when: { valid: "required" } })
  .step(({ when: { valid } }) => {
    expect(valid).toBe(true);
  });
```

There are two new things happening here:

1. We're using the `dependencies` object to tell Step Forge that the `ThenBuilder` step depends on the `WhenBuilder` step.

In order to access scenario state from a `step` function you must declare the pieces you need in the `dependencies` object.

2. We're using the `step` function to read the `valid` property from the `WhenState`.

If you try to read the valid property without declaring it in the `dependencies` object you'll get an error.

Since our `Then` step doesn't return anything, scenario state does not change, and as long as `valid` is indeed true, or false, our test will pass.

## Next Steps

Now that we've the basics of how Step Forge works, dive deeper into the [Concepts](/docs/state-and-world) section or directly to the [References](/docs/reference/builder-apis) to learn more about the different builder types and how to use them.
