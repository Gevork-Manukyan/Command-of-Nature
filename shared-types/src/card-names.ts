export const CARD_NAMES = {
    // ------------ SAGES ------------
    CEDAR: "Cedar",
    GRAVEL: "Gravel",
    PORELLA: "Porella",
    TORRENT: "Torrent",

    // ------------ CHAMPIONS ------------
    // Twigs
    VIX_VANGUARD: "Vix Vanguard",
    HORNED_HOLLOW: "Horned Hollow",
    CALAMITY_LEOPARD: "Calamity Leopard",

    // Pebbles
    JADE_TITAN: "Jade Titan",
    BOULDERHIDE_BRUTE: "Boulderhide Brute",
    OXEN_AVENGER: "Oxen Avenger",

    // Leafs
    AGILE_ASSAILANT: "Agile Assailant",
    BOG_BLIGHT: "Bog Blight",
    KOMODO_KIN: "Komodo Kin",

    // Droplets
    TIDE_TURNER: "Tide Turner",
    KING_CRUSTACEAN: "King Crustacean",
    FROSTFALL_EMPEROR: "Frostfall Emperor",

    // ------------ BASICS ------------
    // Twigs
    TIMBER: "Timber",
    BRUCE: "Bruce",
    WILLOW: "Willow",

    // Pebbles
    COBBLE: "Cobble",
    FLINT: "Flint",
    ROCCO: "Rocco",

    // Leafs
    SPROUT: "Sprout",
    HERBERT: "Herbert",
    MUSH: "Mush",

    // Droplets
    DRIBBLE: "Dribble",
    DEWY: "Dewy",
    WADE: "Wade",

    // ------------ WARRIORS ------------
    // Twigs
    ACORN_SQUIRE: "Acorn Squire",
    QUILL_THORNBACK: "Quill Thornback",
    SLUMBER_JACK: "Slumber Jack",
    CAMOU_CHAMELEON: "Camou Chameleon",
    LUMBER_CLAW: "Lumber Claw",
    PINE_SNAPPER: "Pine Snapper",
    SPLINTER_STINGER: "Splinter Stinger",
    TWINE_FELINE: "TwineFeline",
    OAK_LUMBERTRON: "Oak Lumbertron",

    // Pebbles
    GEO_WEASEL: "Geo Weasel",
    GRANITE_RAMPART: "Granite Rampart",
    ONYX_BEARER: "Onyx Bearer",
    CACKLE_RIPCLAW: "Cackle Ripclaw",
    REDSTONE: "Redstone",
    RUBY_GUARDIAN: "Ruby Guardian",
    RUNE_PUMA: "Rune Puma",
    STONE_DEFENDER: "Stone Defender",
    TERRAIN_TUMBLER: "Terrain Tumbler",

    // Leafs
    BOTANIC_FANGS: "Botanic Fangs",
    PETAL_MAGE: "Petal Mage",
    THORN_FENCER: "Thorn Fencer",
    BAMBOO_BERSERKER: "Bamboo Berserker",
    FORAGE_THUMPER: "Forage Thumper",
    HUMMING_HERALD: "Humming Herald",
    IGUANA_GUARD: "Iguana Guard",
    MOSS_VIPER: "Moss Viper",
    SHRUB_BEETLE: "Shrub Beetle",

    // Droplets
    COASTAL_COYOTE: "Coastal Coyote",
    RIPTIDE_TIGER: "Riptide Tiger",
    RIVER_ROGUE: "River Rogue",
    CURRENT_CONJURER: "Current Conjurer",
    ROAMING_RAZOR: "Roaming Razor",
    SPLASH_BASILISK: "Splash Basilisk",
    SURGESPHERE_MONK: "Surgesphere Monk",
    TYPHOON_FIST: "Typhoon Fist",
    WHIRL_WHIPPER: "Whirl Whipper",

    // ------------ ATTACKS ------------
    CLOSE_STRIKE: "Close Strike",
    FAR_STRIKE: "Far Strike",
    DISTANT_DOUBLE_STRIKE: "Distant Double Strike",
    FARSIGHT_FRENZY: "Farsight Frenzy",
    FOCUSED_FURY: "Focused Fury",
    MAGIC_ETHER_STRIKE: "Magic Ether Strike",
    NATURES_WRATH: "Nature's Wrath",
    PRIMITIVE_STRIKE: "Primitive Strike",
    PROJECTILE_BLAST: "Projectile Blast",
    REINFORCED_IMPACT: "Reinforced Impact",

    // ------------ INSTANTS ------------
    DROPLET_CHARM: "Droplet Charm",
    LEAF_CHARM: "Leaf Charm",
    PEBBLE_CHARM: "Pebble Charm",
    TWIG_CHARM: "Twig Charm",
    NATURAL_RESTORATION: "Natural Restoration",
    MELEE_SHIELD: "Melee Shield",
    NATURAL_DEFENSE: "Natural Defense",
    RANGED_BARRIER: "Ranged Barrier",

    // ------------ UTILITIES ------------
    ELEMENTAL_INCANTATION: "Elemental Incantation",
    ELEMENTAL_SWAP: "Elemental Swap",
    EXCHANGE_OF_NATURE: "Exchange of Nature",
    OBLITERATE: "Obliterate",
} as const;

export type CardName = (typeof CARD_NAMES)[keyof typeof CARD_NAMES];