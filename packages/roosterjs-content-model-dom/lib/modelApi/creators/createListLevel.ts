import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelListLevel,
    ReadonlyContentModelListItemLevelFormat,
    ReadonlyContentModelListLevel,
    ReadonlyDatasetFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelListLevel model
 * @param listType Tag name of the list, either OL or UL
 * @param format @optional The format of this model
 * @param dataset @optional The dataset of this model
 */
export function createListLevel(
    listType: 'OL' | 'UL',
    format?: ReadonlyContentModelListItemLevelFormat,
    dataset?: ReadonlyDatasetFormat
): ContentModelListLevel {
    const result: ReadonlyContentModelListLevel = {
        listType,
        format: { ...format },
        dataset: { ...dataset },
    };

    return internalConvertToMutableType(result);
}
