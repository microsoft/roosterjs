import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelBr,
    ReadonlyContentModelBr,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelBr model
 * @param format @optional The format of this model
 */
export function createBr(format?: ReadonlyContentModelSegmentFormat): ContentModelBr {
    const result: ReadonlyContentModelBr = {
        segmentType: 'Br',
        format: { ...format },
    };

    return internalConvertToMutableType(result);
}
