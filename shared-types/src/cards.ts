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
} from "./card-classes";
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
    [CARD_NAMES.CEDAR]: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.CEDAR,
            description: "Collect 3 gold.",
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

    [CARD_NAMES.GRAVEL]: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.GRAVEL,
            description: "Collect 3 gold.",
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

    [CARD_NAMES.PORELLA]: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.PORELLA,
            description: "Collect 3 gold.",
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

    [CARD_NAMES.TORRENT]: () =>
        ElementalSageCard.from({
            name: CARD_NAMES.TORRENT,
            description: "Collect 3 gold.",
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
    [CARD_NAMES.VIX_VANGUARD]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.VIX_VANGUARD,
            description: "Draw a card if this Elemental has at least 1 boost on it.",
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

    [CARD_NAMES.HORNED_HOLLOW]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.HORNED_HOLLOW,
            description: "When this Elemental defeats an Elemental in your opponent's formation, remove all damage counters from this Elemental.",
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

    [CARD_NAMES.CALAMITY_LEOPARD]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.CALAMITY_LEOPARD,
            description: "When this Elemental attacks, do not remove boosts from it.",
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
    [CARD_NAMES.JADE_TITAN]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.JADE_TITAN,
            description: "When this Elemental deals DMG by attacking, add 1 shield to your Sage.",
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

    [CARD_NAMES.BOULDERHIDE_BRUTE]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.BOULDERHIDE_BRUTE,
            description: "When you add any number of shields to this Elemental, add 1 boost to it.",
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

    [CARD_NAMES.OXEN_AVENGER]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.OXEN_AVENGER,
            description: "When an Elemental in your formation has any number of shields removed from it, deal 1 DMG to an Elemental in your opponent's formation.",
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
    [CARD_NAMES.AGILE_ASSAILANT]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.AGILE_ASSAILANT,
            description: "When an Elemental enters your formation, add 1 boost to this Elemental. When an Elemental leaves your formation, add 1 shield to this Elemental.",
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

    [CARD_NAMES.BOG_BLIGHT]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.BOG_BLIGHT,
            description: "Move this Elemental to your discard pile, then deal 3 DMG to an Elemental in your opponent's Row I or Row II.",
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

    [CARD_NAMES.KOMODO_KIN]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.KOMODO_KIN,
            description: "When this Elemental defeats an Elemental in your opponent's formation, move an Elemental from your discard pile to your formation.",
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
    [CARD_NAMES.TIDE_TURNER]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.TIDE_TURNER,
            description: "When this Elemental is attacked, draw a card.",
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

    [CARD_NAMES.KING_CRUSTACEAN]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.KING_CRUSTACEAN,
            description: "When a connected Elemental would be dealt DMG, you may swap it's position with this Elemental's; this Elemental takes that DMG instead.",
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

    [CARD_NAMES.FROSTFALL_EMPEROR]: () =>
        ElementalChampionCard.from({
            name: CARD_NAMES.FROSTFALL_EMPEROR,
            description: "When this Elemental enters your Row I, deal 2 DMG to an Elemental in your opponent's Row III.",
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
    [CARD_NAMES.TIMBER]: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.TIMBER,
            description: "",
            price: 1,
            element: ELEMENTS.TWIG,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.BRUCE]: () =>
        ElementalCard.from({
            name: CARD_NAMES.BRUCE,
            description: "",
            price: 2,
            element: ELEMENTS.TWIG,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.WILLOW]: () =>
        ElementalCard.from({
            name: CARD_NAMES.WILLOW,
            description: "",
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
    [CARD_NAMES.COBBLE]: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.COBBLE,
            description: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.FLINT]: () =>
        ElementalCard.from({
            name: CARD_NAMES.FLINT,
            description: "",
            price: 1,
            element: ELEMENTS.PEBBLE,
            img: "",
            attack: 1,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.ROCCO]: () =>
        ElementalCard.from({
            name: CARD_NAMES.ROCCO,
            description: "",
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
    [CARD_NAMES.SPROUT]: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.SPROUT,
            description: "",
            price: 1,
            element: ELEMENTS.LEAF,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.HERBERT]: () =>
        ElementalCard.from({
            name: CARD_NAMES.HERBERT,
            description: "",
            price: 2,
            element: ELEMENTS.LEAF,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.MUSH]: () =>
        ElementalCard.from({
            name: CARD_NAMES.MUSH,
            description: "",
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
    [CARD_NAMES.DRIBBLE]: () =>
        ElementalStarterCard.from({
            name: CARD_NAMES.DRIBBLE,
            description: "",
            price: 1,
            element: ELEMENTS.DROPLET,
            img: "",
            attack: 2,
            health: 2,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.DEWY]: () =>
        ElementalCard.from({
            name: CARD_NAMES.DEWY,
            description: "",
            price: 2,
            element: ELEMENTS.DROPLET,
            img: "",
            attack: 3,
            health: 3,
            shieldCount: 0,
            boostCount: 0,
            damageCount: 0,
        }),

    [CARD_NAMES.WADE]: () =>
        ElementalCard.from({
            name: CARD_NAMES.WADE,
            description: "",
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
    [CARD_NAMES.ACORN_SQUIRE]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.ACORN_SQUIRE,
            description: "When this Elemental attacks, collect gold equal to its STR.",
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

    [CARD_NAMES.QUILL_THORNBACK]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.QUILL_THORNBACK,
            description: "When another Twig Elemental in your formation ranged attacks, add 1 boost to this Elemental.",
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

    [CARD_NAMES.SLUMBER_JACK]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.SLUMBER_JACK,
            description: "Add 1 boost to an Elemental in your Row I.",
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

    [CARD_NAMES.CAMOU_CHAMELEON]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CAMOU_CHAMELEON,
            description: "Choose up to 2 Elementals in your Row II and add 1 boost to each of them.",
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

    [CARD_NAMES.LUMBER_CLAW]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.LUMBER_CLAW,
            description: "When this Elemental melee attacks, choose up to 2 Elementals in your opponent's Row II and deal 1 DMG to each of them.",
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

    [CARD_NAMES.PINE_SNAPPER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.PINE_SNAPPER,
            description: "When an Elemental in your Row I melee attacks, add 1 to its STR during the attack for each damage counter on this Elemental.",
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

    [CARD_NAMES.SPLINTER_STINGER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SPLINTER_STINGER,
            description: "After this Elemental deals DMG by attacking, add 1 boost to it.",
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

    [CARD_NAMES.TWINE_FELINE]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TWINE_FELINE,
            description: "Discard a card from your hand, then add 2 boosts to an Elemental in your formation.",
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

    [CARD_NAMES.OAK_LUMBERTRON]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.OAK_LUMBERTRON,
            description: "Discard up to 3 cards from your hand, then add 1 boost to an Elemental in your Row I for each card you discarded.",
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
    [CARD_NAMES.GEO_WEASEL]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.GEO_WEASEL,
            description: "When an Elemental in your formation is attacked, collect 1 gold. If that Elemental is a Pebble Elemental, collect 1 additional gold.",
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

    [CARD_NAMES.GRANITE_RAMPART]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.GRANITE_RAMPART,
            description: "Draw a card if this Elemental has at least 1 shield on it.",
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

    [CARD_NAMES.ONYX_BEARER]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.ONYX_BEARER,
            description: "Add 1 shield to an Elemental in your Row I.",
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

    [CARD_NAMES.CACKLE_RIPCLAW]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CACKLE_RIPCLAW,
            description: "When an Elemental in your formation is ranged attacked, reduce the DMG dealt by 2.",
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

    [CARD_NAMES.REDSTONE]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.REDSTONE,
            description: "Add 1 boost and 1 shield to an Elemental in your formation.",
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

    [CARD_NAMES.RUBY_GUARDIAN]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.RUBY_GUARDIAN,
            description: "Discard up to 2 cards from your hand, then add 2 shields to an Elemental in your formation for each card you discarded.",
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

    [CARD_NAMES.RUNE_PUMA]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.RUNE_PUMA,
            description: "When an Elemental in your Row I is melee attacked, reduce the DMG dealt to 0.",
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

    [CARD_NAMES.STONE_DEFENDER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.STONE_DEFENDER,
            description: "Collect gold equal to the number of shields on this Elemental.",
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

    [CARD_NAMES.TERRAIN_TUMBLER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TERRAIN_TUMBLER,
            description: "When an Elemental in your Row I would be dealt DMG, this Elemental may take that DMG instead.",
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
    [CARD_NAMES.BOTANIC_FANGS]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.BOTANIC_FANGS,
            description: "When an Elemental enters your formation, collect 1 gold. If that Elemental is a Leaf Elemental, collect 1 additional gold.",
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

    [CARD_NAMES.PETAL_MAGE]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.PETAL_MAGE,
            description: "When this Elemental enters your Row II, move a card from your discard pile to your hand.",
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

    [CARD_NAMES.THORN_FENCER]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.THORN_FENCER,
            description: "Add 1 boost or 1 shield to this Elemental.",
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

    [CARD_NAMES.BAMBOO_BERSERKER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.BAMBOO_BERSERKER,
            description: "Move up to 3 cards from your discard pile to your hand.",
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

    [CARD_NAMES.FORAGE_THUMPER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.FORAGE_THUMPER,
            description: "Discard up to 3 cards from your hand, then deal DMG equal to the number of cards discarded to an Elemental in your opponent's Row I.",
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

    [CARD_NAMES.HUMMING_HERALD]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.HUMMING_HERALD,
            description: "When an Elemental enters your formation, add 1 boost to an Elemental in your Row I.",
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

    [CARD_NAMES.IGUANA_GUARD]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.IGUANA_GUARD,
            description: "When an Elemental enters your formation, add 1 shield to an Elemental in your Row I.",
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

    [CARD_NAMES.MOSS_VIPER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.MOSS_VIPER,
            description: "When this Elemental is defeated, move it to your hand instead of removing it from the game.",
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

    [CARD_NAMES.SHRUB_BEETLE]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SHRUB_BEETLE,
            description: "When an Elemental leaves your formation, add 1 boost and 1 shield to this Elemental.",
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
    [CARD_NAMES.COASTAL_COYOTE]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.COASTAL_COYOTE,
            description: "When another Droplet Elemental enters your Row II, collect 2 gold.",
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

    [CARD_NAMES.RIPTIDE_TIGER]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.RIPTIDE_TIGER,
            description: "When this Elemental enters your Row I, draw a card.",
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

    [CARD_NAMES.RIVER_ROGUE]: () =>
        ElementalWarriorStarterCard.from({
            name: CARD_NAMES.RIVER_ROGUE,
            description: "Swap the positions of an Elemental in your Row II and an Elemental in your Row III.",
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

    [CARD_NAMES.CURRENT_CONJURER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.CURRENT_CONJURER,
            description: "When another Elemental enters your Row II, add 1 boost to that Elemental.",
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

    [CARD_NAMES.ROAMING_RAZOR]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.ROAMING_RAZOR,
            description: "After this Elemental deals DMG by attacking, swap its position with a connected Elemental's.",
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

    [CARD_NAMES.SPLASH_BASILISK]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SPLASH_BASILISK,
            description: "When an Elemental enters your Row II, add 1 shield to that Elemental.",
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

    [CARD_NAMES.SURGESPHERE_MONK]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.SURGESPHERE_MONK,
            description: "When another Elemental enters your Row II, add 1 shield to that Elemental.",
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

    [CARD_NAMES.TYPHOON_FIST]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.TYPHOON_FIST,
            description: "When this Elemental enters your Row I, deal 2 DMG to an Elemental in your opponent's Row I.",
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

    [CARD_NAMES.WHIRL_WHIPPER]: () =>
        ElementalWarriorCard.from({
            name: CARD_NAMES.WHIRL_WHIPPER,
            description: "Swap the positions of an Elemental in your Row I and an Elemental in your Row II.",
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
    [CARD_NAMES.CLOSE_STRIKE]: () =>
        ItemAttackStarterCard.from({
            name: CARD_NAMES.CLOSE_STRIKE,
            description: "Deal DMG equal to the attacking Elemental's STR to an Elemental in your opponent's Row I.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    [CARD_NAMES.FAR_STRIKE]: () =>
        ItemAttackStarterCard.from({
            name: CARD_NAMES.FAR_STRIKE,
            description: "Deal DMG equal to the attacking Elemental's STR to an Elemental 2 rows away in your opponent's formation.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    [CARD_NAMES.DISTANT_DOUBLE_STRIKE]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.DISTANT_DOUBLE_STRIKE,
            description: "Choose up to 2 Elementals in your opponent's Row II and deal DMG equal to the attacking Elemental's STR -2 to each of them.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    [CARD_NAMES.FARSIGHT_FRENZY]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.FARSIGHT_FRENZY,
            description: "Deal DMG equal to the attacking Elemental's STR -1 to an Elemental 3 rows away in your opponent's formation.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2, 3],
        }),

    [CARD_NAMES.FOCUSED_FURY]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.FOCUSED_FURY,
            description: "Deal DMG equal to the attacking Elemental's STR -1 to an Elemental in your opponent's Row I. If the attacking Elemental has any number of shields on it, remove them and add 1 to its STR during the attack for each shield removed.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    [CARD_NAMES.MAGIC_ETHER_STRIKE]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.MAGIC_ETHER_STRIKE,
            description: "Deal DMG equal to the attacking Elemental's STR -1 to an Elemental in your opponent's formation.",
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    [CARD_NAMES.NATURES_WRATH]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.NATURES_WRATH,
            description: "Deal DMG equal to the attacking Elemental's STR to an Elemental in your opponent's Row I. If the attacking Elemental is a Basic Elemental, add 2 to its STR during the attack.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    [CARD_NAMES.PRIMITIVE_STRIKE]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.PRIMITIVE_STRIKE,
            description: "Deal DMG equal to the attacking Elemental's STR to an Elemental 2 rows away in your opponent's formation. If the attacking Elemental is a Basic Elemental, add 1 to its STR during the attack.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    [CARD_NAMES.PROJECTILE_BLAST]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.PROJECTILE_BLAST,
            description: "Deal DMG equal to the attacking Elemental's STR to an Elemental 2 rows away in your opponent's formation.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1, 2],
        }),

    [CARD_NAMES.REINFORCED_IMPACT]: () =>
        ItemAttackCard.from({
            name: CARD_NAMES.REINFORCED_IMPACT,
            description: "Deal DMG equal to the attacking Elemental's STR -1 to an Elemental in your opponent's Row I, then add 2 shields to the attacking Elemental.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.ATTACK,
            rowRequirement: [1],
        }),

    // ------------ INSTANTS ------------
    [CARD_NAMES.DROPLET_CHARM]: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.DROPLET_CHARM,
            description: "Play this card when a Droplet Elemental in your formation is attacked. Draw a card. If that Elemental is defeated by DMG from the attack, draw an additional card.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.LEAF_CHARM]: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.LEAF_CHARM,
            description: "Play this card when a Leaf Elemental in your formation is attacked. Deal 1 DMG to the attacking Elemental.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.PEBBLE_CHARM]: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.PEBBLE_CHARM,
            description: "Play this card when a Pebble Elemental in your formation is attacked. Add 1 shield to another Elemental in your formation.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.TWIG_CHARM]: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.TWIG_CHARM,
            description: "Play this card when a Twig Elemental in your formation is attacked. Add 1 boost to another Elemental in your formation.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.NATURAL_RESTORATION]: () =>
        ItemStarterCard.from({
            name: CARD_NAMES.NATURAL_RESTORATION,
            description: "Play this card when an Elemental in your formation is attacked. Reduce the DMG dealt by 1.",
            img: "",
            price: 1,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.MELEE_SHIELD]: () =>
        ItemCard.from({
            name: CARD_NAMES.MELEE_SHIELD,
            description: "Play this card when an Elemental in your formation is melee attacked. Reduce the DMG dealt by 2.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.NATURAL_DEFENSE]: () =>
        ItemCard.from({
            name: CARD_NAMES.NATURAL_DEFENSE,
            description: "Play this card when an Elemental in your formation is attacked. Reduce the DMG dealt by 1.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    [CARD_NAMES.RANGED_BARRIER]: () =>
        ItemCard.from({
            name: CARD_NAMES.RANGED_BARRIER,
            description: "Play this card when an Elemental in your formation is ranged attacked. Reduce the DMG dealt by 2.",
            img: "",
            price: 3,
            ability: () => [],
            itemType: ITEM_TYPES.INSTANT,
        }),

    // ------------ UTILITIES ------------
    [CARD_NAMES.ELEMENTAL_INCANTATION]: () =>
        ItemCard.from({
            name: CARD_NAMES.ELEMENTAL_INCANTATION,
            description: "Discard 3 cards from your hand. Choose up to 6 Elementals in your opponent's formation and deal 1 DMG to each of them.",
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    [CARD_NAMES.ELEMENTAL_SWAP]: () =>
        ItemCard.from({
            name: CARD_NAMES.ELEMENTAL_SWAP,
            description: "Swap the positions of an Elemental in your opponent's Row I and an Elemental in their Row II.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    [CARD_NAMES.EXCHANGE_OF_NATURE]: () =>
        ItemCard.from({
            name: CARD_NAMES.EXCHANGE_OF_NATURE,
            description: "Swap the positions of an Elemental in your Row I and an Elemental in your Row III.",
            img: "",
            price: 2,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),

    [CARD_NAMES.OBLITERATE]: () =>
        ItemCard.from({
            name: CARD_NAMES.OBLITERATE,
            description: "Remove all boosts and shields from an Elemental in your opponent's formation, then deal 2 DMG to that Elemental.",
            img: "",
            price: 5,
            ability: () => [],
            itemType: ITEM_TYPES.UTILITY,
        }),
};
