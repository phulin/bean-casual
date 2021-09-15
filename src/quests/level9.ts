import { adv1, availableAmount, retrieveItem, use, visitUrl } from "kolmafia";
import { $item, $location, adventureMacro, get, maximizeCached, set } from "libram";

import { Macro } from "../combat";
import { acquire } from "../lib";

export function bridge(): void {
  if (get("chasmBridgeProgress") < 30) {
    const count = (34 - get("chasmBridgeProgress")) / 5;
    acquire(count, $item`smut orc keepsake box`, 20000);
    use(count, $item`smut orc keepsake box`);
    visitUrl(`place.php?whichplace=orc_chasm&action=bridge${get("chasmBridgeProgress")}`);
  }
}

export function aboo(): void {
  let theoreticalProgress = get("booPeakProgress") - 30 * availableAmount($item`A-Boo clue`);
  for (let i = 0; i < 10 && theoreticalProgress > 0; i++) {
    // for blasts through intro adventure here...
    retrieveItem(1, $item`ten-leaf clover`);
    set("cloverProtectActive", false);
    adv1($location`A-Boo Peak`, -1, "");
    set("cloverProtectActive", true);
    theoreticalProgress = get("booPeakProgress") - 30 * availableAmount($item`A-Boo clue`);
  }

  while (get("booPeakProgress") > 0 && availableAmount($item`A-Boo clue`) > 0) {
    maximizeCached(["0.1 HP", "Spooky Resistance", "Cold Resistance"]);
    use($item`A-Boo clue`);
    adventureMacro($location`A-Boo Peak`, Macro.abort());
  }
}
