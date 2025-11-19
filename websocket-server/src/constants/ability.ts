import { isElementalCard } from "../lib";
import { ActiveConGame, Player } from "../models";
import { InternalServerError, InvalidCardTypeError } from "../custom-errors";
import { ElementalCard, AbilityAction, GameEffect, SpaceOption } from "@shared-types";

function getTeam(game: ActiveConGame, player: Player) {
    const team = game.getPlayerTeam(player.socketId);
    if (!team) throw new InternalServerError("Team not found");
    return team;
}

export function processAbility(game: ActiveConGame, effects: GameEffect[], player: Player) {
    for (const effect of effects) {
        switch (effect.type) {
            case AbilityAction.COLLECT_GOLD:
                collectGold(game, player, effect.amount);
                break;
            case AbilityAction.DEAL_DAMAGE:
                dealDamage(game, player, effect.fieldTarget, effect.amount);
                break;
            case AbilityAction.REDUCE_DAMAGE:
                reduceDamage(game, player, effect.fieldTarget, effect.amount);
                break;
            case AbilityAction.MOVE_TO_DISCARD_FROM_FIELD:
                moveToDiscardFromField(game, player, effect.fieldTarget);
                break;
            case AbilityAction.MOVE_TO_FIELD_FROM_DISCARD:
                moveToFieldFromDiscard(game, player, effect.fieldTarget, effect.discardTarget);
                break;
            case AbilityAction.SWAP_FIELD_POSITION:
                swapFieldPosition(game, player, effect.fieldTarget);
                break;
            case AbilityAction.DRAW:
                draw(player, effect.amount);
                break;
            case AbilityAction.MOVE_TO_HAND_FROM_DISCARD:
                moveToHandFromDiscard(player, effect.discardTarget);
                break;
            case AbilityAction.MOVE_TO_DISCARD_FROM_HAND:
                moveToDiscardFromHand(player, effect.handTarget);
                break;
            case AbilityAction.MOVE_TO_HAND_FROM_FIELD:
                moveToHandFromField(game, player, effect.fieldTarget);
                break;
            case AbilityAction.MOVE_TO_FIELD_FROM_HAND:
                moveToFieldFromHand(game, player, effect.fieldTarget, effect.handTarget);
                break;
            case AbilityAction.ADD_SHIELD:
                addShield(game, player, effect.fieldTarget, effect.amount);
                break;
            case AbilityAction.ADD_BOOST:
                addBoost(game, player, effect.fieldTarget, effect.amount);
                break;
            case AbilityAction.DONT_REMOVE_SHIELD:
                dontRemoveShield();
                break;
            case AbilityAction.DONT_REMOVE_BOOST:
                dontRemoveBoost();
                break;
            case AbilityAction.REMOVE_ALL_DAMAGE:
                removeAllDamage(game, player, effect.fieldTarget);
                break;
        }
    }
}

/**
 * Collects gold for a team
 * @param game The current game
 * @param player The player who triggered the ability
 * @param amount The amount of gold to collect 
 */
function collectGold(game: ActiveConGame, player: Player, amount: number) {
    const team = getTeam(game, player);
    team.addGold(amount);
}

type FieldTarget = {
    team: 'self' | 'enemy';
    position: SpaceOption[];
};

/**
 * Deals damage to a card on the battlefield
 * @param game The current game
 * @param player The player who triggered the ability
 * @param fieldTarget The target on the battlefield to deal damage to
 * @param amount The amount of damage to deal 
 */
function dealDamage(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, amount: number) {
    const playerTeam = getTeam(game, player);
    const targetTeam = fieldTarget.team === 'self' ? playerTeam : game.getOpposingTeam(playerTeam);
    fieldTarget.position.forEach((position: SpaceOption) => {
        targetTeam.damageCardAtPosition(position, amount);
    });
}

function reduceDamage(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, amount?: number) {
    // TODO: Implement reduce damage logic
}

/**
 * Moves a card from the battlefield to the discard pile
 * @param game The current game
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to the discard pile
 */
function moveToDiscardFromField(game: ActiveConGame, player: Player, fieldTarget: FieldTarget) {
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to discard");

    fieldTarget.position.forEach((position: SpaceOption) => {
        const team = getTeam(game, player);
        const removedCard = team.getBattlefield().removeCard(position);
        player.addCardToDiscardPile(removedCard);
    });
}

/**
 * Moves a card from the discard pile to the battlefield
 * @param game The current game
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to; must be a single position
 * @param discardTarget The target in the discard pile to move from; must be a single position
 */
function moveToFieldFromDiscard(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, discardTarget: number[]) {
    if (fieldTarget.position.length !== 1) throw new InternalServerError("Field target position is not a single position");
    if (discardTarget.length !== 1) throw new InternalServerError("Discard target position is not a single position");
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to field");

    const targetIndex = discardTarget[0];
    const targetCard = player.discardPile[targetIndex];
    if (!isElementalCard(targetCard)) throw new InvalidCardTypeError("Card is not an ElementalCard");
    
    const removedCard = player.removeCardFromDiscardPile(targetIndex) as ElementalCard;

    const team = getTeam(game, player);
    team.getBattlefield().addCard(removedCard, fieldTarget.position[0]);
}

/**
 * Swaps the positions of two cards on the battlefield
 * @param game The current game
 * @param player The player that is swapping the cards
 * @param fieldTarget The two positions on the battlefield to swap
 */
function swapFieldPosition(game: ActiveConGame, player: Player, fieldTarget: FieldTarget) {
    if (fieldTarget.position.length !== 2) throw new InternalServerError("Field target position is not two positions");

    const team = getTeam(game, player);
    team.getBattlefield().swapCards(fieldTarget.position[0], fieldTarget.position[1]);
}

