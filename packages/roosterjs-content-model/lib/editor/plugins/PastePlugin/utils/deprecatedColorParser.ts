import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import { HtmlSanitizerOptions } from 'roosterjs-editor-types';

const DeprecatedColorList: string[] = [
    'activeborder',
    'activecaption',
    'appworkspace',
    'background',
    'buttonhighlight',
    'buttonshadow',
    'captiontext',
    'inactiveborder',
    'inactivecaption',
    'inactivecaptiontext',
    'infobackground',
    'infotext',
    'menu',
    'menutext',
    'scrollbar',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedfhadow',
    'window',
    'windowframe',
    'windowtext',
];

/**
 * @internal
 */
function sanitizeHtmlColorsFromPastedContent(sanitizingOption: Required<HtmlSanitizerOptions>) {
    ['color', 'background-color'].forEach(property => {
        chainSanitizerCallback(
            sanitizingOption.cssStyleCallbacks,
            property,
            (value: string) => DeprecatedColorList.indexOf(value) < 0
        );
    });
}

export default sanitizeHtmlColorsFromPastedContent;
