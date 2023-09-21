import { addCode, addLink } from '../common/addDecorators';
import {
    ContentModelCode,
    ContentModelLink,
    ContentModelSegmentFormat,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelText model
 * @param text Text of this model
 * @param format @optional The format of this model
 * @param link @optional The link decorator
 * @param code @option The code decorator
 */
export function createText(
    text: string,
    format?: ContentModelSegmentFormat,
    link?: ContentModelLink,
    code?: ContentModelCode
): ContentModelText {
    const result: ContentModelText = {
        segmentType: 'Text',
        text: text,
        format: format ? { ...format } : {},
    };

    if (link) {
        addLink(result, link);
    }

    if (code) {
        addCode(result, code);
    }

    return result;
}
