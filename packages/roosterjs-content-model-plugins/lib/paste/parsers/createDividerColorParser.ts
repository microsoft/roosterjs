import type {
    ContentModelDividerFormat,
    FormatParser,
    ValueSanitizer,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createDividerColorParser(
    styleSanitizers: Readonly<Record<string, ValueSanitizer>>,
    isWordDesktop: boolean = false,
    attributeSanitizers: Readonly<Record<string, ValueSanitizer>> = {}
): FormatParser<ContentModelDividerFormat> {
    return (format, element) => {
        const sanitizer = styleSanitizers.color;
        if (format.textColor && (sanitizer === false || typeof sanitizer == 'function')) {
            const color =
                typeof sanitizer == 'function'
                    ? sanitizer(format.textColor, element.tagName)
                    : null;
            if (color) {
                format.textColor = color;
            } else {
                delete format.textColor;
            }
        }
        if (
            isWordDesktop &&
            element.tagName == 'HR' &&
            element.hasAttribute('noshade') &&
            format.textColor &&
            !format.backgroundColor &&
            !element.style.backgroundColor
        ) {
            const noShadeSanitizer = attributeSanitizers.noshade;
            if (
                noShadeSanitizer === false ||
                (typeof noShadeSanitizer == 'function' &&
                    noShadeSanitizer(element.getAttribute('noshade') || '', element.tagName) ===
                        null)
            ) {
                return;
            }
            // Word's filled-rule export uses color, not background-color.
            const backgroundSanitizer = styleSanitizers['background-color'];
            const fill =
                typeof backgroundSanitizer == 'function'
                    ? backgroundSanitizer(format.textColor, element.tagName)
                    : backgroundSanitizer === false
                    ? null
                    : format.textColor;
            if (fill) {
                format.backgroundColor = fill;
            }
        }
    };
}
