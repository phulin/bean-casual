import { adv1, availableAmount, retrieveItem, use, visitUrl } from "kolmafia";
import { $item, $items, $location, adventureMacro, get, maximizeCached, set, sum } from "libram";

import { Macro } from "../combat";
import { propertyManager } from "../global";
import { acquire, questStep } from "../lib";

export function chasmBridge(): void {
  if (get("chasmBridgeProgress") < 30) {
    const count = (34 - get("chasmBridgeProgress")) / 5;
    acquire(count, $item`smut orc keepsake box`, 20000);
    use(count, $item`smut orc keepsake box`);
    visitUrl(`place.php?whichplace=orc_chasm&action=bridge${get("chasmBridgeProgress")}`);
  }
}

export function abooPeak(): void {
  const theoreticalProgress = () =>
    get("booPeakProgress") - 30 * availableAmount($item`A-Boo clue`);
  for (let i = 0; i < 10 && theoreticalProgress() > 0; i++) {
    // for blasts through intro adventure here...
    retrieveItem($item`ten-leaf clover`);
    set("cloverProtectActive", false);
    adv1($location`A-Boo Peak`, -1, "");
    set("cloverProtectActive", true);
  }

  while (get("booPeakProgress") > 0 && availableAmount($item`A-Boo clue`) > 0) {
    maximizeCached(["0.1 HP", "Spooky Resistance", "Cold Resistance"]);
    use($item`A-Boo clue`);
    adventureMacro($location`A-Boo Peak`, Macro.abort());
  }
}

export function twinPeak(): void {
  propertyManager.setChoices({
    604: 1, //welcome NC to twin peak step 1 = "continue"
    605: 1, //welcome NC to twin peak step 2 = "everything goes black"
    607: 1, //finish stench / room 237
    608: 1, //finish food drop / pantry
    609: 1, //do jar of oil / sound of music... goto 616
    616: 1, //finish jar of oil / sound of music
    610: 1, //do init / "who's that" / "to catch a killer"... goto 1056
    1056: 1, //finish init / "now it's dark"
    618: 2, //burn this hotel pity NC to skip the zone if you spent over 50 adventures there.
  });

  const progress = get("twinPeakProgress");
  const stench = !!(progress & 1);
  const item = !!(progress & 2);
  const jar = !!(progress & 4);
  const init = !!(progress & 8);
  if (get("twinPeakProgress") === 0) {
    retrieveItem(
      sum([stench, item, jar, init], (b) => (b ? 1 : 0)),
      $item`rusty hedge trimmers`
    );
  }

  if (!stench) {
    maximizeCached(["Stench Resistance"]);
    propertyManager.setChoices({ 606: 1 });
    use($item`rusty hedge trimmers`);
  }

  if (!item) {
    maximizeCached(["Item Drop"]);
    propertyManager.setChoices({ 606: 2 });
    use($item`rusty hedge trimmers`);
  }
  if (!jar) {
    retrieveItem($item`jar of oil`);
    propertyManager.setChoices({ 606: 3 });
    use($item`rusty hedge trimmers`);
  }
  if (!init) {
    maximizeCached(["Initiative"], { preventEquip: $items`Helps-You-Sleep` });
    propertyManager.setChoices({ 606: 4 });
    use($item`rusty hedge trimmers`);
  }

  if (questStep("questL09Topping") === 3) {
    visitUrl("place.php?whichplace=highlands&action=highlands_dude");
  }
}
