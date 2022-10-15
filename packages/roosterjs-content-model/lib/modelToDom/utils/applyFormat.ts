import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { FormatApplier } from '../../publicTypes/context/ModelToDomSettings';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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
