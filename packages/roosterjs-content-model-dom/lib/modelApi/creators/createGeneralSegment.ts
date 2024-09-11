import type {
    ContentModelGeneralSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelGeneralSegment model
 * @param element The original DOM element
 * @param format @optional The format of this model
 */
export function createGeneralSegment(
    element: HTMLElement,
    format?: Readonly<ContentModelSegmentFormat>
): ContentModelGeneralSegment {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        segmentType: 'General',
        format: { ...format },
        blocks: [],
        element: element,
    };
}
