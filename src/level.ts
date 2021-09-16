import {
  buy,
  cliExecute,
  handlingChoice,
  mallPrice,
  myBasestat,
  myLevel,
  myMaxhp,
  myPrimestat,
  print,
  restoreHp,
  restoreMp,
  runChoice,
  runCombat,
  totalFreeRests,
  use,
  useFamiliar,
  visitUrl,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $items,
  $location,
  $skill,
  $stat,
  adventureMacro,
  get,
  have,
  maximizeCached,
} from "libram";
import { Macro } from "./combat";
import { propertyManager } from "./global";

import { intro } from "./intro";
import { acquire, setChoice, tryEnsureEffect } from "./lib";
import { moodLevel } from "./mood";

function leaflet(): void {
  if (!get("leafletCompleted") && myLevel() >= 9) {
    visitUrl("council.php");
    cliExecute("leaflet");
  }
}

export function level(useResources = true): void {
  if (myLevel() >= 13) return;

  // Put on some basic gear.
  maximizeCached(["MP"]);

  moodLevel().execute();

  // Daycare
  if (get("_daycareGymScavenges") === 0) {
    // Free scavenge.
    visitUrl("choice.php?whichchoice=1336&option=2");
  }

  // Bastille first.
  if (get("_bastilleGames") === 0) {
    if (have($item`Bastille Battalion control rig`)) {
      use(1, $item`Bastille Battalion control rig loaner voucher`);
    }
    cliExecute(`bastille ${myPrimestat() === $stat`Mysticality` ? "myst" : myPrimestat()}`);
  }

  // Chateau rests.
  if (get("chateauAvailable")) {
    buy(1, $item`ceiling fan`);
    if (myPrimestat() === $stat`Muscle`) {
      buy(1, $item`electric muscle stimulator`);
    } else if (myPrimestat() === $stat`Mysticality`) {
      buy(1, $item`foreign language tapes`);
    } else if (myPrimestat() === $stat`Moxie`) {
      buy(1, $item`bowl of potpourri`);
    }
    // Chateau rest
    while (get("timesRested") < totalFreeRests()) {
      visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
    }
  }

  cliExecute("breakfast");

  // LOV Tunnel
  if (get("loveTunnelAvailable") && !get("_loveTunnelUsed") && useResources) {
    useFamiliar($familiar`Hovering Sombrero`);
    const macro = Macro.if_(
      "monstername LOV Enforcer",
      Macro.while_("!pastround 20 && !hpbelow 200", Macro.attack().repeat()).kill()
    )
      .if_("monstername LOV Engineer", Macro.skill($skill`Saucegeyser`).repeat())
      .kill();

    propertyManager.setChoices({
      1222: 1, // Entrance
      1223: 1, // Fight LOV Enforcer
      // Eardigan, Epaulettes, Earrings
      1224: myPrimestat() === $stat`Muscle` ? 1 : myPrimestat() === $stat`Mysticality` ? 2 : 3,
      1225: 1, // Fight LOV Engineer
      1226: 2, // Open Heart Surgery
      1227: 1, // Fight LOV Equivocator
      1228: 3, // Take chocolate
    });

    adventureMacro($location`The Tunnel of L.O.V.E.`, macro);
    if (handlingChoice()) throw "Did not get all the way through LOV.";
    visitUrl("choice.php");
    if (handlingChoice()) throw "Did not get all the way through LOV.";
  }

  if (have($familiar`God Lobster`) && get("_godLobsterFights") < 3) {
    useFamiliar($familiar`God Lobster`);
    const useGg = have($skill`Giant Growth`) && mallPrice($item`green mana`) < 8000;
    if (useGg && !have($effect`Giant Growth`)) acquire(1, $item`green mana`, 8000);

    while (get("_godLobsterFights") < 3) {
      // Get stats from the fight.
      propertyManager.setChoices({ 1310: 3 });
      maximizeCached(["Mainstat", "4 Experience"], { forceEquip: $items`makeshift garbage shirt` });
      restoreHp(myMaxhp());

      Macro.externalIf(useGg && !have($effect`Giant Growth`), Macro.skill($skill`Giant Growth`))
        .kill()
        .save();
      visitUrl("main.php?fightgodlobster=1");
      runCombat();
      visitUrl("choice.php");
      if (handlingChoice()) runChoice(3);
    }
  }

  leaflet();

  if (
    get("_sausageFights") === 0 &&
    have($familiar`Pocket Professor`) &&
    have($item`Kramco Sausage-o-Matic™`)
  ) {
    useFamiliar($familiar`Pocket Professor`);
    maximizeCached(
      ["Mainstat", "4 Experience", "30 Mainstat Experience Percent", "30 Familiar Weight"],
      {
        forceEquip: $items`makeshift garbage shirt, Pocket Professor memory chip`,
      }
    );
    moodLevel().execute();
    restoreMp(100);
    restoreHp(myMaxhp());

    tryEnsureEffect($effect`Oiled, Slick`) || tryEnsureEffect($effect`Oiled-Up`);
    adventureMacro(
      $location`The Outskirts of Cobb's Knob`,
      Macro.if_("!monstername sausage goblin", Macro.abort())
        .skill($skill`lecture on relativity`)
        .kill()
    );
  }

  while (get("_neverendingPartyFreeTurns") < 10) {
    leaflet();
    propertyManager.setChoices({ 1324: 5 });
    useFamiliar($familiar`Hovering Sombrero`);
    maximizeCached(["Mainstat", "4 Experience"], { forceEquip: $items`makeshift garbage shirt` });
    moodLevel().execute();
    restoreMp(100);
    restoreHp(myMaxhp());

    adventureMacro($location`The Neverending Party`, Macro.kill());
  }

  visitUrl("council.php");

  print("");
  print("Done leveling.", "blue");
  print(`Reached mainstat ${myBasestat(myPrimestat())}.`);
  print(`Reached level ${myLevel()}.`);
}

export function main(): void {
  intro();
  level(false);
}
