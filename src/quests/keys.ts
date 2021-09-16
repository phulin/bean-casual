import { availableAmount, cliExecute, restoreMp, useSkill } from "kolmafia";
import {
  $item,
  $items,
  $location,
  $skill,
  adventureMacro,
  get,
  have,
  maximizeCached,
  sum,
} from "libram";

import { Macro } from "../combat";
import { propertyManager } from "../global";
import { acquire } from "../lib";
import { moodBaseline } from "../mood";

function keyCount() {
  return sum($items`fat loot token, Boris's key, Jarlsberg's key, Sneaky Pete's key`, (item) =>
    availableAmount(item)
  );
}

export function heroKeys(): void {
  if (have($item`Deck of Every Card`) && !get("_deckCardsSeen").includes("Tower")) {
    cliExecute("play Tower");
  }

  if (have($skill`Lock Picking`) && !get("lockPicked")) {
    propertyManager.setChoices({
      1414: !have($item`Boris's key`) ? 1 : !have($item`Jarlsberg's key`) ? 2 : 3,
    });
    restoreMp(5);
    useSkill($skill`Lock Picking`);
  }

  while (keyCount() < 3 && !get("dailyDungeonDone")) {
    if (keyCount() <= 1) {
      acquire(1, $item`daily dungeon malware`, 40000);
    }

    propertyManager.setChoices({
      690: 2, // Chest 5
      691: 2, // Chest 10
      692: 11, // Lockpicks
      693: 2, // Eleven-foot pole
    });

    moodBaseline();
    maximizeCached([], { forceEquip: $items`ring of Detect Boring Doors` });
    adventureMacro(
      $location`The Daily Dungeon`,
      Macro.externalIf(
        !get("_dailyDungeonMalwareUsed"),
        Macro.tryItem($item`daily dungeon malware`)
      ).kill()
    );
  }
}
