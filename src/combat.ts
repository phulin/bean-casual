import {
  choiceFollowsFight,
  haveEquipped,
  inMultiFight,
  print,
  runCombat,
  visitUrl,
} from "kolmafia";
import { $item, $skill, Macro as LibramMacro } from "libram";

import { canRunaway } from "./lib";

// multiFight() stolen from Aenimus: https://github.com/Aenimus/aen_cocoabo_farm/blob/master/scripts/aen_combat.ash.
// Thanks! Licensed under MIT license.
function multiFight() {
  while (inMultiFight()) runCombat();
  if (choiceFollowsFight()) visitUrl("choice.php");
}

export class Macro extends LibramMacro {
  submit(): string {
    print(`Submitting macro: ${this.components.join("; ")}`);
    return super.submit();
  }

  kill(): Macro {
    return this.skill($skill`Stuffed Mortar Shell`)
      .skill($skill`Saucestorm`)
      .skill($skill`Saucegeyser`)
      .repeat()
      .skill($skill`Saucestorm`)
      .repeat();
  }

  static kill(): Macro {
    return new Macro().kill();
  }

  runaway(): Macro {
    return this.step("runaway");
  }

  static runaway(): Macro {
    return new Macro().runaway();
  }

  runUnlessFree(): Macro {
    return this.if_(
      "monstername sausage goblin || monstername black crayon || monstername Witchess",
      Macro.kill()
    )
      .externalIf(canRunaway() || haveEquipped($item`Greatest American Pants`), "runaway")
      .kill();
  }

  static runUnlessFree(): Macro {
    return new Macro().runaway();
  }
}

export function main(): void {
  Macro.load().submit();
  multiFight();
}
