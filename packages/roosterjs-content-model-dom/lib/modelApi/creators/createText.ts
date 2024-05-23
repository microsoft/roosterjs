import { addCode, addLink } from '../common/addDecorators';
import type {
    ContentModelSegmentFormat,
    ContentModelText,
    ReadonlyContentModelCode,
    ReadonlyContentModelLink,
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
    format?: Readonly<ContentModelSegmentFormat>,
    link?: ReadonlyContentModelLink,
    code?: ReadonlyContentModelCode
): ContentModelText {
    const result: ContentModelText = {
        segmentType: 'Text',
        text: text,
        format: { ...format },
    };

    if (link) {
        addLink(result, link);
    }

    if (code) {
        addCode(result, code);
    }

    return result;
}
