import type { ContentModelBlockFormat } from 'roosterjs-content-model-types';

const PERCENTAGE_REGEX = /%/;
// Default line height in browsers according to https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#normal
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 1.2;

/**
 * @internal
 * Parser for adjusting percentage-based line heights and converting 'normal' to a specific percentage
 * @param format The block format to modify
 * @param element The HTML element being processed
 */
export function adjustPercentileLineHeight(
    format: ContentModelBlockFormat,
    element: HTMLElement
): void {
    //If the line height is less than the browser default line height, line between the text is going to be too narrow
    let parsedLineHeight: number;
    if (
        PERCENTAGE_REGEX.test(element.style.lineHeight) &&
        !isNaN((parsedLineHeight = parseInt(element.style.lineHeight)))
    ) {
        format.lineHeight = (
            DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE *
            (parsedLineHeight / 100)
        ).toString();
    } else if (element.style.lineHeight.toLowerCase() === 'normal') {
        format.lineHeight = '120%';
    }
}
