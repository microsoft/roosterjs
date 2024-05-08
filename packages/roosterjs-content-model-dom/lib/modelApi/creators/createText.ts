import { createCodeDecorator } from './createCodeDecorator';
import { createLinkDecorator } from './createLinkDecorator';
import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelCode,
    ContentModelLink,
    ContentModelText,
    ReadonlyContentModelSegmentFormat,
    ReadonlyContentModelText,
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
    format?: ReadonlyContentModelSegmentFormat,
    link?: ContentModelLink,
    code?: ContentModelCode
): ContentModelText {
    const result: ReadonlyContentModelText = Object.assign(
        <ReadonlyContentModelText>{
            segmentType: 'Text',
            text: text,
            format: { ...format },
        },
        link ? { link: createLinkDecorator(link.format, link.dataset) } : undefined,
        code ? { code: createCodeDecorator(code.format) } : undefined
    );

    return internalConvertToMutableType(result);
}
