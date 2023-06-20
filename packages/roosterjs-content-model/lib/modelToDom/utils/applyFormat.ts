import {
    ContentModelFormatBase,
    FormatApplier,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applyFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    appliers: (FormatApplier<T> | null)[],
    format: T,
    context: ModelToDomContext
) {
    appliers.forEach(applier => {
        applier?.(format, element, context);
    });
}
