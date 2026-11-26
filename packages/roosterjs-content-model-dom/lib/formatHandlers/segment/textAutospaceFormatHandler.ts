import type { FormatHandler } from '../FormatHandler';
import type { TextAutospaceFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textAutospaceFormatHandler: FormatHandler<TextAutospaceFormat> = {
    parse: (format, element, _, defaultStyle) => {
        // The supported runtime property is newer than the repository's DOM declarations.
        const defaultValue = Object.entries(defaultStyle).find(
            ([key]) => key == 'textAutospace' || key == 'text-autospace'
        )?.[1];
        const value =
            element.style.getPropertyValue('text-autospace') ||
            (typeof defaultValue == 'string' ? defaultValue : '');
        if (value && value != 'inherit' && value != 'unset') {
            format.textAutospace = value;
        }
    },
    apply: (format, element, context) => {
        const value = format.textAutospace || 'initial';
        if (value != (context.implicitFormat.textAutospace || 'initial')) {
            element.style.setProperty('text-autospace', value);
        }
    },
};
