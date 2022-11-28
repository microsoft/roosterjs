import { saveTableCellMetadata } from './tableCellInfo';
/**
 * Clone css styles from a element an set to another.
 * @param cell cell that will receive the styles
 * @param styledCell cell where the styles will be clone
 */

export default function cloneCellStyles(
    cell: HTMLTableCellElement,
    styledCell: HTMLTableCellElement
) {
    const styles = styledCell.getAttribute('style');
    if (styles) {
        cell.setAttribute('style', styles);
        saveTableCellMetadata(cell, {
            bgColorOverride: true,
        });
    }
}
