import addParser from './addParser';
import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import {
    BorderFormat,
    BorderKeys,
    ContentModelBeforePasteEvent,
    FormatParser,
} from 'roosterjs-content-model';

const DeprecatedColors: string[] = [
    'inactiveborder',
    'activeborder',
    'inactivecaptiontext',
    'inactivecaption',
    'activecaption',
    'appworkspace',
    'infobackground',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'infotext',
    'menutext',
    'menu',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedfhadow',
    'windowtext',
    'windowframe',
    'window',
];

/**
 * @internal
 */
export function parseDeprecatedColor(ev: ContentModelBeforePasteEvent) {
    const { sanitizingOption, domToModelOption } = ev;
    ['color', 'background-color'].forEach(property => {
        chainSanitizerCallback(
            sanitizingOption.cssStyleCallbacks,
            property,
            (value: string) => DeprecatedColors.indexOf(value) < 0
        );
    });

    addParser(domToModelOption, 'tableCell', deprecatedBorderColorParser);
    addParser(domToModelOption, 'table', deprecatedBorderColorParser);
}

/**
 * @internal
 * Exported only for Unit testing
 */
export const deprecatedBorderColorParser: FormatParser<BorderFormat> = (
    format: BorderFormat
): void => {
    BorderKeys.forEach(key => {
        const value = format[key];
        let color: string = '';
        if (
            value &&
            DeprecatedColors.some(dColor => value.indexOf(dColor) > -1 && (color = dColor))
        ) {
            const newValue = value.replace(color, '').trimRight();
            format[key] = newValue;
        }
    });
};
