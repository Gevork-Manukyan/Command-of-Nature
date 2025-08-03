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
    Cedar: () =>
        ElementalSageCard.from({
            name: "Cedar",
            sage: "Cedar",
            img: "",
            price: 1,
            element: "twig",
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
        }),

    Gravel: () =>
        ElementalSageCard.from({
            name: "Gravel",
            sage: "Gravel",
            img: "",
            price: 1,
            element: "pebble",
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
        }),

    Porella: () =>
        ElementalSageCard.from({
            name: "Porella",
            sage: "Porella",
            img: "",
            price: 1,
            element: "leaf",
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
        }),

    Torrent: () =>
        ElementalSageCard.from({
            name: "Torrent",
            sage: "Torrent",
            img: "",
            price: 1,
            element: "droplet",
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
        }),

    // ------------ CHAMPIONS ------------
    // *** Twigs ***
    VixVanguard: () =>
        ElementalChampionCard.from({
            name: "Vix Vanguard",
            price: 1,
            img: "",
            element: "twig",
            attack: 3,
            health: 6,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 4,
            isDayBreak: true,
        }),

    HornedHollow: () =>
        ElementalChampionCard.from({
            name: "Horned Hollow",
            price: 1,
            img: "",
            element: "twig",
            attack: 6,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
        }),

    CalamityLeopard: () =>
        ElementalChampionCard.from({
            name: "Calamity Leopard",
            price: 1,
            img: "",
            element: "twig",
            attack: 3,
            health: 8,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
        }),

    // *** Pebbles ***
    JadeTitan: () =>
        ElementalChampionCard.from({
            name: "Jade Titan",
            price: 1,
            img: "",
            element: "pebble",
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 4,
        }),

    BoulderhideBrute: () =>
        ElementalChampionCard.from({
            name: "Boulderhide Brute",
            price: 1,
            img: "",
            element: "pebble",
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
        }),

    OxenAvenger: () =>
        ElementalChampionCard.from({
            name: "Oxen Avenger",
            price: 1,
            img: "",
            element: "pebble",
            attack: 8,
            health: 7,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
        }),

    // *** Leafs ***
    AgileAssailant: () =>
        ElementalChampionCard.from({
            name: "Agile Assailant",
            price: 1,
            img: "",
            element: "leaf",
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [2],
            levelRequirement: 4,
        }),

    BogBlight: () =>
        ElementalChampionCard.from({
            name: "Bog Blight",
            price: 1,
            img: "",
            element: "leaf",
            attack: 4,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 6,
            isDayBreak: true,
        }),

    KomodoKin: () =>
        ElementalChampionCard.from({
            name: "Komodo Kin",
            price: 1,
            img: "",
            element: "leaf",
            attack: 8,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
        }),

    // *** Droplets ***
    TideTurner: () =>
        ElementalChampionCard.from({
            name: "Tide Turner",
            price: 1,
            img: "",
            element: "droplet",
            attack: 4,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 4,
        }),

    KingCrustacean: () =>
        ElementalChampionCard.from({
            name: "King Crustacean",
            price: 1,
            img: "",
            element: "droplet",
            attack: 3,
            health: 7,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
        }),

    FrostfallEmperor: () =>
        ElementalChampionCard.from({
            name: "Frostfall Emperor",
            price: 1,
            img: "",
            element: "droplet",
            attack: 2,
            health: 12,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 8,
        }),

    // ------------ BASICS ------------
    // *** Twigs ***
    Timber: () =>
        ElementalStarterCard.from({
            name: "Timber",
            price: 1,
            element: "twig",
            img: "",
            attack: 2,
            health: 2,
        }),

    Bruce: () =>
        ElementalCard.from({
            name: "Bruce",
            price: 2,
            element: "twig",
            img: "",
            attack: 3,
            health: 3,
        }),

    Willow: () =>
        ElementalCard.from({
            name: "Willow",
            price: 1,
            element: "twig",
            img: "",
            attack: 1,
            health: 3,
        }),

    // *** Pebbles ***
    Cobble: () =>
        ElementalStarterCard.from({
            name: "Cobble",
            price: 1,
            element: "pebble",
            img: "",
            attack: 2,
            health: 2,
        }),

    Flint: () =>
        ElementalCard.from({
            name: "Flint",
            price: 1,
            element: "pebble",
            img: "",
            attack: 1,
            health: 3,
        }),

    Rocco: () =>
        ElementalCard.from({
            name: "Rocco",
            price: 2,
            element: "pebble",
            img: "",
            attack: 3,
            health: 3,
        }),

    // *** Leafs ***
    Sprout: () =>
        ElementalStarterCard.from({
            name: "Sprout",
            price: 1,
            element: "leaf",
            img: "",
            attack: 2,
            health: 2,
        }),

    Herbert: () =>
        ElementalCard.from({
            name: "Herbert",
            price: 2,
            element: "leaf",
            img: "",
            attack: 3,
            health: 3,
        }),

    Mush: () =>
        ElementalCard.from({
            name: "Mush",
            price: 1,
            element: "leaf",
            img: "",
            attack: 1,
            health: 3,
        }),

    // *** Droplets ***
    Dribble: () =>
        ElementalStarterCard.from({
            name: "Dribble",
            price: 1,
            element: "droplet",
            img: "",
            attack: 2,
            health: 2,
        }),

    Dewy: () =>
        ElementalCard.from({
            name: "Dewy",
            price: 2,
            element: "droplet",
            img: "",
            attack: 3,
            health: 3,
        }),

    Wade: () =>
        ElementalCard.from({
            name: "Wade",
            img: "",
            price: 1,
            element: "droplet",
            attack: 1,
            health: 3,
        }),

    // ------------ WARRIORS ------------
    // *** Twigs ***
    AcornSquire: () =>
        ElementalWarriorStarterCard.from({
            name: "Acorn Squire",
            img: "",
            price: 1,
            element: "twig",
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
        }),

    QuillThornback: () =>
        ElementalWarriorStarterCard.from({
            name: "Quill Thornback",
            img: "",
            price: 1,
            element: "twig",
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    SlumberJack: () =>
        ElementalWarriorStarterCard.from({
            name: "Slumber Jack",
            img: "",
            price: 1,
            element: "twig",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
        }),

    CamouChameleon: () =>
        ElementalWarriorCard.from({
            name: "Camou Chameleon",
            img: "",
            price: 7,
            element: "twig",
            attack: 4,
            health: 5,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    LumberClaw: () =>
        ElementalWarriorCard.from({
            name: "Lumber Claw",
            img: "",
            price: 4,
            element: "twig",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    PineSnapper: () =>
        ElementalWarriorCard.from({
            name: "Pine Snapper",
            img: "",
            price: 3,
            element: "twig",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
        }),

    SplinterStinger: () =>
        ElementalWarriorCard.from({
            name: "Splinter Stinger",
            img: "",
            price: 5,
            element: "twig",
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
        }),

    TwineFeline: () =>
        ElementalWarriorCard.from({
            name: "TwineFeline",
            img: "",
            price: 5,
            element: "twig",
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
        }),

    OakLumbertron: () =>
        ElementalWarriorCard.from({
            name: "Oak Lumbertron",
            img: "",
            price: 9,
            element: "twig",
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    // *** Pebbles ***
    GeoWeasel: () =>
        ElementalWarriorStarterCard.from({
            name: "Geo Weasel",
            img: "",
            price: 1,
            element: "pebble",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    GraniteRampart: () =>
        ElementalWarriorStarterCard.from({
            name: "Granite Rampart",
            img: "",
            price: 1,
            element: "pebble",
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    OnyxBearer: () =>
        ElementalWarriorStarterCard.from({
            name: "Onyx Bearer",
            img: "",
            price: 1,
            element: "pebble",
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
        }),

    CackleRipclaw: () =>
        ElementalWarriorCard.from({
            name: "Cackle Ripclaw",
            img: "",
            price: 4,
            element: "pebble",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    Redstone: () =>
        ElementalWarriorCard.from({
            name: "Redstone",
            img: "",
            price: 4,
            element: "pebble",
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    RubyGuardian: () =>
        ElementalWarriorCard.from({
            name: "Ruby Guardian",
            img: "",
            price: 3,
            element: "pebble",
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    RunePuma: () =>
        ElementalWarriorCard.from({
            name: "Rune Puma",
            img: "",
            price: 5,
            element: "pebble",
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
        }),

    StoneDefender: () =>
        ElementalWarriorCard.from({
            name: "Stone Defender",
            img: "",
            price: 8,
            element: "pebble",
            attack: 7,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
        }),

    TerrainTumbler: () =>
        ElementalWarriorCard.from({
            name: "Terrain Tumbler",
            img: "",
            price: 5,
            element: "pebble",
            attack: 2,
            health: 6,
            ability: () => [],
            rowRequirement: [2],
        }),

    // *** Leafs ***
    BotanicFangs: () =>
        ElementalWarriorStarterCard.from({
            name: "Botanic Fangs",
            img: "",
            price: 1,
            element: "leaf",
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
        }),

    PetalMage: () =>
        ElementalWarriorStarterCard.from({
            name: "Petal Mage",
            img: "",
            price: 1,
            element: "leaf",
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
        }),

    ThornFencer: () =>
        ElementalWarriorStarterCard.from({
            name: "Thorn Fencer",
            img: "",
            price: 1,
            element: "leaf",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
        }),

    BambooBerserker: () =>
        ElementalWarriorCard.from({
            name: "Bamboo Berserker",
            img: "",
            price: 9,
            element: "leaf",
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    ForageThumper: () =>
        ElementalWarriorCard.from({
            name: "Forage Thumper",
            img: "",
            price: 5,
            element: "leaf",
            attack: 2,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
        }),

    HummingHerald: () =>
        ElementalWarriorCard.from({
            name: "Humming Herald",
            img: "",
            price: 5,
            element: "leaf",
            attack: 4,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
        }),

    IguanaGuard: () =>
        ElementalWarriorCard.from({
            name: "Iguana Guard",
            img: "",
            price: 5,
            element: "leaf",
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
        }),

    MossViper: () =>
        ElementalWarriorCard.from({
            name: "Moss Viper",
            img: "",
            price: 5,
            element: "leaf",
            attack: 4,
            health: 2,
            ability: () => [],
            rowRequirement: [1, 2],
        }),

    ShrubBeetle: () =>
        ElementalWarriorCard.from({
            name: "Shrub Beetle",
            img: "",
            price: 3,
            element: "leaf",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    // *** Droplets ***
    CoastalCoyote: () =>
        ElementalWarriorStarterCard.from({
            name: "Coastal Coyote",
            img: "",
            price: 1,
            element: "droplet",
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
        }),

    RiptideTiger: () =>
        ElementalWarriorStarterCard.from({
            name: "Riptide Tiger",
            img: "",
            price: 1,
            element: "droplet",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    RiverRogue: () =>
        ElementalWarriorStarterCard.from({
            name: "River Rogue",
            img: "",
            price: 1,
            element: "droplet",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
        }),

    CurrentConjurer: () =>
        ElementalWarriorCard.from({
            name: "Current Conjurer",
            img: "",
            price: 3,
            element: "droplet",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
        }),

    RoamingRazor: () =>
        ElementalWarriorCard.from({
            name: "Roaming Razor",
            img: "",
            price: 8,
            element: "droplet",
            attack: 5,
            health: 8,
            ability: () => [],
            rowRequirement: [1, 2],
        }),

    SplashBasilisk: () =>
        ElementalWarriorCard.from({
            name: "Splash Basilisk",
            img: "",
            price: 5,
            element: "droplet",
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
        }),

    SurgesphereMonk: () =>
        ElementalWarriorCard.from({
            name: "Surgesphere Monk",
            img: "",
            price: 3,
            element: "droplet",
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
        }),

    TyphoonFist: () =>
        ElementalWarriorCard.from({
            name: "Typhoon Fist",
            img: "",
            price: 4,
            element: "droplet",
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
        }),

    WhirlWhipper: () =>
        ElementalWarriorCard.from({
            name: "Whirl Whipper",
            img: "",
            price: 4,
            element: "droplet",
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
        }),

    // ------------ ATTACKS ------------
    CloseStrike: () =>
        ItemAttackStarterCard.from({
            name: "Close Strike",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1],
        }),

    FarStrike: () =>
        ItemAttackStarterCard.from({
            name: "Far Strike",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1, 2],
        }),

    DistantDoubleStrike: () =>
        ItemAttackCard.from({
            name: "Distant Double Strike",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1, 2],
        }),

    FarsightFrenzy: () =>
        ItemAttackCard.from({
            name: "Farsight Frenzy",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1, 2, 3],
        }),

    FocusedFury: () =>
        ItemAttackCard.from({
            name: "Focused Fury",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1],
        }),

    MagicEtherStrike: () =>
        ItemAttackCard.from({
            name: "Magic Ether Strike",
            img: "",
            price: 5,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1],
        }),

    NaturesWrath: () =>
        ItemAttackCard.from({
            name: "Nature's Wrath",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1],
        }),

    PrimitiveStrike: () =>
        ItemAttackCard.from({
            name: "Primitive Strike",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1, 2],
        }),

    ProjectileBlast: () =>
        ItemAttackCard.from({
            name: "Projectile Blast",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1, 2],
        }),

    ReinforcedImpact: () =>
        ItemAttackCard.from({
            name: "Reinforced Impact",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "attack",
            rowRequirement: [1],
        }),

    // ------------ INSTANTS ------------
    DropletCharm: () =>
        ItemStarterCard.from({
            name: "Droplet Charm",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "instant",
        }),

    LeafCharm: () =>
        ItemStarterCard.from({
            name: "Leaf Charm",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "instant",
        }),

    PebbleCharm: () =>
        ItemStarterCard.from({
            name: "Pebble Charm",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "instant",
        }),

    TwigCharm: () =>
        ItemStarterCard.from({
            name: "Twig Charm",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "instant",
        }),

    NaturalRestoration: () =>
        ItemStarterCard.from({
            name: "Natural Restoration",
            img: "",
            price: 1,
            ability: () => [],
            itemType: "instant",
        }),

    MeleeShield: () =>
        ItemCard.from({
            name: "Melee Shield",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "instant",
        }),

    NaturalDefense: () =>
        ItemCard.from({
            name: "Natural Defense",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "instant",
        }),

    RangedBarrier: () =>
        ItemCard.from({
            name: "Ranged Barrier",
            img: "",
            price: 3,
            ability: () => [],
            itemType: "instant",
        }),

    // ------------ UTILITIES ------------
    ElementalIncantation: () =>
        ItemCard.from({
            name: "Elemental Incantation",
            img: "",
            price: 5,
            ability: () => [],
            itemType: "utility",
        }),

    ElementalSwap: () =>
        ItemCard.from({
            name: "Elemental Swap",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "utility",
        }),

    ExchangeOfNature: () =>
        ItemCard.from({
            name: "Exchange of Nature",
            img: "",
            price: 2,
            ability: () => [],
            itemType: "utility",
        }),

    Obliterate: () =>
        ItemCard.from({
            name: "Obliterate",
            img: "",
            price: 5,
            ability: () => [],
            itemType: "utility",
        }),
};
