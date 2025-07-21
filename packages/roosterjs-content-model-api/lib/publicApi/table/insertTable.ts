import { createTableStructure } from '../../modelApi/table/createTableStructure';
import { tabSpacesToMargin } from '../utils/tabSpacesToMargin';
import {
    createContentModelDocument,
    createSelectionMarker,
    applyTableFormat,
    deleteSelection,
    mergeModel,
    normalizeTable,
    setSelection,
} from 'roosterjs-content-model-dom';
import type { IEditor, InsertPoint, TableMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format. If not passed, the default format will be applied:
 * background color: #FFF; border color: #ABABAB
 */
export function insertTable(
    editor: IEditor,
    columns: number,
    rows: number,
    format?: Partial<TableMetadataFormat>
) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            const insertPosition = deleteSelection(model, [], context).insertPoint;

            if (insertPosition) {
                const doc = createContentModelDocument();
                const table = createTableStructure(doc, columns, rows);

                normalizeTable(table, editor.getPendingFormat() || insertPosition.marker.format);
                const indentationMargin = getTableIndentation(insertPosition);
                if (indentationMargin) {
                    insertPosition.paragraph.segments = [insertPosition.marker];
                }

                // Assign default vertical align
                format = format || { verticalAlign: 'top' };
                applyTableFormat(table, format);
                mergeModel(model, doc, context, {
                    insertPosition,
                    mergeFormat: 'mergeAll',
                });

                const firstBlock = table.rows[0]?.cells[0]?.blocks[0];

                if (indentationMargin) {
                    if (insertPosition.paragraph.format.direction == 'rtl') {
                        table.format.marginRight = indentationMargin + 'px';
                    } else {
                        table.format.marginLeft = indentationMargin + 'px';
                    }
                }

                if (firstBlock?.blockType == 'Paragraph') {
                    const marker = createSelectionMarker(firstBlock.segments[0]?.format);
                    firstBlock.segments.unshift(marker);
                    setSelection(model, marker);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'insertTable',
        }
    );
}

const getTableIndentation = (insertPoint: InsertPoint) => {
    let margin = 0;
    const { paragraph } = insertPoint;
    const segments = paragraph.segments;
    let foundMarker = false;
    let markerIndex = -1;

    // First, find if there's a selection marker and check what's after it
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].segmentType === 'SelectionMarker') {
            foundMarker = true;
            markerIndex = i;

            // Check if there's any content after the marker (except Br)
            for (let j = i + 1; j < segments.length; j++) {
                if (segments[j].segmentType !== 'Br') {
                    // Found non-Br content after marker, no indentation
                    return 0;
                }
            }
            break;
        }
    }

    // Now calculate margin from whitespace before the marker (or end if no marker)
    const endIndex = foundMarker ? markerIndex : segments.length;

    for (let i = 0; i < endIndex; i++) {
        const seg = segments[i];

        if (seg.segmentType === 'Text' && seg.text.trim().length === 0) {
            // Whitespace text - add to margin
            margin += tabSpacesToMargin(seg);
        } else if (seg.segmentType === 'Br') {
            // Line break just interrupts counting, doesn't reset margin
            break;
        } else {
            // Any other content means no margin
            return 0;
        }
    }

    return margin;
};
