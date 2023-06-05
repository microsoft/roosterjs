import { ContentModelHyperLinkFormat } from '../../../../publicTypes/format/ContentModelHyperLinkFormat';
import { ContentModelSegmentFormat } from '../../../../publicTypes/format/ContentModelSegmentFormat';
import { DomToModelContext } from '../../../../publicTypes/context/DomToModelContext';
import { FormatParser } from '../../../../publicTypes/context/DomToModelSettings';

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
const deprecatedColorParser: FormatParser<ContentModelHyperLinkFormat> = (
    format: ContentModelSegmentFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyles: Readonly<Partial<CSSStyleDeclaration>>
): void => {
    if (DeprecatedColorList.indexOf(element.style.backgroundColor) > -1) {
        format.backgroundColor = defaultStyles.backgroundColor;
        element.style.backgroundColor = defaultStyles.backgroundColor ?? '';
    }
    if (DeprecatedColorList.indexOf(element.style.color) > -1) {
        format.textColor = defaultStyles.color;
        element.style.color = defaultStyles.color ?? '';
    }
};

export default deprecatedColorParser;
