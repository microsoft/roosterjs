import { getComputedStyle } from 'roosterjs-editor-dom';

const MarginValueRegex = /(-?\d+(\.\d+)?)([a-z]+|%)/;

/**
 * @internal
 */
export function parseValueWithUnit(
    value: string = '',
    element?: HTMLElement,
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
                result = element ? getFontSize(element) * num : 0;
                break;
            case 'ex':
                result = element ? (getFontSize(element) * num) / 2 : 0;
                break;
            case '%':
                result = element ? (element.offsetWidth * num) / 100 : 0;
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

function getFontSize(element: HTMLElement) {
    const styleInPt = getComputedStyle(element, 'font-size');
    const floatInPt = parseFloat(styleInPt);
    const floatInPx = ptToPx(floatInPt);

    return floatInPx;
}

function ptToPx(pt: number): number {
    return Math.round((pt * 4000) / 3) / 1000;
}

function pxToPt(px: number) {
    return Math.round((px * 3000) / 4) / 1000;
}
