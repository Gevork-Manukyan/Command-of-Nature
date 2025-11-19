import { z } from "zod";
import { SpaceOptionsSchema } from "./space-options";

export enum AbilityAction {
    COLLECT_GOLD = 'collect_gold',
    DEAL_DAMAGE = 'deal_damage',
    REDUCE_DAMAGE = 'reduce_damage',
    MOVE_TO_DISCARD_FROM_FIELD = 'move_to_discard_from_field',
    MOVE_TO_FIELD_FROM_DISCARD = 'move_to_field_from_discard',
    SWAP_FIELD_POSITION = 'swap_field_position',
    DRAW = 'draw',
    MOVE_TO_HAND_FROM_DISCARD = 'move_to_hand_from_discard',
    MOVE_TO_DISCARD_FROM_HAND = 'move_to_discard_from_hand',
    MOVE_TO_HAND_FROM_FIELD = 'move_to_hand_from_field',
    MOVE_TO_FIELD_FROM_HAND = 'move_to_field_from_hand',
    ADD_SHIELD = 'add_shield',
    ADD_BOOST = 'add_boost',
    DONT_REMOVE_SHIELD = 'dont_remove_shield',
    DONT_REMOVE_BOOST = 'dont_remove_boost',
    REMOVE_ALL_DAMAGE = 'remove_all_damage',
}

const FieldTargetSchema = z.object({
    team: z.enum(['self', 'enemy']),
    position: z.array(SpaceOptionsSchema),
});

const CollectGoldEffectSchema = z.object({
    type: z.literal(AbilityAction.COLLECT_GOLD),
    amount: z.number(),
});

const DealDamageEffectSchema = z.object({
    type: z.literal(AbilityAction.DEAL_DAMAGE),
    amount: z.number(),
    fieldTarget: FieldTargetSchema,
});

const ReduceDamageEffectSchema = z.object({
    type: z.literal(AbilityAction.REDUCE_DAMAGE),
    fieldTarget: FieldTargetSchema,
    amount: z.number().optional(),
});

const MoveToDiscardFromFieldEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_DISCARD_FROM_FIELD),
    fieldTarget: FieldTargetSchema,
});

const MoveToFieldFromDiscardEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_FIELD_FROM_DISCARD),
    fieldTarget: FieldTargetSchema,
    discardTarget: z.array(z.number()),
});

const SwapFieldPositionEffectSchema = z.object({
    type: z.literal(AbilityAction.SWAP_FIELD_POSITION),
    fieldTarget: FieldTargetSchema,
});

const DrawEffectSchema = z.object({
    type: z.literal(AbilityAction.DRAW),
    amount: z.number(),
});

const MoveToHandFromDiscardEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_HAND_FROM_DISCARD),
    discardTarget: z.array(z.number()),
});

const MoveToDiscardFromHandEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_DISCARD_FROM_HAND),
    handTarget: z.array(z.number()),
});

const MoveToHandFromFieldEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_HAND_FROM_FIELD),
    fieldTarget: FieldTargetSchema,
});

const MoveToFieldFromHandEffectSchema = z.object({
    type: z.literal(AbilityAction.MOVE_TO_FIELD_FROM_HAND),
    fieldTarget: FieldTargetSchema,
    handTarget: z.array(z.number()),
});

const AddShieldEffectSchema = z.object({
    type: z.literal(AbilityAction.ADD_SHIELD),
    fieldTarget: FieldTargetSchema,
    amount: z.number(),
});

const AddBoostEffectSchema = z.object({
    type: z.literal(AbilityAction.ADD_BOOST),
    fieldTarget: FieldTargetSchema,
    amount: z.number(),
});

const DontRemoveShieldEffectSchema = z.object({
    type: z.literal(AbilityAction.DONT_REMOVE_SHIELD),
});

const DontRemoveBoostEffectSchema = z.object({
    type: z.literal(AbilityAction.DONT_REMOVE_BOOST),
});

const RemoveAllDamageEffectSchema = z.object({
    type: z.literal(AbilityAction.REMOVE_ALL_DAMAGE),
    fieldTarget: FieldTargetSchema,
});

export const GameEffectSchema = z.discriminatedUnion('type', [
    CollectGoldEffectSchema,
    DealDamageEffectSchema,
    ReduceDamageEffectSchema,
    MoveToDiscardFromFieldEffectSchema,
    MoveToFieldFromDiscardEffectSchema,
    SwapFieldPositionEffectSchema,
    DrawEffectSchema,
    MoveToHandFromDiscardEffectSchema,
    MoveToDiscardFromHandEffectSchema,
    MoveToHandFromFieldEffectSchema,
    MoveToFieldFromHandEffectSchema,
    AddShieldEffectSchema,
    AddBoostEffectSchema,
    DontRemoveShieldEffectSchema,
    DontRemoveBoostEffectSchema,
    RemoveAllDamageEffectSchema,
]);

export type GameEffect = z.infer<typeof GameEffectSchema>;