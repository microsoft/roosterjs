import * as createFormatContextFromEditor from '../../../lib/formatApi/utils/createFormatContextFromEditor';
import insertTable from '../../../lib/formatApi/table/insertTable';
import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';

describe('insertTable', () => {
    it('insert 1*1 table', () => {
        console.log('test');
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
                expect((node.firstChild as HTMLElement).outerHTML).toBe(
                    '<table style="border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;"><tbody><tr><td style="width: 120px; border-color: gray; border-width: 1px; border-style: solid;"><br></td></tr></tbody></table>'
                );
            },
        } as IEditor;

        spyOn(createFormatContextFromEditor, 'createFormatContextFromEditor').and.returnValue(
            context
        );

        insertTable(editor, 1, 1);
    });
});
