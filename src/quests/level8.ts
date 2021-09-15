import { canAdv } from "canadv.ash";
import { retrieveItem, visitUrl } from "kolmafia";
import { $item, $location, get } from "libram";

export function ores(): void {
  if (!canAdv($location`Lair of the Ninja Snowmen`)) {
    visitUrl("place.php?whichplace=mclargehuge&action=trappercabin");
    retrieveItem(3, Item.get(get("trapperOre")));
    retrieveItem(3, $item`goat cheese`);
    visitUrl("place.php?whichplace=mclargehuge&action=trappercabin");
  }
}
