import applyInlineStyle from '../utils/applyInlineStyle';
import { FontSizeChange, IEditor } from 'roosterjs-editor-types';
import { getComputedStyle } from 'roosterjs-editor-dom';
import type { CompatibleFontSizeChange } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Default font size sequence, in pt. Suggest editor UI use this sequence as your font size list,
 * So that when increase/decrease font size, the font size can match the sequence of your font size picker
 */
export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 1000;

/**
 * Increase or decrease font size in selection
 * @param editor The editor instance
 * @param change Whether increase or decrease font size
 * @param fontSizes A sorted font size array, in pt. Default value is FONT_SIZES
 */
export default function changeFontSize(
    editor: IEditor,
    change: FontSizeChange | CompatibleFontSizeChange,
    fontSizes: number[] = FONT_SIZES
) {
    let changeBase: 1 | -1 = change == FontSizeChange.Increase ? 1 : -1;
    applyInlineStyle(
        editor,
        element => {
            let pt = parseFloat(getComputedStyle(element, 'font-size') || element.style.fontSize);
            element.style.fontSize = getNewFontSize(pt, changeBase, fontSizes) + 'pt';
            let lineHeight = getComputedStyle(element, 'line-height');
            if (lineHeight && lineHeight != 'normal') {
                element.style.lineHeight = 'normal';
            }
        },
        'changeFontSize'
    );
}

/**
 * @internal
 * Get new font size after increase/decrease. This is exported for test only
 * @param pt Original font size, in Point
 * @param changeBase Changed value, 1 means increase, -1 means decrease
 * @param fontSizes Known font size array
 */
export function getNewFontSize(pt: number, changeBase: 1 | -1, fontSizes: number[]): number {
    pt = changeBase == 1 ? Math.floor(pt) : Math.ceil(pt);
    let last = fontSizes[fontSizes.length - 1];
    if (pt <= fontSizes[0]) {
        pt = Math.max(pt + changeBase, MIN_FONT_SIZE);
    } else if (pt > last || (pt == last && changeBase == 1)) {
        pt = pt / 10;
        pt = changeBase == 1 ? Math.floor(pt) : Math.ceil(pt);
        pt = Math.min(Math.max((pt + changeBase) * 10, last), MAX_FONT_SIZE);
    } else if (changeBase == 1) {
        for (let i = 0; i < fontSizes.length; i++) {
            if (pt < fontSizes[i]) {
                pt = fontSizes[i];
                break;
            }
        }
    } else {
        for (let i = fontSizes.length - 1; i >= 0; i--) {
            if (pt > fontSizes[i]) {
                pt = fontSizes[i];
                break;
            }
        }
    }
    return pt;
}
