// import { z } from "zod";
// import type { Player } from "../models";
// import { SpaceOptionsSchema } from "./types";

// export enum AbilityAction {
//     COLLECT_GOLD = 'collect_gold',
//     DEAL_DAMAGE = 'deal_damage',
//     REDUCE_DAMAGE = 'reduce_damage',
//     MOVE_TO_DISCARD_FROM_FIELD = 'move_to_discard_from_field',
//     MOVE_TO_FIELD_FROM_DISCARD = 'move_to_field_from_discard',
//     SWAP_FIELD_POSITION = 'swap_field_position',
//     DRAW = 'draw',
//     MOVE_TO_HAND_FROM_DISCARD = 'move_to_hand_from_discard',
//     MOVE_TO_DISCARD_FROM_HAND = 'move_to_discard_from_hand',
//     MOVE_TO_HAND_FROM_FIELD = 'move_to_hand_from_field',
//     MOVE_TO_FIELD_FROM_HAND = 'move_to_field_from_hand',
//     ADD_SHIELD = 'add_shield',
//     ADD_BOOST = 'add_boost',
//     DONT_REMOVE_SHIELD = 'dont_remove_shield',
//     DONT_REMOVE_BOOST = 'dont_remove_boost',
//     REMOVE_ALL_DAMAGE = 'remove_all_damage',
// }

// export const AbilityResultSchema = z.object({
//     type: z.nativeEnum(AbilityAction),
//     player: z.any() as unknown as z.ZodType<Player>,
//     amount: z.number().optional(),
//     fieldTarget: z
//         .object({
//             team: z.enum(['self', 'enemy']),
//             position: z.array(SpaceOptionsSchema),
//         })
//         .optional(),
//     handTarget: z.array(z.number()).optional(),
//     discardTarget: z.array(z.number()).optional(),
// });

// export type AbilityResult = z.infer<typeof AbilityResultSchema>;