import { BorderKeys } from 'roosterjs-content-model-dom';
import type {
    BorderFormat,
    ContentModelTableFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

const BorderStyleNames = new Map<string, keyof BorderFormat>([
    ['border-top', 'borderTop'],
    ['border-right', 'borderRight'],
    ['border-bottom', 'borderBottom'],
    ['border-left', 'borderLeft'],
]);

/**
 * @internal
 */
export const wordBorderParser: FormatParser<ContentModelTableFormat> = (format, element) => {
    const style = element.getAttribute('style');

    if (style) {
        const noBorder = new Map<keyof BorderFormat, boolean>();

        style.split(';').forEach(declaration => {
            const separatorIndex = declaration.indexOf(':');

            if (separatorIndex < 0) {
                return;
            }

            const name = declaration.substring(0, separatorIndex).trim().toLowerCase();
            const value = declaration
                .substring(separatorIndex + 1)
                .trim()
                .toLowerCase();
            const isNone = /^none(?:\s|$|!important)/.test(value);

            if (name == 'border') {
                BorderKeys.forEach(key => noBorder.set(key, isNone));
            } else {
                const key = BorderStyleNames.get(name);

                if (key) {
                    noBorder.set(key, isNone);
                }
            }
        });

        noBorder.forEach((isNone, key) => {
            if (isNone) {
                format[key] = 'none';
            }
        });
    }
};
