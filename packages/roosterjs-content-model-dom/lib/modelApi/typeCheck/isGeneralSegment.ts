import type {
    ContentModelBlockGroup,
    ContentModelGeneralSegment,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelGeneralSegment,
} from 'roosterjs-content-model-types';

/**
 * Check if the given block group is a general segment
 * @param group The group to check
 */
export function isGeneralSegment(
    group: ContentModelBlockGroup | ContentModelGeneralSegment
): group is ContentModelGeneralSegment;

/**
 * Check if the given block group is a general segment (Readonly)
 * @param group The group to check
 */
export function isGeneralSegment(
    group: ReadonlyContentModelBlockGroup | ReadonlyContentModelGeneralSegment
): group is ReadonlyContentModelGeneralSegment;

export function isGeneralSegment(
    group: ReadonlyContentModelBlockGroup | ReadonlyContentModelGeneralSegment
): group is ContentModelGeneralSegment {
    return (
        group.blockGroupType == 'General' &&
        (<ContentModelGeneralSegment>group).segmentType == 'General'
    );
}
