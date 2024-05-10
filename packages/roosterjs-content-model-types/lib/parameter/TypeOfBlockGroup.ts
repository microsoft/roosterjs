import type { ContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ContentModelBlockGroupBase } from '../contentModel/blockGroup/ContentModelBlockGroupBase';

/**
 * Retrieve block group type string from a given block group
 */
export type TypeOfBlockGroup<
    T extends ContentModelBlockGroup
> = T extends ContentModelBlockGroupBase<infer U> ? U : never;
