import { Decklist } from "@shared-types";
import { ALL_CARDS } from "../../../shared-types/src/cards";
import { CARD_NAMES } from "../../../shared-types/src/card-names";

export const TwigDeck = Decklist.from({
    sage: ALL_CARDS[CARD_NAMES.CEDAR](),
    champions: {
        level4: ALL_CARDS[CARD_NAMES.VIX_VANGUARD](),
        level6: ALL_CARDS[CARD_NAMES.HORNED_HOLLOW](),
        level8: ALL_CARDS[CARD_NAMES.CALAMITY_LEOPARD](),
    },
    warriors: [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK](), ALL_CARDS[CARD_NAMES.SLUMBER_JACK]()],
    basic: ALL_CARDS[CARD_NAMES.TIMBER](),
    items: [
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.FAR_STRIKE](),
        ALL_CARDS[CARD_NAMES.NATURAL_RESTORATION](),
        ALL_CARDS[CARD_NAMES.TWIG_CHARM](),
    ],
});

export const PebbleDeck = Decklist.from({
    sage: ALL_CARDS[CARD_NAMES.GRAVEL](),
    champions: {
        level4: ALL_CARDS[CARD_NAMES.JADE_TITAN](),
        level6: ALL_CARDS[CARD_NAMES.BOULDERHIDE_BRUTE](),
        level8: ALL_CARDS[CARD_NAMES.OXEN_AVENGER](),
    },
    warriors: [ALL_CARDS[CARD_NAMES.GEO_WEASEL](), ALL_CARDS[CARD_NAMES.GRANITE_RAMPART](), ALL_CARDS[CARD_NAMES.ONYX_BEARER]()],
    basic: ALL_CARDS[CARD_NAMES.COBBLE](),
    items: [
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.FAR_STRIKE](),
        ALL_CARDS[CARD_NAMES.NATURAL_RESTORATION](),
        ALL_CARDS[CARD_NAMES.PEBBLE_CHARM](),
    ],
});

export const LeafDeck = Decklist.from({
    sage: ALL_CARDS[CARD_NAMES.PORELLA](),
    champions: {
        level4: ALL_CARDS[CARD_NAMES.AGILE_ASSAILANT](),
        level6: ALL_CARDS[CARD_NAMES.BOG_BLIGHT](),
        level8: ALL_CARDS[CARD_NAMES.KOMODO_KIN](),
    },
    warriors: [ALL_CARDS[CARD_NAMES.BOTANIC_FANGS](), ALL_CARDS[CARD_NAMES.PETAL_MAGE](), ALL_CARDS[CARD_NAMES.THORN_FENCER]()],
    basic: ALL_CARDS[CARD_NAMES.SPROUT](),
    items: [
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.FAR_STRIKE](),
        ALL_CARDS[CARD_NAMES.NATURAL_RESTORATION](),
        ALL_CARDS[CARD_NAMES.LEAF_CHARM](),
    ],
});

export const DropletDeck = Decklist.from({
    sage: ALL_CARDS[CARD_NAMES.TORRENT](),
    champions: {
        level4: ALL_CARDS[CARD_NAMES.TIDE_TURNER](),
        level6: ALL_CARDS[CARD_NAMES.KING_CRUSTACEAN](),
        level8: ALL_CARDS[CARD_NAMES.FROSTFALL_EMPEROR](),
    },
    warriors: [ALL_CARDS[CARD_NAMES.COASTAL_COYOTE](), ALL_CARDS[CARD_NAMES.RIPTIDE_TIGER](), ALL_CARDS[CARD_NAMES.RIVER_ROGUE]()],
    basic: ALL_CARDS[CARD_NAMES.DRIBBLE](),
    items: [
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.CLOSE_STRIKE](),
        ALL_CARDS[CARD_NAMES.FAR_STRIKE](),
        ALL_CARDS[CARD_NAMES.NATURAL_RESTORATION](),
        ALL_CARDS[CARD_NAMES.DROPLET_CHARM](),
    ],
});
