import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelBlockGroupBase } from '../group/ContentModelBlockGroupBase';

/**
 * Retrieve block group type string from a given block group
 */
export type TypeOfBlockGroup<
    T extends ContentModelBlockGroup
> = T extends ContentModelBlockGroupBase<infer U> ? U : never;
