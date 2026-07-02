import { addCode, addData, addLink } from '../common/addDecorators';
import type {
    ContentModelSegmentFormat,
    ContentModelText,
    ReadonlyContentModelCode,
    ReadonlyContentModelData,
    ReadonlyContentModelLink,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelText model
 * @param text Text of this model
 * @param format @optional The format of this model
 * @param link @optional The link decorator
 * @param code @optional The code decorator
 * @param data @optional The data decorator
 */
export function createText(
    text: string,
    format?: Readonly<ContentModelSegmentFormat>,
    link?: ReadonlyContentModelLink,
    code?: ReadonlyContentModelCode,
    data?: ReadonlyContentModelData
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

    if (data) {
        addData(result, data);
    }

    return result;
}
