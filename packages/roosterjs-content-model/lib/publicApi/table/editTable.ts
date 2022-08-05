import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource, TableOperation } from 'roosterjs-editor-types';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { executeTableOperation } from 'roosterjs-content-model/lib/modelApi/table/executeTableOperation';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { normalizeTable } from 'roosterjs-content-model/lib/modelApi/table/normalizeTable';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 */
export default function editTable(
    editor: IExperimentalContentModelEditor,
    operation: TableOperation
) {
    const table = editor.getElementAtCursor('TABLE');
    const parent = table?.parentNode;

    editor.focus();

    if (parent) {
        editor.addUndoSnapshot(
            () => {
                const model = editor.createContentModel(table);
                const tableModel = model.blocks[0];

                if (tableModel?.blockType == ContentModelBlockType.Table) {
                    executeTableOperation(tableModel, operation);
                    normalizeTable(tableModel);
                    applyTableFormat(tableModel, {
                        keepCellShade: true,
                    });

                    const newFragment = editor.createFragmentFromContentModel(model);

                    parent.replaceChild(newFragment, table);
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: 'editTable',
            }
        );
    }
}
