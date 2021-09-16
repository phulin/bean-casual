import {
  availableAmount,
  buy,
  chew,
  cliExecute,
  closetAmount,
  drink,
  eat,
  familiarWeight,
  haveEffect,
  haveSkill,
  itemAmount,
  mallPrice,
  myFamiliar,
  print,
  shopAmount,
  sweetSynthesis,
  takeCloset,
  takeShop,
  toEffect,
  use,
  useSkill,
  weightAdjustment,
} from "kolmafia";
import { $effect, $familiar, $skill, get, have, Mood } from "libram";
import { StringProperty } from "libram/dist/propertyTypes";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export function itemPriority(...items: Item[]): Item {
  if (items.length === 1) return items[0];
  else return itemAmount(items[0]) > 0 ? items[0] : itemPriority(...items.slice(1));
}

export function cheaper(...items: Item[]): Item {
  if (items.length === 1) return items[0];
  else return itemAmount(items[0]) > 0 ? items[0] : itemPriority(...items.slice(1));
}

const priceCaps: { [index: string]: number } = {
  "jar of fermented pickle juice": 75000,
  "Frosty's frosty mug": 45000,
  "extra-greasy slider": 45000,
  "Ol' Scratch's salad fork": 45000,
  "transdermal smoke patch": 7000,
  "voodoo snuff": 36000,
  "blood-drive sticker": 210000,
  "spice melange": 500000,
  "splendid martini": 10000,
  "stuffing fluffer": 25000,
  cornucopia: 30000,
  cashew: 9000,
};

export function acquire(qty: number, item: Item, maxPrice?: number): void {
  if (qty > 30) throw "bad get!";

  if (maxPrice === undefined) maxPrice = priceCaps[item.name];

  let remaining = Math.round(qty) - itemAmount(item);
  if (remaining <= 0) return;

  const getCloset = Math.min(remaining, closetAmount(item));
  if (!takeCloset(getCloset, item)) throw "failed to remove from closet";
  remaining -= getCloset;
  if (remaining <= 0) return;

  const getMall = Math.min(remaining, shopAmount(item));
  if (!takeShop(getMall, item)) throw "failed to remove from shop";
  remaining -= getMall;
  if (remaining <= 0) return;

  if (buy(remaining, item, maxPrice) < remaining) throw `Mall price too high for ${item.name}.`;
}

export function eatSafe(qty: number, item: Item): void {
  acquire(1, item);
  if (!eat(qty, item)) throw "Failed to eat safely";
}

export function drinkSafe(qty: number, item: Item): void {
  if (!new Mood().skill($skill`The Ode to Booze`).execute(qty * item.inebriety)) {
    throw "Failed to gain enough turns of Ode";
  }
  acquire(1, item);
  if (!drink(qty, item)) throw "Failed to drink safely";
}

export function chewSafe(qty: number, item: Item): void {
  acquire(1, item);
  if (!chew(qty, item)) throw "Failed to chew safely";
}

function propTrue(prop: string | boolean) {
  if (typeof prop === "boolean") {
    return prop as boolean;
  } else {
    return get(prop as string);
  }
}

export function useIfUnused(item: Item, prop: string | boolean, maxPrice: number): void {
  if (!propTrue(prop)) {
    if (mallPrice(item) <= maxPrice) {
      acquire(1, item, maxPrice);
      use(1, item);
    } else {
      print(`Skipping ${item.name}; too expensive (${mallPrice(item)} > ${maxPrice}).`);
    }
  }
}

export function totalAmount(item: Item): number {
  return shopAmount(item) + itemAmount(item);
}

export function myFamiliarWeight(): number {
  return familiarWeight(myFamiliar()) + weightAdjustment();
}

export function ensureEffect(ef: Effect, turns = 1): void {
  if (!tryEnsureEffect(ef, turns)) {
    throw `Failed to get effect ${ef.name}.`;
  }
}

export function tryEnsureEffect(ef: Effect, turns = 1): boolean {
  if (haveEffect(ef) < turns) {
    return cliExecute(ef.default) && haveEffect(ef) > 0;
  }
  return true;
}

export function tryEnsureSkill(sk: Skill): void {
  const ef = toEffect(sk);
  if (haveSkill(sk) && ef !== $effect`none` && haveEffect(ef) === 0) {
    useSkill(1, sk);
  }
}

export function trySynthesize(ef: Effect): void {
  if (haveEffect(ef) === 0 && haveSkill($skill`Sweet Synthesis`)) sweetSynthesis(ef);
}

export function shrug(ef: Effect): void {
  if (have(ef)) cliExecute(`shrug ${ef.name}`);
}

export function tryUse(quantity: number, it: Item): boolean {
  if (availableAmount(it) > 0) {
    return use(quantity, it);
  } else {
    return false;
  }
}

export function questStep(questName: StringProperty): number {
  const stringStep = get(questName);
  if (stringStep === "unstarted") return -1;
  else if (stringStep === "started") return 0;
  else if (stringStep === "finished") return 999;
  else {
    if (stringStep.substring(0, 4) !== "step") {
      throw "Quest state parsing error.";
    }
    return parseInt(stringStep.substring(4), 10);
  }
}

export function canRunaway(): boolean {
  const familiarOut =
    myFamiliar() === $familiar`Pair of Stomping Boots` ||
    (myFamiliar() === $familiar`Frumious Bandersnatch` && have($effect`Ode to Booze`));
  return familiarOut && get("_banderRunaways") < Math.floor(myFamiliarWeight() / 5);
}
