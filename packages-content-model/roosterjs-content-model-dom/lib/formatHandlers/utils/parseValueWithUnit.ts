import { getComputedStyle } from 'roosterjs-editor-dom';

const MarginValueRegex = /(-?\d+(\.\d+)?)([a-z]+|%)/;

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
                result = getFontSize(currentSizePxOrElement) * num;
                break;
            case 'ex':
                result = (getFontSize(currentSizePxOrElement) * num) / 2;
                break;
            case '%':
                result = (getFontSize(currentSizePxOrElement) * num) / 100;
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
        const styleInPt = getComputedStyle(currentSizeOrElement, 'font-size');
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
