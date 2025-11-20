import type { ContentModelBlockFormat, FormatParser } from 'roosterjs-content-model-types';

const PERCENTAGE_REGEX = /%/;
// Default line height in browsers according to https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#normal
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 1.2;

/**
 * @internal
 * Parser to adjust percentile line height for Word Desktop content
 * If the line height is less than the browser default line height, line between the text is going to be too narrow
 */
export const adjustPercentileLineHeightParser: FormatParser<ContentModelBlockFormat> = (
    format: ContentModelBlockFormat,
    element: HTMLElement
): void => {
    let parsedLineHeight: number;
    if (
        PERCENTAGE_REGEX.test(element.style.lineHeight) &&
        !isNaN((parsedLineHeight = parseInt(element.style.lineHeight)))
    ) {
        format.lineHeight = (
            DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE *
            (parsedLineHeight / 100)
        ).toString();
    } else if (element.style.lineHeight === 'normal') {
        format.lineHeight = '120%';
    }
};
