import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { getObjectKeys } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function areSameFormats<T extends ContentModelFormatBase>(f1: T, f2: T) {
    if (f1 == f2) {
        return true;
    } else {
        const keys1 = getObjectKeys(f1);
        const keys2 = getObjectKeys(f2);

        return keys1.length == keys2.length && keys1.every(key => f1[key] == f2[key]);
    }
}
