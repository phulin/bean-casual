import { cliExecute, equip, getClanRumpus, myPrimestat, useSkill } from "kolmafia";
import { $effect, $effects, $item, $skill, $stat, get, have, Mood, Witchess } from "libram";

Mood.setDefaultOptions({
  songSlots: [
    $effects`The Sonata of Sneakiness, Carlweather's Cantata of Confrontation`,
    $effects`Fat Leon's Phat Loot Lyric`,
    $effects`Chorale of Companionship`,
    $effects`Ode to Booze, Ur-Kel's Aria of Annoyance`,
  ],
  reserveMp: 100,
});

export function moodBaseline(): Mood {
  const mood = new Mood();

  // Combat.
  mood.skill($skill`Carol of the Hells`);

  // Elemental res.
  mood.skill($skill`Elemental Saucesphere`);
  mood.skill($skill`Astral Shell`);

  // Misc.
  mood.skill($skill`Fat Leon's Phat Loot Lyric`);
  mood.skill($skill`Singer's Faithful Ocelot`);
  mood.skill($skill`Blood Bond`);
  mood.skill($skill`Empathy of the Newt`);
  mood.skill($skill`Leash of Linguini`);

  return mood;
}

export function moodNoncombat(): Mood {
  const mood = moodBaseline();

  mood.skill($skill`The Sonata of Sneakiness`);
  mood.skill($skill`Smooth Movement`);

  if (get("horseryAvailable") && get("_horsery") !== "dark horse") {
    cliExecute("horsery dark");
  }

  return mood;
}

export function addFamiliarWeight(mood: Mood): Mood {
  mood.potion($item`recording of Chorale of Companionship`, 500);
  mood.effect($effect`Billiards Belligerence`);
  mood.effect($effect`Do I Know You From Somewhere?`, () => {
    if (have($item`Beach Comb`) && !get<string>("_beachHeadsUsed").split(",").includes("10")) {
      cliExecute("beach head familiar");
    }
  });
  mood.effect($effect`Puzzle Champ`, () => {
    if (Witchess.have() && !get("_witchessBuff") && get("puzzleChampBonus") === 20) {
      cliExecute("witchess");
    }
  });

  return mood;
}

export function moodLevel(): Mood {
  const mood = moodBaseline();

  // Stats.
  mood.effect($effect`Having a Ball!`, () => {
    if (!get("_ballpit") && getClanRumpus()["Awesome Ball Pit"] !== undefined)
      cliExecute("ballpit");
  });
  mood.effect($effect`Starry-Eyed`);
  mood.effect($effect`Favored by Lyle`);

  mood.effect($effect`Trivia Master`);
  mood.potion($item`potion of temporary gr8ness`, 300);
  mood.potion($item`tomato juice of powerful power`, 150);

  mood.effect($effect`Triple-Sized`, () => {
    if (have($item`Powerful Glove`) && get("_powerfulGloveBatteryPowerUsed") <= 95) {
      equip($item`Powerful Glove`);
      useSkill($skill`CHEAT CODE: Triple Size`);
    }
  });

  mood.effect($effect`You Learned Something Maybe!`);

  if (myPrimestat() === $stat`Muscle`) {
    mood.effect($effect`Lack of Body-Building`);
    mood.effect($effect`Muscle Unbound`);
    mood.potion($item`Ben-Gal™ Balm`, 20);
    mood.potion($item`philter of phorce`, 300);
    mood.potion($item`Ferrigno's Elixir of Power`, 600);

    if (have($skill`Sweet Synthesis`)) {
      mood.effect($effect`Synthesis: Movement`);
      mood.effect($effect`Synthesis: Strong`);
    }
  } else if (myPrimestat() === $stat`Mysticality`) {
    mood.effect($effect`We're All Made of Starfish`);
    mood.effect($effect`Thaumodynamic`);
    mood.skill($skill`Inscrutable Gaze`);
    mood.potion($item`glittery mascara`, 20);
    mood.potion($item`ointment of the occult`, 300);
    mood.potion($item`Hawking's Elixir of Brilliance`, 600);

    if (have($skill`Sweet Synthesis`)) {
      mood.effect($effect`Synthesis: Learning`);
      mood.effect($effect`Synthesis: Smart`);
    }
  } else if (myPrimestat() === $stat`Moxie`) {
    mood.effect($effect`Pomp & Circumsands`);
    mood.effect($effect`So Fresh and So Clean`);
    mood.potion($item`hair spray`, 20);
    mood.potion($item`serum of sarcasm`, 300);
    mood.potion($item`Connery's Elixir of Audacity`, 600);

    if (have($skill`Sweet Synthesis`)) {
      mood.effect($effect`Synthesis: Style`);
      mood.effect($effect`Synthesis: Cool`);
    }
  }

  // ML.
  mood.skill($skill`Pride of the Puffin`);
  mood.skill($skill`Drescher's Annoying Noise`);

  // Combat.
  mood.skill($skill`Song of Sauce`);

  // Misc.
  mood.skill($skill`Carol of the Thrills`);

  if ((get("daycareOpen") || get("_daycareToday")) && !get("_daycareSpa")) {
    cliExecute(`daycare ${myPrimestat()}`);
  }

  return mood;
}
