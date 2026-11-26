import { backgroundColorFormatHandler } from '../common/backgroundColorFormatHandler';
import { borderFormatHandler } from '../common/borderFormatHandler';
import { borderColorFormatHandler } from '../common/borderColorFormatHandler';
import { BorderColorKeyMap, BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import { isBlockElement } from '../../domToModel/utils/isBlockElement';
import { paddingFormatHandler } from '../block/paddingFormatHandler';
import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { FormatHandler } from '../FormatHandler';
import type {
    BackgroundColorFormat,
    BorderFormat,
    PaddingFormat,
    TextBorderFormat,
} from 'roosterjs-content-model-types';

const TextBorderIdPrefix =
    'text-border-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
let nextTextBorderId = 0;

/**
 * @internal
 */
export const textBorderFormatHandler: FormatHandler<TextBorderFormat> = {
    parse: (format, element, context, defaultStyle) => {
        if (
            isBlockElement(element) ||
            element.style.display == 'inline-block' ||
            element.tagName == 'IMG' ||
            element.tagName == 'A'
        ) {
            return;
        }

        const box: BorderFormat & PaddingFormat & BackgroundColorFormat = {};

        borderFormatHandler.parse(box, element, context, defaultStyle);

        if (box.borderTop || box.borderRight || box.borderBottom || box.borderLeft) {
            borderColorFormatHandler.parse(box, element, context, defaultStyle);

            BorderKeys.forEach(key => {
                const value = box[key];

                if (value) {
                    const border = extractBorderValues(value);
                    const color = element.style
                        .getPropertyValue(BorderColorKeyMap[key])
                        .toLowerCase();

                    if (!color || color == 'currentcolor' || color == 'initial') {
                        border.color = context.segmentFormat.textColor || 'currentColor';
                        box[key] = combineBorderValue(border);
                    }
                }
            });

            paddingFormatHandler.parse(box, element, context, defaultStyle);

            if (element.style.backgroundColor) {
                backgroundColorFormatHandler.parse(box, element, context, defaultStyle);
            }

            Object.assign(format, {
                textBorderId: TextBorderIdPrefix + '-' + ++nextTextBorderId,
                textBorderTop: box.borderTop,
                textBorderRight: box.borderRight,
                textBorderBottom: box.borderBottom,
                textBorderLeft: box.borderLeft,
                textBorderPaddingTop: box.paddingTop,
                textBorderPaddingRight: box.paddingRight,
                textBorderPaddingBottom: box.paddingBottom,
                textBorderPaddingLeft: box.paddingLeft,
                textBorderBackgroundColor: box.backgroundColor,
            });
        }
    },
    apply: (format, element, context) => {
        if (
            format.textBorderTop ||
            format.textBorderRight ||
            format.textBorderBottom ||
            format.textBorderLeft
        ) {
            const box: BorderFormat & PaddingFormat & BackgroundColorFormat = {
                borderTop: format.textBorderTop,
                borderRight: format.textBorderRight,
                borderBottom: format.textBorderBottom,
                borderLeft: format.textBorderLeft,
                paddingTop: format.textBorderPaddingTop,
                paddingRight: format.textBorderPaddingRight,
                paddingBottom: format.textBorderPaddingBottom,
                paddingLeft: format.textBorderPaddingLeft,
                backgroundColor: format.textBorderBackgroundColor,
            };
            const content = wrapAllChildNodes(element, 'span');

            // Keep the common box outside run-specific font styles so adjacent runs share one frame.
            content.style.cssText = element.style.cssText;
            element.removeAttribute('style');
            if (format.textBorderId) {
                element.setAttribute('data-rooster-text-border', format.textBorderId);
            }
            borderFormatHandler.apply(box, element, context);
            borderColorFormatHandler.apply(box, element, context);
            paddingFormatHandler.apply(box, element, context);
            backgroundColorFormatHandler.apply(box, element, context);
        }
    },
};
