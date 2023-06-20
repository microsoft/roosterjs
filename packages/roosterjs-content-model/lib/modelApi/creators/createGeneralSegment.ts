import {
    ContentModelGeneralSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createGeneralSegment(
    element: HTMLElement,
    format?: ContentModelSegmentFormat
): ContentModelGeneralSegment {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        segmentType: 'General',
        format: format ? { ...format } : {},
        blocks: [],
        element: element,
    };
}
