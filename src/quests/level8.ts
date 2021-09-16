import { canAdv } from "canadv.ash";
import { retrieveItem, visitUrl } from "kolmafia";
import { $item, $location, clamp, get, maximizeCached } from "libram";
import { questStep } from "../lib";

import { Quest } from "./structure";

function ores(): void {
  if (!canAdv($location`Lair of the Ninja Snowmen`)) {
    visitUrl("place.php?whichplace=mclargehuge&action=trappercabin");
    retrieveItem(3, Item.get(get("trapperOre")));
    retrieveItem(3, $item`goat cheese`);
    visitUrl("place.php?whichplace=mclargehuge&action=trappercabin");
  }
}

export const TrapperQuest: Quest = {
  name: "Trapper Quest",
  prepare: () => {
    ores();
    retrieveItem($item`ninja rope`);
    retrieveItem($item`ninja crampons`);
    retrieveItem($item`ninja carabiner`);
    maximizeCached(["Cold Resistance"]);
    visitUrl("place.php?whichplace=mclargehuge&action=cloudypeak");
  },
  steps: [
    {
      name: "Mist-Shrouded Peak",
      dependencies: [],
      turnsRemaining: () => clamp(5 - questStep("questL08Trapper"), 0, 5),
      location: $location`Mist-Shrouded Peak`,
    },
  ],
  complete: () => visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"),
};
