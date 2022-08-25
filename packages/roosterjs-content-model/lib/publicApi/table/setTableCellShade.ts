import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setTableCellBackgroundColor } from '../../modelApi/table/setTableCellBackgroundColor';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set
 */
export default function setTableCellShade(editor: IExperimentalContentModelEditor, color: string) {
    const table = editor.getElementAtCursor('TABLE');
    const model = table && editor.createContentModel(table);
    const tableModel = model?.blocks[0];

    if (tableModel?.blockType == ContentModelBlockType.Table) {
        normalizeTable(tableModel);
        setTableCellBackgroundColor(tableModel, color);
        editor.addUndoSnapshot(
            () => {
                editor.focus();
                editor.setContentModel(model, fragment => editor.replaceNode(table, fragment));
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: 'setTableCellShade',
            }
        );
    }
}
