import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockGroupBase } from '../../publicTypes/group/ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelSelection } from '../selection/getSelections';

/**
 * @internal
 */
export type OperationalBlocks<T extends ContentModelBlockGroup> = T | ContentModelSelection;

/**
 * @internal
 */
export type TypeOfBlockGroup<
    T extends ContentModelBlockGroup
> = T extends ContentModelBlockGroupBase<infer U> ? U : never;

/**
 * @internal
 */
export function getOperationalBlocks<T extends ContentModelBlockGroup>(
    selections: ContentModelSelection[],
    blockGroupTypes: TypeOfBlockGroup<T>[],
    stopTypes: ContentModelBlockGroupType[] = ['TableCell'],
    deepFirst?: boolean
): OperationalBlocks<T>[] {
    const result: OperationalBlocks<T>[] = [];

    selections.forEach(p => {
        const findSequence = deepFirst ? blockGroupTypes.map(type => [type]) : [blockGroupTypes];

        for (let i = 0; i < findSequence.length; i++) {
            const group = getClosestAncestorBlockGroupWithType(p, findSequence[i], stopTypes);

            if (group) {
                if (result.indexOf(group) < 0) {
                    result.push(group);
                }
                break;
            } else if (i == findSequence.length - 1) {
                result.push(p);
                break;
            }
        }
    });

    return result;
}

export function getClosestAncestorBlockGroupWithType<T extends ContentModelBlockGroup>(
    selections: ContentModelSelection,
    blockGroupTypes: TypeOfBlockGroup<T>[],
    stopTypes: ContentModelBlockGroupType[]
): T | null {
    for (let i = 0; i < selections.path.length; i++) {
        const group = selections.path[i];

        if ((blockGroupTypes as string[]).indexOf(group.blockGroupType) >= 0) {
            return group as T;
        } else if (stopTypes.indexOf(group.blockGroupType) >= 0) {
            // Do not go across boundary specified by stopTypes.
            // For example, in most case we will set table as the boundary,
            // in order to allow modify list item under a table when the table itself is in another list item
            // Although this is not very likely to happen in most case, but we still need to handle it
            return null;
        }
    }

    return null;
}
