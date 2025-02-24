---
title: scenario state
description: Define scenario state
---

Step Forge breaks down overall scenario state into three distinct categories:

- Given state
- When state
- Then state

All three parts of state are immutable, typed independently, kept separate, and have distinct rules about when they can be accessed or modified. However, you control the typing of each part of state. Step Forge just handles the plumbing of state and enforcing the typing when using the parts of the state.

### Given state rules

- Given state can be accessed by any step in the scenario
- Given state can only be modified by `Given` steps

### When state rules

- When state can only be accessed by `When` and `Then` steps
- When state can only be modified by `When` steps

### Then state rules

- Then state can only be accessed by `Then` steps
- Then state can only be modified by `Then` steps

> **Note:** `Then` state is rarely used. Most `Then` steps will read from `When` state and then make an assertion.

## Setting up state

Scenario state is defined by your `World` class, which is how Cucumber handles state. Step Forge requires that your World class has separate given, when, and then states associated with it.

Step Forge provides a `BasicWorld` class that implements the state classes and provides some utilities to make it easier to work with the expected state. See the [setting up Cucumber](/docs/guides/setting-up-cucumber) guide for an end-to-end example.

```typescript file=features/steps/world.ts
import { BasicWorld } from "@step-forge/step-forge";

export interface GivenState {
  // define the type of your given state here
  // this should be a super-set of any states needed by your tests
}

export interface WhenState {
  // define the type of your when state here
  // this should be a super-set of any states needed by your tests
}

export interface ThenState {
  // define the type of your then state here
  // this should be a super-set of any states needed by your tests
}

export class World extends BasicWorld<GivenState, WhenState, ThenState> {}

setWorldConstructor(World);
```

## Modifying state

State can only be modified by the return value of a `step` function. Each step can only modify the state that matches to it's section.

```typescript file=features/steps/step.ts
givenBuilder<GivenState>()
  .statement("I have a valid user")
  .step(() => {
    // Merges this user object into the given state
    return {
      user: {
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
      },
    };
  });

whenBuilder<GivenState, WhenState>()
  .statement("I do something with the user")
  .step(() => {
    // Merges this transactionId into the when state
    return {
      transactionId: "456",
    };
  });
```

## Reading state

State scenario state can be accessed by allowed steps with the proper dependencies declared. See the [dependencies](/reference/dependencies) guide for more information.
