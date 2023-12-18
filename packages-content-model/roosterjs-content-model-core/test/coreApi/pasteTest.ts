import * as addParserF from '../../../roosterjs-content-model-plugins/lib/paste/utils/addParser';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as ExcelF from '../../../roosterjs-content-model-plugins/lib/paste/Excel/processPastedContentFromExcel';
import * as getPasteSourceF from '../../../roosterjs-content-model-plugins/lib/paste/pasteSourceValidations/getPasteSource';
import * as getSelectedSegmentsF from '../../lib/publicApi/selection/collectSelections';
import * as mergeModelFile from '../../lib/publicApi/model/mergeModel';
import * as PPT from '../../../roosterjs-content-model-plugins/lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from '../../../roosterjs-content-model-plugins/lib/paste/utils/setProcessor';
import * as WacComponents from '../../../roosterjs-content-model-plugins/lib/paste/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from '../../../roosterjs-content-model-plugins/lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { BeforePasteEvent, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelEditor } from 'roosterjs-content-model-editor';
import { ContentModelPastePlugin } from '../../../roosterjs-content-model-plugins/lib/paste/ContentModelPastePlugin';
import { createContentModelDocument, tableProcessor } from 'roosterjs-content-model-dom';
import { mergePasteContent } from '../../lib/coreApi/paste';
import {
    ClipboardData,
    ContentModelDocument,
    DomToModelOption,
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';
import {
    expectEqual,
    initEditor,
} from '../../../roosterjs-content-model-plugins/test/paste/e2e/testUtils';

let clipboardData: ClipboardData;

const DEFAULT_TIMES_ADD_PARSER_CALLED = 4;

describe('Paste ', () => {
    let editor: IStandaloneEditor & IEditor;
    let createContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let mockedMergeModel: ContentModelDocument;
    let getFocusedPosition: jasmine.Spy;
    let getContent: jasmine.Spy;
    let getVisibleViewport: jasmine.Spy;
    let mergeModelSpy: jasmine.Spy;
    let formatResult: boolean | undefined;
    let context: FormatWithContentModelContext | undefined;

    const mockedPos = 'POS' as any;

    let div: HTMLDivElement;

    beforeEach(() => {
        spyOn(domToContentModel, 'domToContentModel').and.callThrough();
        clipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: <File>null!,
            rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
            customValues: {},
            imageDataUri: <string>null!,
        };
        div = document.createElement('div');
        document.body.appendChild(div);
        mockedModel = {
            blockGroupType: 'Document',
            blocks: [],
        } as ContentModelDocument;

        mockedMergeModel = ({} as any) as ContentModelDocument;

        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        focus = jasmine.createSpy('focus');
        getFocusedPosition = jasmine.createSpy('getFocusedPosition').and.returnValue(mockedPos);
        getContent = jasmine.createSpy('getContent');
        getVisibleViewport = jasmine.createSpy('getVisibleViewport');
        mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => {
            mockedModel = mockedMergeModel;
            return null;
        });
        spyOn(getSelectedSegmentsF, 'getSelectedSegments').and.returnValue([
            {
                format: {
                    fontSize: '1pt',
                    fontFamily: 'Arial',
                },
            } as any,
        ]);
        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (
                    core: any,
                    callback: ContentModelFormatter,
                    options: FormatWithContentModelOptions
                ) => {
                    context = {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    };
                    formatResult = callback(mockedModel, context);
                }
            );

        formatResult = undefined;
        context = undefined;

        editor = new ContentModelEditor(div, {
            plugins: [new ContentModelPastePlugin()],
            coreApiOverride: {
                focus,
                createContentModel,
                getContent,
                getVisibleViewport,
                formatContentModel,
            },
        });

        spyOn(editor, 'getDocument').and.callThrough();
        spyOn(editor, 'triggerPluginEvent').and.callThrough();
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        try {
            editor.paste(clipboardData);
        } catch (e) {
            console.log(e);
        }

        expect(formatResult).toBeTrue();
        expect(mockedModel).toEqual(mockedMergeModel);
    });

    it('Execute | As plain text', () => {
        editor.paste(clipboardData, true /* asText */);

        expect(formatResult).toBeTrue();
        expect(mockedModel).toEqual(mockedMergeModel);
    });

    it('Preserve segment format after paste', () => {
        const mockedNode = 'Node' as any;
        const mockedOffset = 'Offset' as any;
        const mockedFormat = {
            fontFamily: 'Arial',
        };
        clipboardData.rawHtml =
            '<span style="font-size: 100px; background-color: black">test</span>';
        getFocusedPosition.and.returnValue({
            node: mockedNode,
            offset: mockedOffset,
        });
        mergeModelSpy.and.returnValue({
            marker: {
                format: mockedFormat,
            },
        });

        editor.paste(clipboardData);

        editor.createContentModel(<DomToModelOption>{
            processorOverride: {
                table: tableProcessor,
            },
        });

        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: {
                backgroundColor: '',
                fontFamily: 'Arial',
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
        });
    });
});

