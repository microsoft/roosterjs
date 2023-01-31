import { FormatHandler } from '../FormatHandler';
import { LineHeightFormat } from '../../publicTypes/format/formatParts/LineHeightFormat';

/**
 * @internal
 */
export const lineHeightFormatHandler: FormatHandler<LineHeightFormat> = {
    parse: (format, element, context, defaultStyle) => {
        let lineHeight = element.style.lineHeight || defaultStyle.lineHeight;
        if (
            !lineHeight &&
            element.childNodes.length &&
            element.childNodes.length === element.childElementCount
        ) {
            let childLineHeight = (<HTMLElement | null>(
                element.children.item(0)
            ))?.style?.getPropertyValue('line-height');

            if (childLineHeight && element.childElementCount > 1) {
                for (let i = 1, j = element.childElementCount; i < j; i++) {
                    const childElement = <HTMLElement | null>element.children.item(i);
                    if (childLineHeight !== childElement?.style.getPropertyValue('line-height')) {
                        childLineHeight = undefined;
                    }
                }
            }

            lineHeight = childLineHeight || undefined;
        }

        if (lineHeight && lineHeight != 'inherit') {
            format.lineHeight = lineHeight;
        }
    },
    apply: (format, element) => {
        if (format.lineHeight) {
            element.style.lineHeight = format.lineHeight;
        }
    },
};
