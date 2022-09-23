import { ContentModelFormatBase } from '../format/ContentModelFormatBase';
import { FormatHandlerTypeMap, FormatKey } from '../format/FormatHandlerTypeMap';
import { ModelToDomContext } from './ModelToDomContext';

/**
 * Apply format to the given HTML element
 * @param format The format object to apply
 * @param element The HTML element to apply format to
 * @param context The context object that provide related context information
 */
export type FormatApplier<TFormat extends ContentModelFormatBase> = (
    format: TFormat,
    element: HTMLElement,
    context: ModelToDomContext
) => void;

/**
 * All format appliers
 */
export type FormatAppliers = {
    [Key in FormatKey]: FormatApplier<FormatHandlerTypeMap[Key]>;
};

/**
 * Represents settings to customize DOM to Content Model conversion
 */
export interface ModelToDomSettings {
    /**
     * Map of format appliers
     */
    formatAppliers: FormatAppliers;
}
