import { ACCESSORY_REGISTRY } from "./accessoryRegistry";

import { AccessoryProfile } from "./accessoryProfile.types";

export function resolveAccessoryProfile(
  category: string
): AccessoryProfile {

  return (

    ACCESSORY_REGISTRY[
      category.toLowerCase()
    ] ||

    ACCESSORY_REGISTRY.default

  );

}