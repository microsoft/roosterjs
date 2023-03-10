import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import deleteContent from '../../../lib/publicApi/editing/handleDelete';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('handleDelete', () => {
    let editor: IContentModelEditor;
    const mockedPos = 'POS' as any;

    beforeEach(() => {
        editor = ({
            getFocusedPosition: () => mockedPos,
        } as any) as IContentModelEditor;

        spyOn(pendingFormat, 'setPendingFormat');
    });

    it('delete without selection', () => {
        editor.createContentModel = () => ({
            blockGroupType: 'Document',
            blocks: [],
        });

        deleteContent(editor, 'delete');

        expect(pendingFormat.setPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('delete with expanded selection', () => {
        editor.createContentModel = () => ({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontSize: '10pt',
                            },
                        },
                    ],
                },
            ],
        });

        deleteContent(editor, 'delete');

        expect(pendingFormat.setPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.setPendingFormat).toHaveBeenCalledWith(
            editor,
            {
                fontSize: '10pt',
            },
            mockedPos
        );
    });

    it('backspace with expanded selection', () => {
        editor.createContentModel = () => ({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontSize: '10pt',
                            },
                        },
                    ],
                },
            ],
        });

        deleteContent(editor, 'backspace');

        expect(pendingFormat.setPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.setPendingFormat).toHaveBeenCalledWith(
            editor,
            {
                fontSize: '10pt',
            },
            mockedPos
        );
    });

    it('backspace with collapsed selection', () => {
        editor.createContentModel = () => ({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                fontSize: '10pt',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });

        deleteContent(editor, 'backspace');

        expect(pendingFormat.setPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.setPendingFormat).toHaveBeenCalledWith(
            editor,
            {
                fontSize: '10pt',
            },
            mockedPos
        );
    });
});
