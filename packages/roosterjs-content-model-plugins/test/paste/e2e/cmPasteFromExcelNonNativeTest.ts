import * as processPastedContentFromExcel from '../../../lib/paste/Excel/processPastedContentFromExcel';
import { excelContentFromNonNativeTemplate } from './htmlTemplates/htmlFromExcelNonNative';
import { expectEqual, initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { ClipboardData, IEditor } from 'roosterjs-content-model-types';

describe('Paste from Excel non native', () => {
    let editor: IEditor = undefined!;

    beforeEach(() => {
        editor = initEditor('Paste_from_Excel_non_native');
    });

    afterEach(() => {
        document.getElementById('Paste_from_Excel_non_native')?.remove();
    });

    it('E2E', () => {
        const clipboardData = {
            types: ['web data/shadow-workbook', 'image/png', 'text/plain', 'text/html'],
            text: '\r\n',
            image: {},
            files: [{}],
            rawHtml: excelContentFromNonNativeTemplate,
            customValues: {},
            pasteNativeEvent: true,
            imageDataUri: null,
        } as ClipboardData;
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        paste(editor, clipboardData);
        const model = editor.getContentModelCopy('connected');

        expect(processPastedContentFromExcel.processPastedContentFromExcel).toHaveBeenCalled();

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: jasmine.anything() as any,
                    rows: [
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {
                                        borderTop: '1px solid rgb(212, 212, 212)',
                                        borderRight: '1px solid rgb(212, 212, 212)',
                                        borderBottom: '1px solid rgb(212, 212, 212)',
                                        borderLeft: '1px solid rgb(212, 212, 212)',
                                        width: '50pt',
                                        height: '14.4pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [],
                                    format: {
                                        borderTop: '1px solid rgb(212, 212, 212)',
                                        borderRight: '1px solid rgb(212, 212, 212)',
                                        borderBottom: '1px solid rgb(212, 212, 212)',
                                        borderLeft: '1px solid rgb(212, 212, 212)',
                                        width: '50pt',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        width: '100pt',
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    dataset: {},
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {
                                backgroundColor: '',
                                fontFamily: '',
                                fontSize: '',
                                fontWeight: '',
                                italic: false,
                                letterSpacing: '',
                                lineHeight: '',
                                strikethrough: false,
                                superOrSubScriptSequence: '',
                                textColor: '',
                                underline: false,
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        });
    });
});
