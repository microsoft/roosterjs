import * as createFormatContextFromEditor from '../../../lib/formatApi/utils/createFormatContextFromEditor';
import insertTable from '../../../lib/formatApi/table/insertTable';
import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';

describe('insertTable', () => {
    it('insert 1*1 table', () => {
        const context: FormatContext = {
            isDarkMode: false,
            isInSelection: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
        const editor = {
            getDocument: () => document,
            addUndoSnapshot: (
                callback: () => void,
                changeSource: string,
                canUndoByBackspace: boolean,
                additionalData: any
            ) => {
                callback();

                expect(changeSource).toBe(ChangeSource.Format);
                expect(canUndoByBackspace).toBe(false);
                expect(additionalData.formatApiName).toBe('insertTable');
            },
            insertNode: (node: Node) => {
                const table = node.firstChild as HTMLElement;
                expect(table.tagName).toBe('TABLE');
                expect(table.dataset.editingInfo).toBeDefined();
                expect(table.innerHTML).toBe(
                    '<tbody><tr><td style="width: 120px; border-color: rgb(171, 171, 171); border-width: 1px; border-style: solid;"><br></td></tr></tbody>'
                );
            },
        } as IEditor;

        spyOn(createFormatContextFromEditor, 'createFormatContextFromEditor').and.returnValue(
            context
        );

        insertTable(editor, 1, 1);
    });
});
