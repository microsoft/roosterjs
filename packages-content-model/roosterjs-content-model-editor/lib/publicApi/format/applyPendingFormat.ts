import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
//import { TableSelectionContext } from '../../publicTypes/selection/TableSelectionContext';
import {
    createText,
    normalizeContentModel,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';

const ANSI_SPACE = '\u0020';
const NON_BREAK_SPACE = '\u00A0';

/**
 * Apply pending format to the text user just input
 * @param editor The editor to get format from
 * @param data The text user just input
 */
export default function applyPendingFormat(editor: IContentModelEditor, data: string) {
    const format = getPendingFormat(editor);

    if (format) {
        let isChanged = false;

        formatWithContentModel(editor, 'applyPendingFormat', (model, context) => {
            iterateSelections([model], (_, tableContext, block, segments) => {
                if (
                    block?.blockType == 'Paragraph' &&
                    segments?.length == 1 &&
                    segments[0].segmentType == 'SelectionMarker'
                ) {
                    const marker = segments[0];
                    const index = block.segments.indexOf(marker);
                    const previousSegment = block.segments[index - 1];

                    if (previousSegment?.segmentType == 'Text') {
                        const text = previousSegment.text;
                        const subStr = text.substr(-data.length, data.length);

                        // For space, there can be &#32 (space) or &#160 (&nbsp;), we treat them as the same
                        if (subStr == data || (data == ANSI_SPACE && subStr == NON_BREAK_SPACE)) {
                            marker.format = { ...format };
                            previousSegment.text = text.substring(0, text.length - data.length);
                            //const cellFormat = getSelectedCellFormat(tableContext);

                            const newText = createText(
                                data == ANSI_SPACE ? NON_BREAK_SPACE : data,
                                {
                                    ...format,
                                    ...previousSegment.format,
                                    // ...cellFormat,
                                }
                            );

                            block.segments.splice(index, 0, newText);
                            setParagraphNotImplicit(block);
                            isChanged = true;
                        }
                    }
                }
                return true;
            });

            if (isChanged) {
                normalizeContentModel(model);
                context.skipUndoSnapshot = true;
            }

            return isChanged;
        });
    }
}

// const getSelectedCellFormat = (tableContext?: TableSelectionContext) => {
//     if (tableContext) {
//         const { rowIndex, colIndex, table } = tableContext;
//         const cell = table.rows[rowIndex]?.cells[colIndex];
//         return cell?.format;
//     }
//     return undefined;
// };
