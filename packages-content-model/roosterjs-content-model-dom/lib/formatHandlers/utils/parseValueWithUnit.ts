const MarginValueRegex = /(-?\d+(\.\d+)?)([a-z]+|%)/;

// According to https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel, 1in = 96px
const PixelPerInch = 96;

/**
 * Parse unit value with its unit
 * @param value The source value to parse
 * @param currentSizePxOrElement The source element which has this unit value, or current font size (in px) from context.
 * @param resultUnit Unit for result, can be px or pt. @default px
 */
export function parseValueWithUnit(
    value: string = '',
    currentSizePxOrElement?: number | HTMLElement,
    resultUnit: 'px' | 'pt' = 'px'
): number {
    const match = MarginValueRegex.exec(value);
    let result = 0;

    if (match) {
        const [_, numStr, __, unit] = match;
        const num = parseFloat(numStr);

        switch (unit) {
            case 'px':
                result = num;
                break;
            case 'pt':
                result = ptToPx(num);
                break;
            case 'em':
            case 'rem':
                result = getFontSize(currentSizePxOrElement) * num;
                break;
            case 'ex':
                result = (getFontSize(currentSizePxOrElement) * num) / 2;
                break;
            case '%':
                result = (getFontSize(currentSizePxOrElement) * num) / 100;
                break;
            case 'in':
                result = num * PixelPerInch;
                break;
            default:
                // TODO: Support more unit if need
                break;
        }
    }

    if (result > 0 && resultUnit == 'pt') {
        result = pxToPt(result);
    }

    return result;
}

function getFontSize(currentSizeOrElement?: number | HTMLElement): number {
    if (typeof currentSizeOrElement === 'undefined') {
        return 0;
    } else if (typeof currentSizeOrElement === 'number') {
        return currentSizeOrElement;
    } else {
        const styleInPt =
            currentSizeOrElement.ownerDocument.defaultView?.getComputedStyle(currentSizeOrElement)
                .fontSize ?? '';
        const floatInPt = parseFloat(styleInPt);
        const floatInPx = ptToPx(floatInPt);

        return floatInPx;
    }
}

function ptToPx(pt: number): number {
    return Math.round((pt * 4000) / 3) / 1000;
}

function pxToPt(px: number) {
    return Math.round((px * 3000) / 4) / 1000;
}
