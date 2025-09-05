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
import { CARD_NAMES } from "./card-names";

export const SAGES = {
    CEDAR: "Cedar",
    GRAVEL: "Gravel",
    PORELLA: "Porella",
    TORRENT: "Torrent",
} as const;

export const ELEMENTS = {
    TWIG: "twig",
    PEBBLE: "pebble",
    LEAF: "leaf",
    DROPLET: "droplet",
} as const;

export const ITEM_TYPES = {
    ATTACK: "attack",
    UTILITY: "utility",
    INSTANT: "instant",
} as const;

export const ALL_CARDS = {
    // ------------ SAGES ------------
    Cedar: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.CEDAR,
            sage: SAGES.CEDAR,
            img: "",
            price: 1,
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Gravel: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.GRAVEL,
            sage: SAGES.GRAVEL,
            img: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Porella: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.PORELLA,
            sage: SAGES.PORELLA,
            img: "",
            price: 1,
            element: ELEMENTS.LEAF,
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Torrent: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.TORRENT,
            sage: SAGES.TORRENT,
            img: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            attack: 3,
            health: 12,
            ability: () => [],
            rowRequirement: [1, 2, 3],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // ------------ CHAMPIONS ------------
    // *** Twigs ***
    VixVanguard: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.VIX_VANGUARD,
            price: 1,
            img: "",
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 6,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 4,
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    HornedHollow: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.HORNED_HOLLOW,
            price: 1,
            img: "",
            element: ELEMENTS.TWIG,
            attack: 6,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    CalamityLeopard: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.CALAMITY_LEOPARD,
            price: 1,
            img: "",
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 8,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // *** Pebbles ***
    JadeTitan: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.JADE_TITAN,
            price: 1,
            img: "",
            element: ELEMENTS.PEBBLE,
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 4,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    BoulderhideBrute: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.BOULDERHIDE_BRUTE,
            price: 1,
            img: "",
            element: ELEMENTS.PEBBLE,
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    OxenAvenger: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.OXEN_AVENGER,
            price: 1,
            img: "",
            element: ELEMENTS.PEBBLE,
            attack: 8,
            health: 7,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // *** Leafs ***
    AgileAssailant: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.AGILE_ASSAILANT,
            price: 1,
            img: "",
            element: ELEMENTS.LEAF,
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [2],
            levelRequirement: 4,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    BogBlight: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.BOG_BLIGHT,
            price: 1,
            img: "",
            element: ELEMENTS.LEAF,
            attack: 4,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 6,
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    KomodoKin: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.KOMODO_KIN,
            price: 1,
            img: "",
            element: ELEMENTS.LEAF,
            attack: 8,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 8,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // *** Droplets ***
    TideTurner: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.TIDE_TURNER,
            price: 1,
            img: "",
            element: ELEMENTS.DROPLET,
            attack: 4,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 4,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    KingCrustacean: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.KING_CRUSTACEAN,
            price: 1,
            img: "",
            element: ELEMENTS.DROPLET,
            attack: 3,
            health: 7,
            ability: () => [],
            rowRequirement: [1, 2],
            levelRequirement: 6,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    FrostfallEmperor: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.FROSTFALL_EMPEROR,
            price: 1,
            img: "",
            element: ELEMENTS.DROPLET,
            attack: 2,
            health: 12,
            ability: () => [],
            rowRequirement: [1],
            levelRequirement: 8,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // ------------ BASICS ------------
    // *** Twigs ***
    Timber: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.TIMBER,
            price: 1,
            element: ELEMENTS.TWIG,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Bruce: () =>
        ElementalCard.from({
            name: CARD_NAMES.BRUCE,
            price: 2,
            element: ELEMENTS.TWIG,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Willow: () =>
        ElementalCard.from({
            name: CARD_NAMES.WILLOW,
            price: 1,
            element: ELEMENTS.TWIG,
            img: "",
            attack: 1,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // *** Pebbles ***
    Cobble: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.COBBLE,
            price: 1,
            element: ELEMENTS.PEBBLE,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Flint: () =>
        ElementalCard.from({
            name: CARD_NAMES.FLINT,
            price: 1,
            element: ELEMENTS.PEBBLE,
            img: "",
            attack: 1,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Rocco: () =>
        ElementalCard.from({
            name: CARD_NAMES.ROCCO,
            price: 2,
            element: ELEMENTS.PEBBLE,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // *** Leafs ***
    Sprout: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.SPROUT,
            price: 1,
            element: ELEMENTS.LEAF,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Herbert: () =>
        ElementalCard.from({
            name: CARD_NAMES.HERBERT,
            price: 2,
            element: ELEMENTS.LEAF,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Mush: () =>
        ElementalCard.from({
            name: CARD_NAMES.MUSH,
            price: 1,
            element: ELEMENTS.LEAF,
            img: "",
            attack: 1,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // *** Droplets ***
    Dribble: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.DRIBBLE,
            price: 1,
            element: ELEMENTS.DROPLET,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Dewy: () =>
        ElementalCard.from({
            name: CARD_NAMES.DEWY,
            price: 2,
            element: ELEMENTS.DROPLET,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    Wade: () =>
        ElementalCard.from({
            name: CARD_NAMES.WADE,
            img: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            attack: 1,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // ------------ WARRIORS ------------
    // *** Twigs ***
    AcornSquire: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.ACORN_SQUIRE,
            img: "",
            price: 1,
            element: ELEMENTS.TWIG,
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    QuillThornback: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.QUILL_THORNBACK,
            img: "",
            price: 1,
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    SlumberJack: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.SLUMBER_JACK,
            img: "",
            price: 1,
            element: ELEMENTS.TWIG,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    CamouChameleon: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CAMOU_CHAMELEON,
            img: "",
            price: 7,
            element: ELEMENTS.TWIG,
            attack: 4,
            health: 5,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    LumberClaw: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.LUMBER_CLAW,
            img: "",
            price: 4,
            element: ELEMENTS.TWIG,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    PineSnapper: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.PINE_SNAPPER,
            img: "",
            price: 3,
            element: ELEMENTS.TWIG,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    SplinterStinger: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SPLINTER_STINGER,
            img: "",
            price: 5,
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    TwineFeline: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TWINE_FELINE,
            img: "",
            price: 5,
            element: ELEMENTS.TWIG,
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    OakLumbertron: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.OAK_LUMBERTRON,
            img: "",
            price: 9,
            element: ELEMENTS.TWIG,
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // *** Pebbles ***
    GeoWeasel: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.GEO_WEASEL,
            img: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    GraniteRampart: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.GRANITE_RAMPART,
            img: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    OnyxBearer: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.ONYX_BEARER,
            img: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    CackleRipclaw: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CACKLE_RIPCLAW,
            img: "",
            price: 4,
            element: ELEMENTS.PEBBLE,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    Redstone: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.REDSTONE,
            img: "",
            price: 4,
            element: ELEMENTS.PEBBLE,
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    RubyGuardian: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.RUBY_GUARDIAN,
            img: "",
            price: 3,
            element: ELEMENTS.PEBBLE,
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    RunePuma: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.RUNE_PUMA,
            img: "",
            price: 5,
            element: ELEMENTS.PEBBLE,
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    StoneDefender: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.STONE_DEFENDER,
            img: "",
            price: 8,
            element: ELEMENTS.PEBBLE,
            attack: 7,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    TerrainTumbler: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TERRAIN_TUMBLER,
            img: "",
            price: 5,
            element: ELEMENTS.PEBBLE,
            attack: 2,
            health: 6,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // *** Leafs ***
    BotanicFangs: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.BOTANIC_FANGS,
            img: "",
            price: 1,
            element: ELEMENTS.LEAF,
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    PetalMage: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.PETAL_MAGE,
            img: "",
            price: 1,
            element: ELEMENTS.LEAF,
            attack: 2,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    ThornFencer: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.THORN_FENCER,
            img: "",
            price: 1,
            element: ELEMENTS.LEAF,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    BambooBerserker: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.BAMBOO_BERSERKER,
            img: "",
            price: 9,
            element: ELEMENTS.LEAF,
            attack: 6,
            health: 6,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    ForageThumper: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.FORAGE_THUMPER,
            img: "",
            price: 5,
            element: ELEMENTS.LEAF,
            attack: 2,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    HummingHerald: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.HUMMING_HERALD,
            img: "",
            price: 5,
            element: ELEMENTS.LEAF,
            attack: 4,
            health: 3,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    IguanaGuard: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.IGUANA_GUARD,
            img: "",
            price: 5,
            element: ELEMENTS.LEAF,
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    MossViper: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.MOSS_VIPER,
            img: "",
            price: 5,
            element: ELEMENTS.LEAF,
            attack: 4,
            health: 2,
            ability: () => [],
            rowRequirement: [1, 2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    ShrubBeetle: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SHRUB_BEETLE,
            img: "",
            price: 3,
            element: ELEMENTS.LEAF,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    // *** Droplets ***
    CoastalCoyote: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.COASTAL_COYOTE,
            img: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            attack: 3,
            health: 3,
            ability: () => [],
            rowRequirement: [1, 2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    RiptideTiger: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.RIPTIDE_TIGER,
            img: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    RiverRogue: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.RIVER_ROGUE,
            img: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    CurrentConjurer: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CURRENT_CONJURER,
            img: "",
            price: 3,
            element: ELEMENTS.DROPLET,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    RoamingRazor: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.ROAMING_RAZOR,
            img: "",
            price: 8,
            element: ELEMENTS.DROPLET,
            attack: 5,
            health: 8,
            ability: () => [],
            rowRequirement: [1, 2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    SplashBasilisk: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SPLASH_BASILISK,
            img: "",
            price: 5,
            element: ELEMENTS.DROPLET,
            attack: 3,
            health: 5,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    SurgesphereMonk: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SURGESPHERE_MONK,
            img: "",
            price: 3,
            element: ELEMENTS.DROPLET,
            attack: 1,
            health: 4,
            ability: () => [],
            rowRequirement: [2],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    TyphoonFist: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TYPHOON_FIST,
            img: "",
            price: 4,
            element: ELEMENTS.DROPLET,
            attack: 2,
            health: 4,
            ability: () => [],
            rowRequirement: [1],
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
            isDayBreak: false,
        }),

    WhirlWhipper: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.WHIRL_WHIPPER,
            img: "",
            price: 4,
            element: ELEMENTS.DROPLET,
            attack: 3,
            health: 4,
            ability: () => [],
            rowRequirement: [1, 2],
            isDayBreak: true,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    // ------------ ATTACKS ------------
    CloseStrike: () =>
        ItemAttackStarterCard.from({
            name: CARD_NAMES.CLOSE_STRIKE,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    FarStrike: () =>
        ItemAttackStarterCard.from({
            name: CARD_NAMES.FAR_STRIKE,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    DistantDoubleStrike: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.DISTANT_DOUBLE_STRIKE,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    FarsightFrenzy: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.FARSIGHT_FRENZY,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2, 3],
        }),

    FocusedFury: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.FOCUSED_FURY,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    MagicEtherStrike: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.MAGIC_ETHER_STRIKE,
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    NaturesWrath: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.NATURES_WRATH,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    PrimitiveStrike: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.PRIMITIVE_STRIKE,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    ProjectileBlast: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.PROJECTILE_BLAST,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    ReinforcedImpact: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.REINFORCED_IMPACT,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    // ------------ INSTANTS ------------
    DropletCharm: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.DROPLET_CHARM,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    LeafCharm: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.LEAF_CHARM,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    PebbleCharm: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.PEBBLE_CHARM,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    TwigCharm: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.TWIG_CHARM,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    NaturalRestoration: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.NATURAL_RESTORATION,
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    MeleeShield: () =>
        ItemCard.from({
            name: CARD_NAMES.MELEE_SHIELD,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    NaturalDefense: () =>
        ItemCard.from({
            name: CARD_NAMES.NATURAL_DEFENSE,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    RangedBarrier: () =>
        ItemCard.from({
            name: CARD_NAMES.RANGED_BARRIER,
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    // ------------ UTILITIES ------------
    ElementalIncantation: () =>
        ItemCard.from({
            name: CARD_NAMES.ELEMENTAL_INCANTATION,
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    ElementalSwap: () =>
        ItemCard.from({
            name: CARD_NAMES.ELEMENTAL_SWAP,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    ExchangeOfNature: () =>
        ItemCard.from({
            name: CARD_NAMES.EXCHANGE_OF_NATURE,
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    Obliterate: () =>
        ItemCard.from({
            name: CARD_NAMES.OBLITERATE,
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),
};