/**
 * Draws a card from the deck
 * @param player The player that is drawing the card
 * @param amount The amount of cards to draw
 */
function draw(player: Player, amount: number) {
    for (let i = 0; i < amount; i++) {
        player.drawCard();
    }
}

/**
 * Moves a card from the discard pile to the hand
 * @param player The player that is moving the card
 * @param discardTarget The target in the discard pile to move from
 */
function moveToHandFromDiscard(player: Player, discardTarget: number[]) {
    discardTarget.forEach(targetIndex => {
        const removedCard = player.removeCardFromDiscardPile(targetIndex);
        player.addCardToHand(removedCard);
    });
}

/**
 * Moves a card from the hand to the discard pile
 * @param player The player that is moving the card
 * @param handTarget The target in the hand to move from
 */
function moveToDiscardFromHand(player: Player, handTarget: number[]) {
    handTarget.forEach(targetIndex => {
        const removedCard = player.removeCardFromHand(targetIndex);
        player.addCardToDiscardPile(removedCard);
    });
}

/**
 * Moves a card from the battlefield to the hand
 * @param game The current game
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to the hand
 */
function moveToHandFromField(game: ActiveConGame, player: Player, fieldTarget: FieldTarget) {
    fieldTarget.position.forEach((position: SpaceOption) => {
        const team = getTeam(game, player);
        const removedCard = team.getBattlefield().removeCard(position);
        player.addCardToHand(removedCard);
    });
}

/**
 * Moves a card from the hand to the battlefield
 * @param game The current game
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to; must be a single position
 * @param handTarget The target in the hand to move from; must be a single position
 */
function moveToFieldFromHand(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, handTarget: number[]) {
    if (handTarget.length !== 1) throw new InternalServerError("Hand target position is not a single position");
    if (fieldTarget.position.length !== 1) throw new InternalServerError("Field target position is not a single position");
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to field");

    const targetIndex = handTarget[0];
    const targetCard = player.hand[targetIndex];
    if (!isElementalCard(targetCard)) throw new InvalidCardTypeError("Card is not an ElementalCard");
    
    const removedCard = player.removeCardFromHand(targetIndex) as ElementalCard;
    const team = getTeam(game, player);
    team.getBattlefield().addCard(removedCard, fieldTarget.position[0]);
}

/**
 * Adds shield to a card on the battlefield
 * @param game The current game
 * @param player The player that is adding shield
 * @param fieldTarget The target on the battlefield to add shield to
 * @param amount The amount of shield to add
 */
function addShield(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, amount: number) {
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot add shield to enemy card");

    fieldTarget.position.forEach((position: SpaceOption) => {
        const team = getTeam(game, player);
        team.getBattlefield().addShieldToCardAtPosition(position, amount);
    });
}

/**
 * Adds boost to a card on the battlefield
 * @param game The current game
 * @param player The player that is adding boost
 * @param fieldTarget The target on the battlefield to add boost to
 * @param amount The amount of boost to add
 */
function addBoost(game: ActiveConGame, player: Player, fieldTarget: FieldTarget, amount: number) {
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot add boost to enemy card");

    fieldTarget.position.forEach((position: SpaceOption) => {
        const team = getTeam(game, player);
        team.getBattlefield().addBoostToCardAtPosition(position, amount);
    });
}

function dontRemoveShield() {
    // TODO: Implement dont remove shield logic
}

function dontRemoveBoost() {
    // TODO: Implement dont remove boost logic
}

/**
 * Removes all damage from a card on the battlefield
 * @param game The current game
 * @param player The player that is removing damage
 * @param fieldTarget The target on the battlefield to clear damage from
 */
function removeAllDamage(game: ActiveConGame, player: Player, fieldTarget: FieldTarget) {
    fieldTarget.position.forEach((position: SpaceOption) => {
        const team = getTeam(game, player);
        team.getBattlefield().clearDamage(position);
    });
}

enum PlayerActionType {
    CARD_ENTERS_FIELD = 'card_enters_field',
    CARD_LEAVES_FIELD = 'card_leaves_field',
    ATTACK = 'attack',
    MELEE_ATTACK = 'melee_attack',
    RANGE_ATTACK = 'range_attack',
    IS_ATTACKED = 'is_attacked',
    IS_MELEE_ATTACKED = 'is_melee_attacked',
    IS_RANGE_ATTACKED = 'is_range_attacked',
    DEAL_DAMAGE_WITH_ATTACK = 'deal_damage_with_attack',
    TAKE_DAMAGE = 'take_damage',
    ENTER_ROW = 'enter_row',
    DEFEAT_ENEMY = 'defeat_enemy',
    IS_DEFEATED = 'is_defeated',
    ADD_SHIELD = 'add_shield',
    ADD_BOOST = 'add_boost',
    REMOVE_SHIELD = 'remove_shield',
    REMOVE_BOOST = 'remove_boost',
}

/*
// TODO: New idea: this enum will live somewhere else. Card abilities will return an object 
with keys and values that determine what kind of action needs to be done
e.g. { type: ActionType.COLLECT_GOLD, amount: 10 }

Then a processAbility function will take in the action object and perform the action

For instants, there will be a flag on each player that indicates if they have an instant in their hand
If they do, then before processing action, prompt player if they wanna use instant card

For triggers, each action a player does will have a value in an enum
When a card enters the field, get all of it's triggers and add them to a list. Triggers are values from the same actions enum
When an action is done, check if any triggers are activated 
*/