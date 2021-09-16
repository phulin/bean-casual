import { print } from "kolmafia";
import { adventureMacro, have, Mood, Requirement } from "libram";

import { Macro } from "../combat";

export type Quest = {
  name: string;
  prepare?: () => void;
  steps: Step[];
  complete?: () => void;
};

export type Step = {
  name: string;
  dependencies: string[];
  familiarPriority?: Familiar[];
  mood?: () => Mood;
  requirement?: Requirement | (() => Requirement);
  turnsRemaining: () => number;
  prepare?: () => void;
  execute?: () => void;
  location?: Location;
  macro?: () => Macro;
};

function runStep(step: Step) {
  if (step.turnsRemaining() > 0) {
    print(`Executing step ${step.name}.`, "blue");
    while (step.turnsRemaining() > 0) {
      if (step.familiarPriority) {
        const familiar = step.familiarPriority.find((familiar) => have(familiar));
        if (!familiar)
          throw `Couldn't find familiar out of ${step.familiarPriority} for ${step.name}.`;
      }
      if (step.mood) step.mood().execute(step.turnsRemaining());
      if (step.requirement) {
        const requirement =
          typeof step.requirement === "function" ? step.requirement() : step.requirement;
        requirement.maximize();
      }
      if (step.prepare) step.prepare();
      if (step.execute) {
        step.execute();
      } else if (step.location) {
        adventureMacro(step.location, step.macro ? step.macro() : Macro.kill());
      } else {
        throw `No way to execute step ${step.name}.`;
      }
    }
  }
}

function runStepDependencies(dependencyMap: Map<Step, Step[]>, step: Step) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  for (const dependency of dependencyMap.get(step)!) {
    runStepDependencies(dependencyMap, dependency);
    runStep(dependency);
  }
}

export function runQuest(quest: Quest): void {
  print();
  print("===========================", "blue");
  print(`Executing quest ${quest.name}.`, "blue");
  print("===========================", "blue");
  print(
    `Already completed: ${quest.steps
      .filter((step) => step.turnsRemaining() === 0)
      .map((step) => step.name)
      .join(", ")}`
  );

  if (quest.prepare) quest.prepare();

  const nameMap = new Map(quest.steps.map((step) => [step.name, step]));
  const dependencyMap = new Map<Step, Step[]>();
  for (const step of quest.steps) {
    const dependencies = step.dependencies.map(
      (name) => [name, nameMap.get(name)] as [string, Step | undefined]
    );
    const unrecognized = dependencies.find(([, resolved]) => resolved === undefined);
    if (unrecognized) throw `Unrecognized step ${unrecognized[0]}`;
    dependencyMap.set(
      step,
      dependencies.map(([, resolved]) => resolved as Step)
    );
  }

  for (const step of quest.steps) {
    runStepDependencies(dependencyMap, step);
    runStep(step);
  }

  if (quest.complete) quest.complete();
}
