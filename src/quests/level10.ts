import { familiarWeight, use, useFamiliar, weightAdjustment } from "kolmafia";
import {
  $familiar,
  $item,
  $location,
  $skill,
  adventureMacro,
  get,
  have,
  maximizeCached,
  Mood,
  set,
} from "libram";

import { Macro } from "../combat";
import { questStep } from "../lib";
import { addFamiliarWeight, moodNoncombat } from "../mood";

export function airship(): void {
  if (questStep("questL10Garbage") < 7) {
    if (questStep("questL10Garbage") < 1) use(1, $item`enchanted bean`);

    const freeRunFamiliar = have($familiar`Frumious Bandersnatch`)
      ? $familiar`Frumious Bandersnatch`
      : $familiar`Pair of Stomping Boots`;
    if (!get<boolean>("_bcas_banderRunawaysUsed") && have(freeRunFamiliar)) {
      useFamiliar(freeRunFamiliar);
      addFamiliarWeight(moodNoncombat()).execute();
      maximizeCached(["Familiar Weight", "-Combat Rate"]);
      const myFamiliarWeight = familiarWeight(freeRunFamiliar) + weightAdjustment();

      while (
        questStep("questL10Garbage") < 7 &&
        get("_banderRunaways") < Math.floor(myFamiliarWeight / 5) &&
        (freeRunFamiliar !== $familiar`Frumious Bandersnatch` ||
          new Mood().skill($skill`The Ode to Booze`).execute())
      ) {
        addFamiliarWeight(moodNoncombat()).execute();
        adventureMacro($location`The Penultimate Fantasy Airship`, Macro.runaway());
      }

      set("_bcas_banderRunawaysUsed", true);
    }
  }
}
