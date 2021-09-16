import { $item, PropertiesManager, setDefaultMaximizeOptions } from "libram";

setDefaultMaximizeOptions({
  bonusEquip: new Map([
    [$item`Greatest American Pants`, 500],
    [$item`mafia thumb ring`, 500],
  ]),
});

export const propertyManager = new PropertiesManager();
