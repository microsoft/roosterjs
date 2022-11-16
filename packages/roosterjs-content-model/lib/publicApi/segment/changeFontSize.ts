import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { FontSizeFormat } from '../../publicTypes/format/formatParts/FontSizeFormat';
import { FormatParser } from '../../publicTypes/context/DomToModelSettings';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getComputedStyle } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Default font size sequence, in pt. Suggest editor UI use this sequence as your font size list,
 * So that when increase/decrease font size, the font size can match the sequence of your font size picker
 */
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 1000;

/**
 * Increase or decrease font size in selection
 * @param editor The editor instance
 * @param change Whether increase or decrease font size
 * @param fontSizes A sorted font size array, in pt. Default value is FONT_SIZES
 */
export default function changeFontSize(
    editor: IExperimentalContentModelEditor,
    change: 'increase' | 'decrease'
) {
    formatWithContentModel(
        editor,
        'changeFontSize',
        mode =>
            setSegmentStyle(
                mode,
                segment => changeFontSizeInternal(segment, change),
                undefined /* segmentHasStyleCallback*/,
                true /*includingFormatHandler*/
            ),
        {
            formatParserOverride: {
                fontSize: fontSizeHandler,
            },
        }
    );
}

const fontSizeHandler: FormatParser<FontSizeFormat> = (format, element, context, defaultStyle) => {
    // Superscript and subscript will have "smaller" font size,
    // we should keep using its parent element's font size since SUB/SUP tag will auto make font smaller
    if (!format.fontSize || defaultStyle.fontSize != 'smaller') {
        format.fontSize = getComputedStyle(element, 'font-size');
    }
};

function changeFontSizeInternal(segment: ContentModelSegment, change: 'increase' | 'decrease') {
    if (segment.format.fontSize) {
        let sizeNumber = parseFloat(segment.format.fontSize);

        if (sizeNumber > 0) {
            const newSize = getNewFontSize(sizeNumber, change == 'increase' ? 1 : -1, FONT_SIZES);

            segment.format.fontSize = newSize + 'pt';
        }
    }
}

function getNewFontSize(pt: number, changeBase: 1 | -1, fontSizes: number[]): number {
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
