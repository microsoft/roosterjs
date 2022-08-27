import { ContentModelText } from '../../publicTypes/segment/ContentModelText';

/**
 * @internal
 */
export function createText(text: string): ContentModelText {
    return {
        segmentType: 'Text',
        text: text,
    };
}
