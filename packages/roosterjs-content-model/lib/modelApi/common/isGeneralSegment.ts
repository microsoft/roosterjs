import { ContentModelBlockGroup, ContentModelGeneralSegment } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function isGeneralSegment(
    group: ContentModelBlockGroup | ContentModelGeneralSegment
): group is ContentModelGeneralSegment {
    return (
        group.blockGroupType == 'General' &&
        (<ContentModelGeneralSegment>group).segmentType == 'General'
    );
}
