import { $familiars, $items, $location, clamp, Requirement } from "libram";

import { Macro } from "../combat";
import { propertyManager } from "../global";
import { questStep } from "../lib";
import { moodNoncombat } from "../mood";
import { Quest } from "./structure";

export const MosquitoQuest: Quest = {
  name: "Mosquito Quest",
  prepare: () => propertyManager.setChoices({ 502: 2, 505: 1 }),
  steps: [
    {
      name: "Burn Delay",
      dependencies: [],
      turnsRemaining: () => clamp(5 - $location`The Spooky Forest`.turnsSpent, 0, 5),
      familiarPriority: $familiars`Mini-Hipster, Artistic Goth Kid, Reagnimated Gnome`,
      requirement: new Requirement([], { forceEquip: $items`Kramco Sausage-o-Matic™` }),
      location: $location`The Spooky Forest`,
      macro: () => Macro.runUnlessFree(),
    },
    {
      name: "Mosquito",
      dependencies: ["Burn Delay"],
      turnsRemaining: () => clamp(1 - questStep("questL02Larva"), 0, 1),
      familiarPriority: $familiars`Reagnimated Gnome`,
      mood: moodNoncombat,
      requirement: new Requirement(["-Combat Rate"], {}),
      location: $location`The Spooky Forest`,
      macro: () => Macro.runUnlessFree(),
    },
  ],
};
