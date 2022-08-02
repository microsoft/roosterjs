import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource, TableFormat } from 'roosterjs-editor-types';
import { createContentModelDocument } from '../../domToModel/creators/createContentModelDocument';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format. If not passed, the default format will be applied:
 * background color: #FFF; border color: #ABABAB
 */
export default function insertTable(
    editor: IExperimentalContentModelEditor,
    columns: number,
    rows: number,
    format?: TableFormat
) {
    editor.addUndoSnapshot(
        () => {
            const contentModelContext = editor.createContentModelContext();
            const doc = createContentModelDocument(editor.getDocument());

            const table = createTableStructure(doc, columns, rows, contentModelContext);
            applyTableFormat(table, format);

            const fragment = editor.createFragmentFromContentModel(doc);

            editor.insertNode(fragment);
        },
        ChangeSource.Format,
        false /*canUndoByBackspace*/,
        {
            formatApiName: 'insertTable',
        }
    );
}
