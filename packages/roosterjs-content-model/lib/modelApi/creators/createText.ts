import { ContentModelSegmentFormat, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createText(text: string, format?: ContentModelSegmentFormat): ContentModelText {
    return {
        segmentType: 'Text',
        text: text,
        format: format ? { ...format } : {},
    };
}
