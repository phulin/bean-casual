import { canAdv } from "canadv.ash";
import {
  adv1,
  availableAmount,
  myInebriety,
  numericModifier,
  retrieveItem,
  use,
  useFamiliar,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $familiars,
  $item,
  $items,
  $location,
  $skill,
  adventureMacro,
  get,
  have,
  maximizeCached,
} from "libram";

import { Macro } from "../combat";
import { propertyManager } from "../global";
import { drinkSafe, ensureEffect, questStep } from "../lib";
import { moodBaseline, moodNoncombat } from "../mood";

export function billiards(): void {
  if (!canAdv($location`The Haunted Kitchen`)) {
    use(1, $item`telegram from Lady Spookyraven`);
  }

  while (availableAmount($item`Spookyraven billiards room key`) === 0) {
    useFamiliar(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $familiars`Mini-Hipster, Artistic Goth Kid, Exotic Parrot`.find((familiar) => have(familiar))!
    );
    moodBaseline().execute(Math.ceil((21 - get("manorDrawerCount")) / 4));
    maximizeCached(["Hot Resistance 9 Min", "Stench Resistance 9 Min"], {
      forceEquip: $items`Kramco Sausage-o-Matic™`,
    });
    adventureMacro($location`The Haunted Kitchen`, Macro.skill($skill`Saucestorm`).repeat());
  }

  while (!have($item`[7302]Spookyraven library key`)) {
    while (myInebriety() < 5 && availableAmount($item`astral pilsner`) > 0) {
      drinkSafe(1, $item`astral pilsner`);
    }

    ensureEffect($effect`Chalky Hand`);

    if (numericModifier("Pool Skill") < 18) {
      use($item`sugar sphere`);
      if (numericModifier("Pool Skill") < 18) {
        throw "Couldn't get enough pool skill.";
      }
    }

    propertyManager.setChoices({
      875: 1,
      1436: 2, // Maps
    });

    useFamiliar($familiar`Disgeist`);
    moodNoncombat().execute(10 - $location`The Haunted Billiards Room`.turnsSpent);
    maximizeCached(["-Combat Rate"]);
    adventureMacro($location`The Haunted Billiards Room`, Macro.kill());
  }
}

export function blackForest(): void {
  while (questStep("questL11Black") < 2) {
    propertyManager.setChoices({ 923: 1, 924: 1 }); // Fight blackberry bush
    useFamiliar($familiar`Reassembled Blackbird`);
    moodBaseline().execute();
    maximizeCached(["0.1 Combat Rate 5 min"], { forceEquip: $items`blackberry galoshes` });
    adventureMacro($location`The Black Forest`, Macro.kill());
  }

  if (questStep("questL11Black") < 3) {
    retrieveItem($item`forged identification documents`);
    adv1($location`The Shore, Inc. Travel Agency`, -1, "");
  }
}

export function shen(): void {
  if (questStep("questL11Shen") < 1) {
    maximizeCached([]);
    adventureMacro($location`The Copperhead Club`, Macro.runUnlessFree());
  }
}
