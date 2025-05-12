import {
  AttackCardSchema,
  AttackStarterCardSchema,
  ElementalCardSchema,
  ElementalChampionSchema,
  ElementalSageSchema,
  ElementalStarterCardSchema,
  ElementalWarriorCardSchema,
  ElementalWarriorStarterCardSchema,
  InstantCardSchema,
  InstantStarterCardSchema,
  UtilityCardSchema,
} from "@shared-types";

export const ALL_CARDS = {

  // ------------ SAGES ------------
  Cedar: ElementalSageSchema.parse({
    name: "Cedar",
    sage: "Cedar",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 12,
    ability: () => {},
    rowRequirement: [1, 2, 3],
    isDayBreak: true,
  }),

  Gravel: ElementalSageSchema.parse({
    name: "Gravel",
    sage: "Gravel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 3,
    health: 12,
    ability: () => {},
    rowRequirement: [1, 2, 3],
    isDayBreak: true,
  }),

  Porella: ElementalSageSchema.parse({
    name: "Porella",
    sage: "Porella",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 12,
    ability: () => {},
    rowRequirement: [1, 2, 3],
    isDayBreak: true,
  }),

  Torrent: ElementalSageSchema.parse({
    name: "Torrent",
    sage: "Torrent",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 12,
    ability: () => {},
    rowRequirement: [1, 2, 3],
    isDayBreak: true,
  }),

  // ------------ CHAMPIONS ------------
  // *** Twigs ***
  VixVanguard: ElementalChampionSchema.parse({
    name: "Vix Vanguard",
    price: 1,
    img: "",
    element: "twig",
    attack: 3,
    health: 6,
    ability: () => {},
    rowRequirement: [1],
    levelRequirement: 4,
    isDayBreak: true,
  }),

  HornedHollow: ElementalChampionSchema.parse({
    name: "Horned Hollow",
    price: 1,
    img: "",
    element: "twig",
    attack: 6,
    health: 4,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 6,
  }),

  CalamityLeopard: ElementalChampionSchema.parse({
    name: "Calamity Leopard",
    price: 1,
    img: "",
    element: "twig",
    attack: 3,
    health: 8,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 8,
  }),

  // *** Pebbles ***
  JadeTitan: ElementalChampionSchema.parse({
    name: "Jade Titan",
    price: 1,
    img: "",
    element: "pebble",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
    levelRequirement: 4,
  }),

  BoulderhideBrute: ElementalChampionSchema.parse({
    name: "Boulderhide Brute",
    price: 1,
    img: "",
    element: "pebble",
    attack: 6,
    health: 6,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 6,
  }),

  OxenAvenger: ElementalChampionSchema.parse({
    name: "Oxen Avenger",
    price: 1,
    img: "",
    element: "pebble",
    attack: 8,
    health: 7,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 8,
  }),

  // *** Leafs ***
  AgileAssailant: ElementalChampionSchema.parse({
    name: "Agile Assailant",
    price: 1,
    img: "",
    element: "leaf",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [2],
    levelRequirement: 4,
  }),

  BogBlight: ElementalChampionSchema.parse({
    name: "Bog Blight",
    price: 1,
    img: "",
    element: "leaf",
    attack: 4,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
    levelRequirement: 6,
    isDayBreak: true,
  }),

  KomodoKin: ElementalChampionSchema.parse({
    name: "Komodo Kin",
    price: 1,
    img: "",
    element: "leaf",
    attack: 8,
    health: 6,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 8,
  }),

  // *** Droplets ***
  TideTurner: ElementalChampionSchema.parse({
    name: "Tide Turner",
    price: 1,
    img: "",
    element: "droplet",
    attack: 4,
    health: 4,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 4,
  }),

  KingCrustacean: ElementalChampionSchema.parse({
    name: "King Crustacean",
    price: 1,
    img: "",
    element: "droplet",
    attack: 3,
    health: 7,
    ability: () => {},
    rowRequirement: [1, 2],
    levelRequirement: 6,
  }),

  FrostfallEmperor: ElementalChampionSchema.parse({
    name: "Frostfall Emperor",
    price: 1,
    img: "",
    element: "droplet",
    attack: 2,
    health: 12,
    ability: () => {},
    rowRequirement: [1],
    levelRequirement: 8,
  }),

  // ------------ BASICS ------------
  // *** Twigs ***
  Timber: ElementalStarterCardSchema.parse({
    name: "Timber",
    price: 1,
    element: "twig",
    img: "",
    attack: 2,
    health: 2,
  }),

  Bruce: ElementalCardSchema.parse({
    name: "Bruce",
    price: 2,
    element: "twig",
    img: "",
    attack: 3,
    health: 3,
  }),

  Willow: ElementalCardSchema.parse({
    name: "Willow",
    price: 1,
    element: "twig",
    img: "",
    attack: 1,
    health: 3,
  }),

  // *** Pebbles ***
  Cobble: ElementalStarterCardSchema.parse({
    name: "Cobble",
    price: 1,
    element: "pebble",
    img: "",
    attack: 2,
    health: 2,
  }),

  Flint: ElementalCardSchema.parse({
    name: "Flint",
    price: 1,
    element: "pebble",
    img: "",
    attack: 1,
    health: 3,
  }),

  Rocco: ElementalCardSchema.parse({
    name: "Rocco",
    price: 2,
    element: "pebble",
    img: "",
    attack: 3,
    health: 3,
  }),

  // *** Leafs ***
  Sprout: ElementalStarterCardSchema.parse({
    name: "Sprout",
    price: 1,
    element: "leaf",
    img: "",
    attack: 2,
    health: 2,
  }),

  Herbert: ElementalCardSchema.parse({
    name: "Herbert",
    price: 2,
    element: "leaf",
    img: "",
    attack: 3,
    health: 3,
  }),

  Mush: ElementalCardSchema.parse({
    name: "Mush",
    price: 1,
    element: "leaf",
    img: "",
    attack: 1,
    health: 3,
  }),

  // *** Droplets ***
  Dribble: ElementalStarterCardSchema.parse({
    name: "Dribble",
    price: 1,
    element: "droplet",
    img: "",
    attack: 2,
    health: 2,
  }),

  Dewy: ElementalCardSchema.parse({
    name: "Dewy",
    price: 2,
    element: "droplet",
    img: "",
    attack: 3,
    health: 3,
  }),

  Wade: ElementalCardSchema.parse({
    name: "Wade",
    img: "",
    price: 1,
    element: "droplet",
    attack: 1,
    health: 3,
  }),

  // ------------ WARRIORS ------------
  // *** Twigs ***
  AcornSquire: ElementalWarriorStarterCardSchema.parse({
    name: "Acorn Squire",
    img: "",
    price: 1,
    element: "twig",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  QuillThornback: ElementalWarriorStarterCardSchema.parse({
    name: "Quill Thornback",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  SlumberJack: ElementalWarriorStarterCardSchema.parse({
    name: "Slumber Jack",
    img: "",
    price: 1,
    element: "twig",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
    isDayBreak: true,
  }),

  CamouChameleon: ElementalWarriorCardSchema.parse({
    name: "Camou Chameleon",
    img: "",
    price: 7,
    element: "twig",
    attack: 4,
    health: 5,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  LumberClaw: ElementalWarriorCardSchema.parse({
    name: "Lumber Claw",
    img: "",
    price: 4,
    element: "twig",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  PineSnapper: ElementalWarriorCardSchema.parse({
    name: "Pine Snapper",
    img: "",
    price: 3,
    element: "twig",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  SplinterStinger: ElementalWarriorCardSchema.parse({
    name: "Splinter Stinger",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
  }),

  TwineFeline: ElementalWarriorCardSchema.parse({
    name: "TwineFeline",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [2],
    isDayBreak: true,
  }),

  OakLumbertron: ElementalWarriorCardSchema.parse({
    name: "Oak Lumbertron",
    img: "",
    price: 9,
    element: "twig",
    attack: 6,
    health: 6,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  // *** Pebbles ***
  GeoWeasel: ElementalWarriorStarterCardSchema.parse({
    name: "Geo Weasel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  GraniteRampart: ElementalWarriorStarterCardSchema.parse({
    name: "Granite Rampart",
    img: "",
    price: 1,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  OnyxBearer: ElementalWarriorStarterCardSchema.parse({
    name: "Onyx Bearer",
    img: "",
    price: 1,
    element: "pebble",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
    isDayBreak: true,
  }),

  CackleRipclaw: ElementalWarriorCardSchema.parse({
    name: "Cackle Ripclaw",
    img: "",
    price: 4,
    element: "pebble",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  Redstone: ElementalWarriorCardSchema.parse({
    name: "Redstone",
    img: "",
    price: 4,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  RubyGuardian: ElementalWarriorCardSchema.parse({
    name: "Ruby Guardian",
    img: "",
    price: 3,
    element: "pebble",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  RunePuma: ElementalWarriorCardSchema.parse({
    name: "Rune Puma",
    img: "",
    price: 5,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  StoneDefender: ElementalWarriorCardSchema.parse({
    name: "Stone Defender",
    img: "",
    price: 8,
    element: "pebble",
    attack: 7,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
    isDayBreak: true,
  }),

  TerrainTumbler: ElementalWarriorCardSchema.parse({
    name: "Terrain Tumbler",
    img: "",
    price: 5,
    element: "pebble",
    attack: 2,
    health: 6,
    ability: () => {},
    rowRequirement: [2],
  }),

  // *** Leafs ***
  BotanicFangs: ElementalWarriorStarterCardSchema.parse({
    name: "Botanic Fangs",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  PetalMage: ElementalWarriorStarterCardSchema.parse({
    name: "Petal Mage",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  ThornFencer: ElementalWarriorStarterCardSchema.parse({
    name: "Thorn Fencer",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
    isDayBreak: true,
  }),

  BambooBerserker: ElementalWarriorCardSchema.parse({
    name: "Bamboo Berserker",
    img: "",
    price: 9,
    element: "leaf",
    attack: 6,
    health: 6,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  ForageThumper: ElementalWarriorCardSchema.parse({
    name: "Forage Thumper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 2,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
    isDayBreak: true,
  }),

  HummingHerald: ElementalWarriorCardSchema.parse({
    name: "Humming Herald",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  IguanaGuard: ElementalWarriorCardSchema.parse({
    name: "Iguana Guard",
    img: "",
    price: 5,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  MossViper: ElementalWarriorCardSchema.parse({
    name: "Moss Viper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 2,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  ShrubBeetle: ElementalWarriorCardSchema.parse({
    name: "Shrub Beetle",
    img: "",
    price: 3,
    element: "leaf",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  // *** Droplets ***
  CoastalCoyote: ElementalWarriorStarterCardSchema.parse({
    name: "Coastal Coyote",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  RiptideTiger: ElementalWarriorStarterCardSchema.parse({
    name: "Riptide Tiger",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  RiverRogue: ElementalWarriorStarterCardSchema.parse({
    name: "River Rogue",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
    isDayBreak: true,
  }),

  CurrentConjurer: ElementalWarriorCardSchema.parse({
    name: "Current Conjurer",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  RoamingRazor: ElementalWarriorCardSchema.parse({
    name: "Roaming Razor",
    img: "",
    price: 8,
    element: "droplet",
    attack: 5,
    health: 8,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  SplashBasilisk: ElementalWarriorCardSchema.parse({
    name: "Splash Basilisk",
    img: "",
    price: 5,
    element: "droplet",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
  }),

  SurgesphereMonk: ElementalWarriorCardSchema.parse({
    name: "Surgesphere Monk",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  TyphoonFist: ElementalWarriorCardSchema.parse({
    name: "Typhoon Fist",
    img: "",
    price: 4,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  WhirlWhipper: ElementalWarriorCardSchema.parse({
    name: "Whirl Whipper",
    img: "",
    price: 4,
    element: "droplet",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [1, 2],
    isDayBreak: true,
  }),

  // ------------ ATTACKS ------------
  CloseStrike: AttackStarterCardSchema.parse({
    name: "Close Strike",
    img: "",
    price: 1,
    ability: () => {},
    rowRequirement: [1],
  }),

  FarStrike: AttackStarterCardSchema.parse({
    name: "Far Strike",
    img: "",
    price: 1,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  DistantDoubleStrike: AttackCardSchema.parse({
    name: "Distant Double Strike",
    img: "",
    price: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  FarsightFrenzy: AttackCardSchema.parse({
    name: "Farsight Frenzy",
    img: "",
    price: 3,
    ability: () => {},
    rowRequirement: [1, 2, 3],
  }),

  FocusedFury: AttackCardSchema.parse({
    name: "Focused Fury",
    img: "",
    price: 2,
    ability: () => {},
    rowRequirement: [1],
  }),

  MagicEtherStrike: AttackCardSchema.parse({
    name: "Magic Ether Strike",
    img: "",
    price: 5,
    ability: () => {},
    rowRequirement: [1],
  }),

  NaturesWrath: AttackCardSchema.parse({
    name: "Nature's Wrath",
    img: "",
    price: 2,
    ability: () => {},
    rowRequirement: [1],
  }),

  PrimitiveStrike: AttackCardSchema.parse({
    name: "Primitive Strike",
    img: "",
    price: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  ProjectileBlast: AttackCardSchema.parse({
    name: "Projectile Blast",
    img: "",
    price: 2,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  ReinforcedImpact: AttackCardSchema.parse({
    name: "Reinforced Impact",
    img: "",
    price: 2,
    ability: () => {},
    rowRequirement: [1],
  }),

  // ------------ INSTANTS ------------
  DropletCharm: InstantStarterCardSchema.parse({
    name: "Droplet Charm",
    img: "",
    price: 1,
    ability: () => {},
  }),

  LeafCharm: InstantStarterCardSchema.parse({
    name: "Leaf Charm",
    img: "",
    price: 1,
    ability: () => {},
  }),

  PebbleCharm: InstantStarterCardSchema.parse({
    name: "Pebble Charm",
    img: "",
    price: 1,
    ability: () => {},
  }),

  TwigCharm: InstantStarterCardSchema.parse({
    name: "Twig Charm",
    img: "",
    price: 1,
    ability: () => {},
  }),

  NaturalRestoration: InstantStarterCardSchema.parse({
    name: "Natural Restoration",
    img: "",
    price: 1,
    ability: () => {},
  }),

  MeleeShield: InstantCardSchema.parse({
    name: "Melee Shield",
    img: "",
    price: 3,
    ability: () => {},
  }),

  NaturalDefense: InstantCardSchema.parse({
    name: "Natural Defense",
    img: "",
    price: 3,
    ability: () => {},
  }),

  RangedBarrier: InstantCardSchema.parse({
    name: "Ranged Barrier",
    img: "",
    price: 3,
    ability: () => {},
  }),

  // ------------ UTILITIES ------------
  ElementalIncantation: UtilityCardSchema.parse({
    name: "Elemental Incantation",
    img: "",
    price: 5,
    ability: () => {},
  }),

  ElementalSwap: UtilityCardSchema.parse({
    name: "Elemental Swap",
    img: "",
    price: 2,
    ability: () => {},
  }),

  ExchangeOfNature: UtilityCardSchema.parse({
    name: "Exchange of Nature",
    img: "",
    price: 2,
    ability: () => {},
  }),

  Obliterate: UtilityCardSchema.parse({
    name: "Obliterate",
    img: "",
    price: 5,
    ability: () => {},
  }),
}