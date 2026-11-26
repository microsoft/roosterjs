import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import { adaptColor, getColor, getLightModeColor } from '../utils/color';
import type { FormatHandler } from '../FormatHandler';
import type { TextColorFormat, UnderlineFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const underlineFormatHandler: FormatHandler<UnderlineFormat & TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('underline')! >= 0) {
            format.underline = true;
        } else if (element.tagName == 'A' && textDecoration == 'none') {
            format.underline = false;
        }

        const color = element.style.textDecorationColor || defaultStyle.textDecorationColor;
        const isResetColor =
            color &&
            ['initial', 'unset', 'revert', 'revert-layer'].indexOf(color.toLowerCase()) >= 0;

        if (textDecoration?.indexOf('underline')! >= 0) {
            if (color == 'inherit') {
                format.underlineColor = format.underlineColor || format.textColor;
            } else if ((color && !isResetColor) || format.underlineColor) {
                const value = !isResetColor && color ? color : 'currentcolor';

                format.underlineColor =
                    ['currentcolor', 'initial', 'unset', 'revert', 'revert-layer'].indexOf(
                        value.toLowerCase()
                    ) >= 0
                        ? getColor(
                              element,
                              false,
                              !!context.isDarkMode,
                              context.darkColorHandler
                          ) ||
                          (defaultStyle.color != 'inherit' ? defaultStyle.color : undefined) ||
                          format.textColor ||
                          'currentcolor'
                        : getLightModeColor(
                              value,
                              !!context.isDarkMode,
                              context.darkColorHandler,
                              'rgb(0, 0, 0)'
                          );
            }
        } else if (!format.underline) {
            if (color && !isResetColor) {
                format.underlineColor = getLightModeColor(
                    color,
                    !!context.isDarkMode,
                    context.darkColorHandler,
                    'rgb(0, 0, 0)'
                );
            } else if (format.underlineColor) {
                delete format.underlineColor;
            }
        }
    },
    apply: (format, element, context) => {
        if (!format.underline && format.underlineColor) {
            element.style.textDecorationColor =
                (format.underlineColor.toLowerCase() == 'currentcolor'
                    ? format.underlineColor
                    : adaptColor(
                          element,
                          format.underlineColor,
                          'text',
                          !!context.isDarkMode,
                          context.darkColorHandler
                      )) || '';
        }

        if (typeof format.underline === 'undefined') {
            return;
        }

        const blockUnderline = context.implicitFormat.underline;

        if (
            !!blockUnderline != !!format.underline ||
            (format.underline &&
                format.underlineColor &&
                format.underlineColor != context.implicitFormat.underlineColor)
        ) {
            if (format.underline) {
                const underline = wrapAllChildNodes(element, 'u');

                if (format.underlineColor) {
                    underline.style.textDecorationColor =
                        (format.underlineColor.toLowerCase() == 'currentcolor'
                            ? format.underlineColor
                            : adaptColor(
                                  underline,
                                  format.underlineColor,
                                  'text',
                                  !!context.isDarkMode,
                                  context.darkColorHandler
                              )) || '';
                }
            } else {
                element.style.textDecoration = 'none';
            }
        }
    },
};
