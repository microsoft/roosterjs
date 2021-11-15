import safeInstanceOf from './safeInstanceOf';
import { IEditor } from 'roosterjs-editor-types';
import { TableMetadata } from '../table/tableMetadata';

/**
 * Remove the selected style of the cells
 * @param editor Editor Instance
 */
export function clearSelectedTableCells(editor: IEditor, shouldRemoveClass: boolean = true) {
    getSelectedTableCells(editor).forEach((cell: Element) => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            if (
                shouldRemoveClass &&
                cell.dataset[TableMetadata.ON_FOCUS_CACHE] &&
                cell.dataset[TableMetadata.ON_FOCUS_CACHE] == 'true'
            ) {
                delete cell.dataset[TableMetadata.ON_FOCUS_CACHE];
                return;
            }
            if (shouldRemoveClass) {
                cell.classList.remove(TableMetadata.TABLE_CELL_SELECTED);
            } else {
                cell.dataset[TableMetadata.ON_FOCUS_CACHE] = 'true';
            }
            cell.style.backgroundColor = getOriginalColor(
                cell.dataset[TableMetadata.TEMP_BACKGROUND_COLOR]
            );
            delete cell.dataset[TableMetadata.TEMP_BACKGROUND_COLOR];
        }
    });
}

/**
 * Set the selected style to the selected cells
 * @param editor Editor Instance
 */
export function setSelectedTableCells(editor: IEditor) {
    getSelectedTableCells(editor).forEach((cell: Element) => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            const highlighColor = getHighlightColor(cell.style.backgroundColor);
            cell.dataset[TableMetadata.TEMP_BACKGROUND_COLOR] = getOriginalColor(
                cell.style.backgroundColor
            );
            cell.style.backgroundColor = highlighColor;
        }
    });
}

/**
 * @internal
 * Get the cells with the selected cells class
 * @param editor Editor Instance
 * @returns Array of Nodes
 */
export function getSelectedTableCells(editor: IEditor) {
    return editor?.getDocument().querySelectorAll('.' + TableMetadata.TABLE_CELL_SELECTED);
}

/**
 * @internal
 * Retrieve the color to be applied when a cell is selected
 * @param colorString Color
 * @returns color to be applied when a cell is selected
 */
export function getHighlightColor(colorString: string) {
    const color = getColor(colorString, 'rgba');
    if (color) {
        return color;
    }

    return `rgba(198,198,198, ${TableMetadata.SELECTION_COLOR_OPACITY})`;
}

/**
 * @internal
 * Get the original color before the selection was made
 * @param colorString Color
 * @returns original color before the selection was made
 */
export function getOriginalColor(colorString: string) {
    const color = getColor(colorString);

    if (color) {
        return color;
    }

    return '';
}

function getColor(colorString: string, prefix: string = 'rgb') {
    if (colorString && (colorString.indexOf('rgba') > -1 || colorString.indexOf('rgb') > -1)) {
        const rgb = colorString
            .trim()
            .substring(colorString.indexOf('(') + 1, colorString.length - 1)
            .split(',');
        colorString = `${prefix}(${rgb[0]}, ${rgb[1]}, ${rgb[2]}${
            prefix == 'rgba' ? ', ' + TableMetadata.SELECTION_COLOR_OPACITY : ''
        })`;
    }
    return colorString;
}
