import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelLink,
    ReadonlyContentModelHyperLinkFormat,
    ReadonlyContentModelLink,
    ReadonlyDatasetFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelLink decorator
 * @param format @optional The format of this model
 */
export function createLinkDecorator(
    format?: ReadonlyContentModelHyperLinkFormat,
    dataset?: ReadonlyDatasetFormat
): ContentModelLink {
    const result: ReadonlyContentModelLink = {
        format: { ...format },
        dataset: { ...dataset },
    };

    return internalConvertToMutableType(result);
}
