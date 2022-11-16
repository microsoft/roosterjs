import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 * @param keepCellShade Whether keep existing shade color when apply format if there is a manually set shade color
 */
export default function formatTable(
    editor: IExperimentalContentModelEditor,
    format: TableMetadataFormat,
    keepCellShade?: boolean
) {
    const table = editor.getElementAtCursor('TABLE');
    const model = table && editor.createContentModel(table);
    const tableModel = model?.blocks[0];

    if (tableModel?.blockType == 'Table') {
        applyTableFormat(tableModel, format, keepCellShade);

        editor.addUndoSnapshot(
            () => {
                editor.focus();
                if (model && table) {
                    editor.setContentModel(model, {
                        doNotReuseEntityDom: true,
                        mergingCallback: fragment => {
                            editor.replaceNode(table, fragment);
                        },
                    });
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: 'formatTable',
            }
        );
    }
}
