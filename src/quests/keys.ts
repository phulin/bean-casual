import { availableAmount } from "kolmafia";
import { $item, $items, $location, adventureMacro, get, maximizeCached } from "libram";
import { Macro } from "../combat";
import { acquire, setChoice } from "../lib";
import { moodBaseline } from "../mood";

export function dailyDungeon(): void {
  while (availableAmount($item`fat loot token`) < 2 && !get("dailyDungeonDone")) {
    if (availableAmount($item`fat loot token`) === 0) {
      acquire(1, $item`daily dungeon malware`, 40000);
    }
    setChoice(690, 2); // Chest 5
    setChoice(691, 2); // Chest 10
    setChoice(692, 11); // Lockpicks
    setChoice(693, 2); // Eleven-foot pole
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
