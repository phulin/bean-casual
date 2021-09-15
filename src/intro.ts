import { availableAmount, cliExecute, runChoice, use, visitUrl } from "kolmafia";
import { $item, Clan, get, have } from "libram";

import { propertyManager } from "./global";
import { acquire, tryUse } from "./lib";

export function intro(): void {
  Clan.join("Bonus Adventures from Hell");

  // Sell pork gems
  visitUrl("tutorial.php?action=toot");
  tryUse(1, $item`letter from King Ralph XI`);
  tryUse(1, $item`pork elf goodies sack`);

  tryUse(1, $item`astral six-pack`);

  // Buy antique accordion
  acquire(1, $item`antique accordion`, 2500);

  // Initialize council.
  visitUrl("council.php");

  // All combat handled by our consult script (combat.ts).
  cliExecute("ccs bean-casual");

  // Mood handled in JS (mood.ts).
  cliExecute("mood apathetic");

  // Upgrade saber for fam wt
  if (have($item`Fourth of May Cosplay Saber`)) {
    visitUrl("main.php?action=may4");
    runChoice(4);
  }

  if (get("boomBoxSong") !== "Food Vibrations") {
    cliExecute("boombox food");
  }

  use(availableAmount($item`ten-leaf clover`), $item`ten-leaf clover`);
  propertyManager.set({
    cloverProtectActive: true,
    battleAction: "custom combat script",
    autoSatisfyWithMall: true,
    autoSatisfyWithNPCs: true,
    autoSatisfyWithCoinmasters: true,
    dontStopForCounters: true,
    maximizerFoldables: true,
    hpAutoRecoveryTarget: 0.95,
    hpAutoRecovery: 0.8,
    mpAutoRecoveryTarget: 0.1,
    mpAutoRecovery: 0.1,
  });
}