describe('paste with content model & paste plugin', () => {
    let editor: ContentModelEditor | undefined;
    let div: HTMLDivElement | undefined;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        editor = new ContentModelEditor(div, {
            plugins: [new ContentModelPastePlugin()],
        });
        spyOn(addParserF, 'default').and.callThrough();
        spyOn(setProcessorF, 'setProcessor').and.callThrough();
        clipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: <File>null!,
            rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
            customValues: {},
            imageDataUri: <string>null!,
        };
    });

    afterEach(() => {
        editor?.dispose();
        editor = undefined;
        div?.remove();
        div = undefined;
    });

    it('Word Desktop', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wordDesktop');
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        editor?.paste(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        editor?.paste(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(4);
        expect(addParserF.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 5);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.paste(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('Excel Desktop', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.paste(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('PowerPoint', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        editor?.paste(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
    });

    // Plain Text
    it('Word Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wordDesktop');
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        editor?.paste(clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(0);
    });

    it('Word Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        editor?.paste(clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(0);
    });

    it('Excel Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.paste(clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('Excel Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.paste(clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('PowerPoint | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        editor?.paste(clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(0);
    });

    it('Verify the event data is not lost', () => {
        clipboardData = {
            types: ['image/png', 'text/plain', 'text/html'],
            text: 'Flight\tDescription\r\n',
            image: <File>{},
            files: [],
            rawHtml:
                '<html xmlns:v="urn:schemas-microsoft-com:vml"\r\nxmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:x="urn:schemas-microsoft-com:office:excel"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Excel.Sheet>\r\n<meta name=Generator content="Microsoft Excel 15">\r\n<link id=Main-File rel=Main-File\r\nhref="">\r\n<link rel=File-List\r\nhref="">\r\n<!--[if !mso]>\r\n<style>\r\nv\\:* {behavior:url(#default#VML);}\r\no\\:* {behavior:url(#default#VML);}\r\nx\\:* {behavior:url(#default#VML);}\r\n.shape {behavior:url(#default#VML);}\r\n</style>\r\n<![endif]-->\r\n<style>\r\n<!--table\r\n\t{mso-displayed-decimal-separator:"\\.";\r\n\tmso-displayed-thousand-separator:"\\,";}\r\n@page\r\n\t{margin:.75in .7in .75in .7in;\r\n\tmso-header-margin:.3in;\r\n\tmso-footer-margin:.3in;}\r\ntr\r\n\t{}\r\ncol\r\n\t{mso-width-source:auto;}\r\nbr\r\n\t{mso-data-placement:same-cell;}\r\ntd\r\n\t{padding:0px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\tmso-number-format:General;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\tmso-background-source:auto;\r\n\tmso-pattern:auto;\r\n\tmso-protection:locked visible;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n.xl65\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\tvertical-align:middle;\r\n\tborder-top:none;\r\n\tborder-right:none;\r\n\tborder-bottom:none;\r\n\tborder-left:1.0pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;\r\n\twhite-space:normal;}\r\n.xl66\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\tvertical-align:middle;\r\n\tbackground:white;\r\n\tmso-pattern:black none;\r\n\twhite-space:normal;}\r\n-->\r\n</style>\r\n</head>\r\n\r\n<body link="#0563C1" vlink="#954F72">\r\n\r\n<table border=0 cellpadding=0 cellspacing=0  style=\'border-collapse:\r\n collapse;\'>\r\n <col  style=\'mso-width-source:userset;mso-width-alt:9512;\'>\r\n <col  style=\'\'>\r\n <tr>\r\n<!--StartFragment-->\r\n  <td class=xl65  style=\'\r\n  font-size:11.0pt;color:black;font-weight:700;text-decoration:none;text-underline-style:\r\n  none;text-line-through:none;font-family:Calibri, sans-serif;border-top:1.0pt solid windowtext;\r\n  border-right:.5pt solid #FFC000;border-bottom:1.0pt solid #FFC000;border-left:\r\n  1.0pt solid windowtext;background:white;mso-pattern:black none\'>Flight</td>\r\n  <td class=xl66  style=\'font-size:11.0pt;color:black;\r\n  font-weight:700;text-decoration:none;text-underline-style:none;text-line-through:\r\n  none;font-family:Calibri, sans-serif;border-top:1.0pt solid windowtext;\r\n  border-right:.5pt solid #FFC000;border-bottom:1.0pt solid #FFC000;border-left:\r\n  .5pt solid #FFC000;background:white;mso-pattern:black none\'>Description</td>\r\n<!--EndFragment-->\r\n </tr>\r\n</table>\r\n\r\n</body>\r\n\r\n</html>\r\n',
            customValues: {},
            pasteNativeEvent: true,
            imageDataUri: '',
        };

        let eventChecker: BeforePasteEvent = <any>{};
        editor = new ContentModelEditor(div!, {
            plugins: [
                {
                    initialize: () => {},
                    dispose: () => {},
                    getName: () => 'test',
                    onPluginEvent(event: PluginEvent) {
                        if (event.eventType === PluginEventType.BeforePaste) {
                            eventChecker = event;
                        }
                    },
                },
            ],
        });

        editor?.paste(clipboardData);

        expect(eventChecker?.clipboardData).toEqual(clipboardData);
        expect(eventChecker?.htmlBefore).toBeTruthy();
        expect(eventChecker?.htmlAfter).toBeTruthy();
        expect(eventChecker?.pasteType).toEqual(0);
    });
});

describe('mergePasteContent', () => {
    it('merge table', () => {
        // A doc with only one table in content
        const pasteModel: ContentModelDocument = {
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
                                                    text: 'FromPaste',
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
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [],
                    dataset: {
                        editingInfo: '',
                    },
                },
            ],
        };

        // A doc with a table, and selection marker inside of it.
        const sourceModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                { segmentType: 'Br', format: {} },
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
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [120, 120],
                    dataset: {
                        editingInfo: '',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
            format: {},
        };

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();

        mergePasteContent(
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            pasteModel,
            false /* applyCurrentFormat */,
            undefined /* customizedMerge */
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'none',
                mergeTable: true,
            }
        );
        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
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
                                                    text: 'FromPaste',
                                                    format: {},
                                                },
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {
                                        useBorderBox: true,
                                        borderTop: '1px solid #ABABAB',
                                        borderInlineEnd: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderInlineStart: '1px solid #ABABAB',
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [120, 120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('customized merge', () => {
        const pasteModel: ContentModelDocument = createContentModelDocument();
        const sourceModel: ContentModelDocument = createContentModelDocument();

        const customizedMerge = jasmine.createSpy('customizedMerge');

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();

        mergePasteContent(
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            pasteModel,
            false /* applyCurrentFormat */,
            customizedMerge /* customizedMerge */
        );

        expect(mergeModelFile.mergeModel).not.toHaveBeenCalled();
        expect(customizedMerge).toHaveBeenCalledWith(sourceModel, pasteModel);
    });

    it('Apply current format', () => {
        const pasteModel: ContentModelDocument = createContentModelDocument();
        const sourceModel: ContentModelDocument = createContentModelDocument();

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();

        mergePasteContent(
            sourceModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            pasteModel,
            true /* applyCurrentFormat */,
            undefined /* customizedMerge */
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
            }
        );
    });
});

describe('Paste with clipboardData', () => {
    let editor: IEditor & IStandaloneEditor = undefined!;
    const ID = 'EDITOR_ID';

    beforeEach(() => {
        editor = initEditor(ID);
        clipboardData = <ClipboardData>(<any>{
            types: ['text/plain', 'text/html'],
            text: 'Test\r\nasdsad\r\n',
            image: null,
            files: [],
            rawHtml: '',
            customValues: {},
            htmlFirstLevelChildTags: ['P', 'P'],
            html: '',
        });
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(ID)?.remove();
    });

    it('Remove windowtext from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><p style="color: windowtext;">Test</p></body></html>';

        editor.paste(clipboardData);

        const model = editor.createContentModel(<DomToModelOption>{
            processorOverride: {
                table: tableProcessor,
            },
        });

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
            ],
            format: {},
        });
    });

    it('Remove unsupported url of link from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><a href="file://mylocalfile">Link</a></body></html>';

        editor.paste(clipboardData);

        const model = editor.createContentModel(<DomToModelOption>{
            processorOverride: {
                table: tableProcessor,
            },
        });

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        { text: 'Link', segmentType: 'Text', format: {} },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
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

    it('Keep supported url of link from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><a href="https://github.com/microsoft/roosterjs">Link</a></body></html>';

        editor.paste(clipboardData);

        const model = editor.createContentModel(<DomToModelOption>{
            processorOverride: {
                table: tableProcessor,
            },
        });

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            text: 'Link',
                            segmentType: 'Text',
                            format: {},
                            link: {
                                format: {
                                    underline: true,
                                    href: 'https://github.com/microsoft/roosterjs',
                                },
                                dataset: {},
                            },
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                            link: {
                                format: {
                                    underline: true,
                                    href: 'https://github.com/microsoft/roosterjs',
                                },
                                dataset: {},
                            },
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
