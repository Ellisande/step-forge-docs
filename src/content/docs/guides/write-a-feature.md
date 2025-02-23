---
title: Write a Simple Feature
description: Learn how to write a simple feature file for Step Forge.
---

## Writing a Feature

All Step Forge tests start from a feature file written in [Gherkin](https://cucumber.io/docs/gherkin/). Here is an example of a simple feature file we'll use to help you get started:

```gherkin title="features/sample.feature"
Feature: A simple feature

    Scenario: A simple scenario
        Given a valid step
        When I check for valid input
        Then the input is valid
```

### Feature File Breakdown

- `Feature`: The name of the feature. This is generally high level functionality like "Users can update their information"
- `Scenario`: A scenario is a collection of steps that represent a single behavior within the feature. Things like "User can update their name" or "User can update their address".
- `Given`: The scenario steps that set up state before the main action. In standard tests this would be all the code you write before you call the function you are testing.
- `When`: These are the scenario steps that are the main action you are testing. Best practice is to only have one `When` step per scenario.
- `Then`: These are the steps that assert that the When step(s) behaved correctly. In standard tests this would be the assertions you write after you call the function you are testing.

### Want to learn more?

Check out the [Gherkin Syntax](https://cucumber.io/docs/gherkin/) page for more information on how to write Gherkin features.
