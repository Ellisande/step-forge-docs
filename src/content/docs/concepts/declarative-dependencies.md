---
title: Declarative Dependencies
description: Learn about Step Forge's declarative approach to dependencies
---

Step Forge requires all steps to declare dependencies on scenario state before they can be used. This might seem like a lot of ceremony, but it has some great benefits.

### Problems with BDD

At a high level there are two really compelling reasons to use BDD as a test paradigm.

- BDD ties your plain language requirements directly to the executing tests. Ensuring that the requirements and behavior of the system are always perfectly in sync. As a bonus, this makes BDD a great way to communicate with non-technical stakeholders.
- BDD is a great way to create reusable steps that can be used to compose new scenarios.

Unfortunately for many developers, the dream of composable steps is usually shattered by the reality of BDD.

Reusable steps are hard to write without becoming overly generic or brittle. Even well written steps are often hard to reuse with confidence, as they depend on specific pieces of scenario state that are scattered throughout the step's code.

But what if you could write steps in isolation, but use them with confidence in your Gherkin scenarios? That's where declarative dependencies come in.

### Declarative Dependencies

In order to read any state from the scenario in Step Forge, you must explicitly declare what pieces of state you need, and which section the data will come from. Step Forge uses this information to automatically enforce values are present at runtime as well as provide compile time dependency checking.

This strikes a balance between freedom and safety, allowing you to write steps in isolation, but also ensure that they will be reusable in valid scenarios.

### Implicit Step Modifiers

Step Forge _also_ requires you to declare what pieces of state your step sets. However, this is done by analyzing the step's return value so there is no additional ceremony to remember. The combined knowledge of dependencies and return values allows Step Forge to enforce that all state is properly set at compile time.

### Enforcement

Step Forge enforces dependencies in a number of different ways.

- **Runtime Enforcement** - If a step declares a dependency on a piece of state, but the value is not present when the step is executed, the step will fail with a clear error message.
- **Compile Time Enforcement** - Calling the `step` function off a builder is type so that your step only has access to the parts of state that are declared as dependencies. This enforces at compile time that you cannot read from undeclared state.
- **Compile Time Editor Support** - When using the VS code plugin, you will get red squiggles under any steps that have dependencies that aren't satisfied by the other steps in the scenario.
- **Coming Soon: Build Time Enforcement** - If a step declares a dependency on a piece of state, but no previous step set's that value, the step will fail to build.
