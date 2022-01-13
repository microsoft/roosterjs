import { TableMetadata } from '../table/tableMetadata';

const SELECTION_COLOR_OPACITY = TableMetadata.SELECTION_COLOR_OPACITY;

/**
 * @internal
 * Retrieve the color to be applied when a cell is selected
 * @param colorString Color
 * @returns color to be applied when a cell is selected
 */
export function getHighlightColor() {
    return `rgba(198,198,198, ${SELECTION_COLOR_OPACITY})`;
}
