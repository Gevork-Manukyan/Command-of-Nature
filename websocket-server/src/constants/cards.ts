import {
  ElementalCard,
  ElementalChampionCard,
  ElementalSageCard,
  ElementalStarterCard,
  ElementalWarriorCard,
  ElementalWarriorStarterCard,
  ItemAttackCard,
  ItemAttackStarterCard,
  ItemCard,
  ItemStarterCard,
} from "@shared-types";

export const ALL_CARDS = {

  // ------------ SAGES ------------
  Cedar: () => new ElementalSageCard({
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

  Gravel: () => new ElementalSageCard({
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

  Porella: () => new ElementalSageCard({
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

  Torrent: () => new ElementalSageCard({
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
  VixVanguard: () => new ElementalChampionCard({
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

  HornedHollow: () => new ElementalChampionCard({
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

  CalamityLeopard: () => new ElementalChampionCard({
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
  JadeTitan: () => new ElementalChampionCard({
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

  BoulderhideBrute: () => new ElementalChampionCard({
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

  OxenAvenger: () => new ElementalChampionCard({
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
  AgileAssailant: () => new ElementalChampionCard({
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

  BogBlight: () => new ElementalChampionCard({
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

  KomodoKin: () => new ElementalChampionCard({
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
  TideTurner: () => new ElementalChampionCard({
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

  KingCrustacean: () => new ElementalChampionCard({
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

  FrostfallEmperor: () => new ElementalChampionCard({
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
  Timber: () => new ElementalStarterCard({
    name: "Timber",
    price: 1,
    element: "twig",
    img: "",
    attack: 2,
    health: 2,
  }),

  Bruce: () => new ElementalCard({
    name: "Bruce",
    price: 2,
    element: "twig",
    img: "",
    attack: 3,
    health: 3,
  }),

  Willow: () => new ElementalCard({
    name: "Willow",
    price: 1,
    element: "twig",
    img: "",
    attack: 1,
    health: 3,
  }),

  // *** Pebbles ***
  Cobble: () => new ElementalStarterCard({
    name: "Cobble",
    price: 1,
    element: "pebble",
    img: "",
    attack: 2,
    health: 2,
  }),

  Flint: () => new ElementalCard({
    name: "Flint",
    price: 1,
    element: "pebble",
    img: "",
    attack: 1,
    health: 3,
  }),

  Rocco: () => new ElementalCard({
    name: "Rocco",
    price: 2,
    element: "pebble",
    img: "",
    attack: 3,
    health: 3,
  }),

  // *** Leafs ***
  Sprout: () => new ElementalStarterCard({
    name: "Sprout",
    price: 1,
    element: "leaf",
    img: "",
    attack: 2,
    health: 2,
  }),

  Herbert: () => new ElementalCard({
    name: "Herbert",
    price: 2,
    element: "leaf",
    img: "",
    attack: 3,
    health: 3,
  }),

  Mush: () => new ElementalCard({
    name: "Mush",
    price: 1,
    element: "leaf",
    img: "",
    attack: 1,
    health: 3,
  }),

  // *** Droplets ***
  Dribble: () => new ElementalStarterCard({
    name: "Dribble",
    price: 1,
    element: "droplet",
    img: "",
    attack: 2,
    health: 2,
  }),

  Dewy: () => new ElementalCard({
    name: "Dewy",
    price: 2,
    element: "droplet",
    img: "",
    attack: 3,
    health: 3,
  }),

  Wade: () => new ElementalCard({
    name: "Wade",
    img: "",
    price: 1,
    element: "droplet",
    attack: 1,
    health: 3,
  }),

  // ------------ WARRIORS ------------
  // *** Twigs ***
  AcornSquire: () => new ElementalWarriorStarterCard({
    name: "Acorn Squire",
    img: "",
    price: 1,
    element: "twig",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  QuillThornback: () => new ElementalWarriorStarterCard({
    name: "Quill Thornback",
    img: "",
    price: 1,
    element: "twig",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  SlumberJack: () => new ElementalWarriorStarterCard({
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

  CamouChameleon: () => new ElementalWarriorCard({
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

  LumberClaw: () => new ElementalWarriorCard({
    name: "Lumber Claw",
    img: "",
    price: 4,
    element: "twig",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  PineSnapper: () => new ElementalWarriorCard({
    name: "Pine Snapper",
    img: "",
    price: 3,
    element: "twig",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  SplinterStinger: () => new ElementalWarriorCard({
    name: "Splinter Stinger",
    img: "",
    price: 5,
    element: "twig",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
  }),

  TwineFeline: () => new ElementalWarriorCard({
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

  OakLumbertron: () => new ElementalWarriorCard({
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
  GeoWeasel: () => new ElementalWarriorStarterCard({
    name: "Geo Weasel",
    img: "",
    price: 1,
    element: "pebble",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  GraniteRampart: () => new ElementalWarriorStarterCard({
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

  OnyxBearer: () => new ElementalWarriorStarterCard({
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

  CackleRipclaw: () => new ElementalWarriorCard({
    name: "Cackle Ripclaw",
    img: "",
    price: 4,
    element: "pebble",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  Redstone: () => new ElementalWarriorCard({
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

  RubyGuardian: () => new ElementalWarriorCard({
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

  RunePuma: () => new ElementalWarriorCard({
    name: "Rune Puma",
    img: "",
    price: 5,
    element: "pebble",
    attack: 3,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  StoneDefender: () => new ElementalWarriorCard({
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

  TerrainTumbler: () => new ElementalWarriorCard({
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
  BotanicFangs: () => new ElementalWarriorStarterCard({
    name: "Botanic Fangs",
    img: "",
    price: 1,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  PetalMage: () => new ElementalWarriorStarterCard({
    name: "Petal Mage",
    img: "",
    price: 1,
    element: "leaf",
    attack: 2,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  ThornFencer: () => new ElementalWarriorStarterCard({
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

  BambooBerserker: () => new ElementalWarriorCard({
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

  ForageThumper: () => new ElementalWarriorCard({
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

  HummingHerald: () => new ElementalWarriorCard({
    name: "Humming Herald",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 3,
    ability: () => {},
    rowRequirement: [2],
  }),

  IguanaGuard: () => new ElementalWarriorCard({
    name: "Iguana Guard",
    img: "",
    price: 5,
    element: "leaf",
    attack: 3,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  MossViper: () => new ElementalWarriorCard({
    name: "Moss Viper",
    img: "",
    price: 5,
    element: "leaf",
    attack: 4,
    health: 2,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  ShrubBeetle: () => new ElementalWarriorCard({
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
  CoastalCoyote: () => new ElementalWarriorStarterCard({
    name: "Coastal Coyote",
    img: "",
    price: 1,
    element: "droplet",
    attack: 3,
    health: 3,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  RiptideTiger: () => new ElementalWarriorStarterCard({
    name: "Riptide Tiger",
    img: "",
    price: 1,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  RiverRogue: () => new ElementalWarriorStarterCard({
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

  CurrentConjurer: () => new ElementalWarriorCard({
    name: "Current Conjurer",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  RoamingRazor: () => new ElementalWarriorCard({
    name: "Roaming Razor",
    img: "",
    price: 8,
    element: "droplet",
    attack: 5,
    health: 8,
    ability: () => {},
    rowRequirement: [1, 2],
  }),

  SplashBasilisk: () => new ElementalWarriorCard({
    name: "Splash Basilisk",
    img: "",
    price: 5,
    element: "droplet",
    attack: 3,
    health: 5,
    ability: () => {},
    rowRequirement: [1],
  }),

  SurgesphereMonk: () => new ElementalWarriorCard({
    name: "Surgesphere Monk",
    img: "",
    price: 3,
    element: "droplet",
    attack: 1,
    health: 4,
    ability: () => {},
    rowRequirement: [2],
  }),

  TyphoonFist: () => new ElementalWarriorCard({
    name: "Typhoon Fist",
    img: "",
    price: 4,
    element: "droplet",
    attack: 2,
    health: 4,
    ability: () => {},
    rowRequirement: [1],
  }),

  WhirlWhipper: () => new ElementalWarriorCard({
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
  CloseStrike: () => new ItemAttackStarterCard({
    name: "Close Strike",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1],
  }),

  FarStrike: () => new ItemAttackStarterCard({
    name: "Far Strike",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1, 2],
  }),

  DistantDoubleStrike: () => new ItemAttackCard({
    name: "Distant Double Strike",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1, 2],
  }),

  FarsightFrenzy: () => new ItemAttackCard({
    name: "Farsight Frenzy",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1, 2, 3],
  }),

  FocusedFury: () => new ItemAttackCard({
    name: "Focused Fury",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1],
  }),

  MagicEtherStrike: () => new ItemAttackCard({
    name: "Magic Ether Strike",
    img: "",
    price: 5,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1],
  }),

  NaturesWrath: () => new ItemAttackCard({
    name: "Nature's Wrath",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1],
  }),

  PrimitiveStrike: () => new ItemAttackCard({
    name: "Primitive Strike",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1, 2],
  }),

  ProjectileBlast: () => new ItemAttackCard({
    name: "Projectile Blast",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1, 2],
  }),

  ReinforcedImpact: () => new ItemAttackCard({
    name: "Reinforced Impact",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "attack",
    rowRequirement: [1],
  }),

  // ------------ INSTANTS ------------
  DropletCharm: () => new ItemStarterCard({
    name: "Droplet Charm",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "instant",
  }),

  LeafCharm: () => new ItemStarterCard({
    name: "Leaf Charm",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "instant",
  }),

  PebbleCharm: () => new ItemStarterCard({
    name: "Pebble Charm",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "instant",
  }),

  TwigCharm: () => new ItemStarterCard({
    name: "Twig Charm",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "instant",
  }),

  NaturalRestoration: () => new ItemStarterCard({
    name: "Natural Restoration",
    img: "",
    price: 1,
    ability: () => {},
    itemType: "instant",
  }),

  MeleeShield: () => new ItemCard({
    name: "Melee Shield",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "instant",
  }),

  NaturalDefense: () => new ItemCard({
    name: "Natural Defense",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "instant",
  }),

  RangedBarrier: () => new ItemCard({
    name: "Ranged Barrier",
    img: "",
    price: 3,
    ability: () => {},
    itemType: "instant",
  }),

  // ------------ UTILITIES ------------
  ElementalIncantation: () => new ItemCard({
    name: "Elemental Incantation",
    img: "",
    price: 5,
    ability: () => {},
    itemType: "utility",
  }),

  ElementalSwap: () => new ItemCard({
    name: "Elemental Swap",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "utility",
  }),

  ExchangeOfNature: () => new ItemCard({
    name: "Exchange of Nature",
    img: "",
    price: 2,
    ability: () => {},
    itemType: "utility",
  }),

  Obliterate: () => new ItemCard({
    name: "Obliterate",
    img: "",
    price: 5,
    ability: () => {},
    itemType: "utility",
  }),
}