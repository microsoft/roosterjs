import type {
    ContentModelBlockGroup,
    ReadonlyContentModelBlockGroup,
} from '../contentModel/blockGroup/ContentModelBlockGroup';
import type {
    ContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from '../contentModel/blockGroup/ContentModelBlockGroupBase';

/**
 * Retrieve block group type string from a given block group
 */
export type TypeOfBlockGroup<
    T extends ContentModelBlockGroup | ReadonlyContentModelBlockGroup
> = T extends ContentModelBlockGroupBase<infer U> | ReadonlyContentModelBlockGroupBase<infer U>
    ? U
    : never;
