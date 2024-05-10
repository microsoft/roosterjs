import type { ContentModelFormatBase, MutableContentModel } from 'roosterjs-content-model-types';

export function createMutableFormat<T extends ContentModelFormatBase>(
    ...existingFormats: (T | undefined)[]
): MutableContentModel<T> {
    return Object.assign({} as MutableContentModel<T>, ...existingFormats);
}
