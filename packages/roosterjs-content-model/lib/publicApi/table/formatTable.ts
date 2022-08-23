import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 */
export default function formatTable(
    editor: IExperimentalContentModelEditor,
    format: TableMetadataFormat
) {
    const table = editor.getElementAtCursor('TABLE');
    const model = editor.createContentModel(table);
    const tableModel = model.blocks[0];

    if (tableModel?.blockType == ContentModelBlockType.Table) {
        applyTableFormat(tableModel, format);

        editor.addUndoSnapshot(
            () => {
                editor.focus();
                editor.setContentModel(model, fragment => editor.replaceNode(table, fragment));
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: 'formatTable',
            }
        );
    }
}
