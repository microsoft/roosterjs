import { getObjectKeys } from 'roosterjs-editor-dom';
import type { ContentModelFormatBase } from 'roosterjs-content-model-types';

/**
 * Check if the two given formats object are equal. This is a check to value but not to reference
 * @param f1 The first format object to check
 * @param f2 The second format object to check
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
