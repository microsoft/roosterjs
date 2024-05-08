import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelCode,
    ReadonlyContentModelCode,
    ReadonlyContentModelCodeFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelCode decorator
 * @param format @optional The format of this model
 */
export function createCodeDecorator(format?: ReadonlyContentModelCodeFormat): ContentModelCode {
    const code: ReadonlyContentModelCode = {
        format: { ...format },
    };

    return internalConvertToMutableType(code);
}
