import { getColor, setColor } from '../utils/color';
import { shouldSetValue } from '../utils/shouldSetValue';
import type { BackgroundColorFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const backgroundColorFormatHandler: FormatHandler<BackgroundColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const backgroundColor =
            getColor(
                element,
                true /*isBackground*/,
                !!context.isDarkMode,
                context.darkColorHandler
            ) || defaultStyle.backgroundColor;

        if (
            shouldSetValue(
                backgroundColor,
                'transparent',
                undefined /*existingValue*/,
                defaultStyle.backgroundColor
            )
        ) {
            format.backgroundColor = backgroundColor;
        }
    },
    apply: (format, element, context) => {
        setColor(
            element,
            format.backgroundColor,
            true /*isBackground*/,
            !!context.isDarkMode,
            context.darkColorHandler
        );
    },
};
