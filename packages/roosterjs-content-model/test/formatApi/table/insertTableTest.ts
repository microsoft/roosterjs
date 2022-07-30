import insertTable from '../../../lib/formatApi/table/insertTable';
import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelDocument } from '../../../lib/publicTypes/block/group/ContentModelDocument';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('insertTable', () => {
    it('insert 1*1 table', () => {
        const context: FormatContext = {
            isDarkMode: false,
            isInSelection: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
        const getDOMFromContentModel = jasmine.createSpy('getDOMFromContentModel');
        const insertNode = jasmine.createSpy('insertNode');
        const editor = ({
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
            insertNode: insertNode,
            createFormatContext: () => context,
            getDOMFromContentModel: getDOMFromContentModel,
        } as any) as IExperimentalContentModelEditor;

        insertTable(editor, 1, 1);

        expect(insertNode).toHaveBeenCalledTimes(1);
        expect(getDOMFromContentModel).toHaveBeenCalledTimes(1);

        const docModel = getDOMFromContentModel.calls.argsFor(0)[0] as ContentModelDocument;
        const tableModel = docModel.blocks[0] as ContentModelTable;

        expect(tableModel.blockType).toBe(ContentModelBlockType.Table);
        expect(tableModel.cells.length).toBe(1);
        expect(tableModel.cells[0].length).toBe(1);

        const cell = tableModel.cells[0][0];
        expect(cell.blockGroupType).toBe(ContentModelBlockGroupType.TableCell);
        expect(cell.format.width).toBe(120);

        expect(cell.blocks).toEqual([
            {
                blockType: ContentModelBlockType.Paragraph,
                segments: [{ segmentType: ContentModelSegmentType.Br }],
                isImplicit: true,
            },
        ]);
    });
});
