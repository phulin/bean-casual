import {
  abort,
  cliExecute,
  fileToBuffer,
  myAscensions,
  myFullness,
  myInebriety,
  myLevel,
  myMeat,
  print,
  setProperty,
  visitUrl,
} from "kolmafia";
import { $familiars, $items, $skills, get, have } from "libram";

import { intro } from "./intro";
import { level } from "./level";
import { dailyDungeon } from "./quests/keys";
import { ores } from "./quests/level8";
import { aboo, bridge } from "./quests/level9";
import { airship } from "./quests/level10";
import { billiards, blackForest, shen } from "./quests/level11";
import { war } from "./quests/level12";

function stockUp(): void {
  if (parseInt(get("bcas_lastStockedUp") || "0", 10) < myAscensions()) {
    print("Stocking up!");
    for (const line of fileToBuffer("data/bean-casual/pulls.txt").split("\n")) {
      print(`acquire ${line}`);
      if (line.length === 0) continue;
      cliExecute(`acquire ${line}`);
    }
    setProperty("bcas_lastStockedUp", `${myAscensions()}`);
  }
}

const requiredFamiliars = $familiars`Exotic Parrot, Pocket Professor`;
const requiredItems = $items`Kramco Sausage-o-Matic™`;
const requiredSkills = $skills`Saucestorm`;
function checkRequirements() {
  let fail = false;
  for (const thing of [...requiredFamiliars, ...requiredItems, ...requiredSkills]) {
    if (!have(thing)) {
      fail = true;
      print(`You don't have ${thing}, which is required to run this script.`, "red");
    }
  }
  if (fail) throw "Missing required things to run script.";
}

export function main(): void {
  const dietScript = get<string>("bcas_diet");

  checkRequirements();

  if (myMeat() > 5000000) {
    if (get("bcas_autoClosetMeat", false)) {
      const closetAmount = myMeat() - 5 * 1000 * 1000;
      print(
        `You have more than 5M liquid meat! Putting ${closetAmount} in the closet automatically.`,
        "blue"
      );
      cliExecute(`closet put ${closetAmount} meat`);
    } else {
      throw (
        "You have more than 5M liquid meat! " +
        "Put it in the closet to avoid autoscend danger, or set bcas_autoClosetMeat to true and rerun."
      );
    }
  }

  intro();
  level();

  if (myLevel() < 13) abort("Something went wrong in leveling!");

  print("Refreshing council quests...");
  visitUrl("council.php");

  stockUp();

  airship();
  billiards();

  if (myInebriety() <= 5 && myFullness() <= 0) {
    if (dietScript === "") {
      abort('Set property "bcas_diet" with your diet script, or consume your diet and rerun.');
    }
    cliExecute(dietScript);
  }

  war();
  dailyDungeon();
  ores();
  bridge();
  aboo();
  blackForest();
  shen();

  setProperty("auto_abooclover", "true");
  setProperty("auto_interrupt", "false");

  cliExecute("autoscend");
}
