import * as PastePluginFile from '../../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import contentModelToDom from '../../../../lib/modelToDom/contentModelToDom';
import domToContentModel from '../../../../lib/domToModel/domToContentModel';
import { Browser, moveChildNodes } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../../../lib/publicTypes';
import { createBeforePasteEventMock } from './processPastedContentFromWordDesktopTest';
import { processPastedContentFromExcel } from '../../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';

let div: HTMLElement;
let fragment: DocumentFragment;

describe('processPastedContentFromExcelTest', () => {
    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);

        event.clipboardData.html = source;
        processPastedContentFromExcel(event, (s: string) => s);

        const model = domToContentModel(
            fragment,
            {
                isDarkMode: false,
            },
            {
                ...event.domToModelOption,
                includeRoot: true,
                disableCacheElement: true,
            }
        );
        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }

        contentModelToDom(
            document,
            div,
            model,
            {
                isDarkMode: false,
            },
            {}
        );

        //Assert
        if (expected && Browser.isChrome) {
            expect(div.innerHTML.replace(' ', '')).toBe(expected.replace(' ', ''));
        }

        div.parentElement?.removeChild(div);
    }

    it('Table', () => {
        runTest(
            '<table><tr><td>a</td><td>b</td></tr></table>',
            '<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'b',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
            }
        );
    });

    it('Table without TR', () => {
        runTest(
            '<td>a</td><td>b</td>',
            '<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    { segmentType: 'Text', text: 'a', format: {} },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    { segmentType: 'Text', text: 'b', format: {} },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
            }
        );
    });

    it('Table without TABLE', () => {
        runTest(
            '<tr><td>a</td><td>b</td></tr>',
            '<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'b',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
            }
        );
    });

    it('Table, handle borderStyle: none', () => {
        runTest(
            '<table><tr><td style="border-style:none">a</td><td style="border-style:none">b</td></tr></table>',
            '<table><tbody><tr><td style="border-width: 1px; border-style: solid; border-color: rgb(212, 212, 212);">a</td><td style="border-width: 1px; border-style: solid; border-color: rgb(212, 212, 212);">b</td></tr></tbody></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {
                                            borderBottom: 'solid 1px #d4d4d4',
                                            borderLeft: 'solid 1px #d4d4d4',
                                            borderRight: 'solid 1px #d4d4d4',
                                            borderTop: 'solid 1px #d4d4d4',
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'b',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        format: {
                                            borderBottom: 'solid 1px #d4d4d4',
                                            borderLeft: 'solid 1px #d4d4d4',
                                            borderRight: 'solid 1px #d4d4d4',
                                            borderTop: 'solid 1px #d4d4d4',
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
            }
        );
    });
});

describe('Do not run scenarios', () => {
    function runTest(source: string, result: string, excelHandler?: string) {
        // Arrange
        div?.parentElement?.removeChild(div);
        div = document.createElement('div');
        const fragment1 = document.createDocumentFragment();
        const event = createBeforePasteEventMock(fragment1);
        document.body.appendChild(div);
        // Act
        event.clipboardData.html = source;
        if (excelHandler) {
            spyOn(PastePluginFile, 'excelHandler').and.returnValue(excelHandler);
        }
        processPastedContentFromExcel(event, (s: string) => s);

        // Assert
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        moveChildNodes(div, fragment1);

        if (Browser.isChrome) {
            expect(div.innerHTML).toEqual(result);
        }
    }

    it('excel is modified', () => {
        runTest(
            '<td height=19 width=67 style="height:14.4pt;width:50pt">asd</td><td width=67 style="width:50pt">asd</td>',
            '<table><tbody><tr><td height="19" width="67" style="height:14.4pt;width:50pt">asd</td><td width="67" style="width:50pt">asd</td></tr></tbody></table>'
        );
    });

    it('excel is not modified', () => {
        const source =
            '<td height=19 width=67 style="height:14.4pt;width:50pt">asd</td><td width=67 style="width:50pt">asd</td>';
        runTest(
            source,
            '<table><tbody><tr><td height="19" width="67" style="height:14.4pt;width:50pt">asd</td><td width="67" style="width:50pt">asd</td></tr></tbody></table>',
            source
        );
    });
});
