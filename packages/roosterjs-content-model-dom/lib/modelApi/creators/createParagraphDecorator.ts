import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelParagraphDecorator,
    ReadonlyContentModelParagraphDecorator,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelParagraphDecorator model
 * @param tagName Tag name of this decorator
 * @param format @optional The format of this model
 */
export function createParagraphDecorator(
    tagName: string,
    format?: ReadonlyContentModelSegmentFormat
): ContentModelParagraphDecorator {
    const result: ReadonlyContentModelParagraphDecorator = {
        tagName: tagName.toLocaleLowerCase(),
        format: { ...format },
    };

    return internalConvertToMutableType(result);
}
