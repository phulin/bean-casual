import {
  availableAmount,
  create,
  mallPrice,
  retrieveItem,
  runCombat,
  use,
  useFamiliar,
  visitUrl,
} from "kolmafia";
import { $familiar, $item, $location, adventureMacro, get, maximizeCached } from "libram";

import { Macro } from "../combat";
import { acquire, clamp } from "../lib";
import { moodBaseline, moodNoncombat } from "../mood";
import { propertyManager } from "../global";

export function ensureFluffers(flufferCount: number): void {
  while (availableAmount($item`stuffing fluffer`) < flufferCount) {
    const neededFluffers = flufferCount - availableAmount($item`stuffing fluffer`);
    const stuffingFlufferSources: [Item, number][] = [
      [$item`cashew`, 3],
      [$item`stuffing fluffer`, 1],
      [$item`cornucopia`, (1 / 3.5) * 3],
    ];
    stuffingFlufferSources.sort(
      ([item1, mult1], [item2, mult2]) => mallPrice(item1) * mult1 - mallPrice(item2) * mult2
    );
    const [stuffingFlufferSource, sourceMultiplier] = stuffingFlufferSources[0];

    const neededOfSource = Math.ceil(neededFluffers * sourceMultiplier);
    acquire(neededOfSource, stuffingFlufferSource);
    if (stuffingFlufferSource === $item`cornucopia`) {
      use(neededOfSource, $item`cornucopia`);
    }
    if (stuffingFlufferSource !== $item`stuffing fluffer`) {
      create(
        clamp(Math.floor(availableAmount($item`cashew`) / 3), 0, neededFluffers),
        $item`stuffing fluffer`
      );
    }
  }
}

export function war(): void {
  retrieveItem(1, $item`skeletal skiff`);
  retrieveItem(1, $item`beer helmet`);
  retrieveItem(1, $item`distressed denim pants`);
  retrieveItem(1, $item`bejeweled pledge pin`);

  while (get("warProgress") === "unstarted") {
    propertyManager.setChoices({
      142: 3,
      1433: 3, // Maps
    });
    useFamiliar($familiar`Disgeist`);
    moodNoncombat().execute();
    maximizeCached(["-Combat Rate", "outfit Frat Warrior Fatigues"]);
    adventureMacro($location`Hippy Camp`, Macro.runUnlessFree());
  }

  if (get("hippiesDefeated") < 1000) {
    const count = clamp((1000 - get("hippiesDefeated")) / 46, 0, 24);

    ensureFluffers(count);
    use(count, $item`stuffing fluffer`);
    while (get("hippiesDefeated") < 1000) {
      ensureFluffers(1);
      use(1, $item`stuffing fluffer`);
    }
  }

  if (get("warProgress") !== "finished") {
    moodBaseline().execute();
    maximizeCached(["outfit Frat Warrior Fatigues"]);
    Macro.kill().save();
    visitUrl("bigisland.php?place=camp&whichcamp=1");
    visitUrl("bigisland.php?action=bossfight");
    runCombat();
  }
}
