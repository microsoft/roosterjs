import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockGroupBase } from '../../publicTypes/group/ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';

/**
 * @internal
 */
export type TypeOfBlockGroup<
    T extends ContentModelBlockGroup
> = T extends ContentModelBlockGroupBase<infer U> ? U : never;

/**
 * @internal
 */
export function getClosestAncestorBlockGroupIndex<T extends ContentModelBlockGroup>(
    path: ContentModelBlockGroup[],
    blockGroupTypes: TypeOfBlockGroup<T>[],
    stopTypes: ContentModelBlockGroupType[] = []
): number {
    for (let i = 0; i < path.length; i++) {
        const group = path[i];

        if ((blockGroupTypes as string[]).indexOf(group.blockGroupType) >= 0) {
            return i;
        } else if (stopTypes.indexOf(group.blockGroupType) >= 0) {
            // Do not go across boundary specified by stopTypes.
            // For example, in most case we will set table as the boundary,
            // in order to allow modify list item under a table when the table itself is in another list item
            // Although this is not very likely to happen in most case, but we still need to handle it
            return -1;
        }
    }

    return -1;
}
