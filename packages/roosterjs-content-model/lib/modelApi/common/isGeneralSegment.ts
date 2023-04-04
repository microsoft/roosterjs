import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';

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
