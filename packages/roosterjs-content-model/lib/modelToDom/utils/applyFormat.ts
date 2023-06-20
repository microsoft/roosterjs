import {
    ContentModelFormatBase,
    FormatApplier,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * Apply formats to the given HTML element using specified appliers
 * @param element The element to apply formats to
 * @param appliers The appliers we are using to apply formats
 * @param format The format object we get format info from
 * @param context Content Model to DOM context
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
