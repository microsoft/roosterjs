import { ContentModelSegmentFormat, ContentModelText } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelText model
 * @param text Text of this model
 * @param format @optional The format of this model
 */
export function createText(text: string, format?: ContentModelSegmentFormat): ContentModelText {
    return {
        segmentType: 'Text',
        text: text,
        format: format ? { ...format } : {},
    };
}
