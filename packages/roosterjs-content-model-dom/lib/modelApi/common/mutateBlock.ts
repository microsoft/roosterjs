import {
    ContentModelBlockWithCache,
    MutableContentModel,
    ReadonlyContentModel,
} from 'roosterjs-content-model-types';

export function mutateBlock<T extends ContentModelBlockWithCache<any>>(
    paragraph: ReadonlyContentModel<T>
): MutableContentModel<T> {
    const result = paragraph as MutableContentModel<T>;

    if (result.cachedElement) {
        delete result.cachedElement;
    }

    return result;
}
