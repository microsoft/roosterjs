import * as addParserF from '../../../lib/editor/plugins/PastePlugin/utils/addParser';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as ExcelF from '../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import * as getPasteSourceF from 'roosterjs-editor-dom/lib/pasteSourceValidations/getPasteSource';
import * as mergeModelFile from '../../../lib/modelApi/common/mergeModel';
import * as pasteF from '../../../lib/publicApi/utils/paste';
import * as PPT from '../../../lib/editor/plugins/PastePlugin/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from '../../../lib/editor/plugins/PastePlugin/utils/setProcessor';
import * as WacComponents from '../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from '../../../lib/editor/plugins/PastePlugin/WordDesktop/processPastedContentFromWordDesktop';
import ContentModelEditor from '../../../lib/editor/ContentModelEditor';
import ContentModelPastePlugin from '../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    BeforePasteEvent,
    ClipboardData,
    KnownPasteSourceType,
    PasteType,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

let clipboardData: ClipboardData;

describe('Paste ', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let mockedMergeModel: ContentModelDocument;
    let getFocusedPosition: jasmine.Spy;
    let getContent: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;
    let getDocument: jasmine.Spy;
    let getTrustedHTMLHandler: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let undoSnapshotResult: any;

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
        mockedModel = ({} as any) as ContentModelDocument;
        mockedMergeModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine
            .createSpy('addUndoSnapshot')
            .and.callFake(callback => (undoSnapshotResult = callback()));
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');
        getFocusedPosition = jasmine.createSpy('getFocusedPosition').and.returnValue(mockedPos);
        getContent = jasmine.createSpy('getContent');
        getDocument = jasmine.createSpy('getDocument').and.returnValue(document);
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent').and.returnValue({
            clipboardData,
            fragment: document.createDocumentFragment(),
            sanitizingOption: {
                elementCallbacks: {},
                attributeCallbacks: {},
                cssStyleCallbacks: {},
                additionalTagReplacements: {},
                additionalAllowedAttributes: [],
                additionalAllowedCssClasses: [],
                additionalDefaultStyleValues: {},
                additionalGlobalStyleNodes: [],
                additionalPredefinedCssForElement: {},
                preserveHtmlComments: false,
                unknownTagReplacement: null,
            },
            htmlBefore: '',
            htmlAfter: '',
            htmlAttributes: {},
            domToModelOption: {},
            pasteType: PasteType.Normal,
        });
        getTrustedHTMLHandler = jasmine
            .createSpy('getTrustedHTMLHandler')
            .and.returnValue((html: string) => html);
        spyOn(mergeModelFile, 'mergeModel').and.callFake(() => (mockedModel = mockedMergeModel));

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            getFocusedPosition,
            getContent,
            getSelectionRange,
            getDocument,
            getTrustedHTMLHandler,
            triggerPluginEvent,
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        pasteF.default(editor, clipboardData, false, false, false);

        expect(setContentModel).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(getFocusedPosition).not.toHaveBeenCalled();
        expect(getContent).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled();
        expect(getTrustedHTMLHandler).toHaveBeenCalled();
        expect(mockedModel).toEqual(mockedMergeModel);
        expect(clipboardData).toEqual(undoSnapshotResult);
    });

    it('Execute | As plain text', () => {
        pasteF.default(editor, clipboardData, true /* asPlainText */, false, false);

        expect(setContentModel).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(getFocusedPosition).not.toHaveBeenCalled();
        expect(getContent).toHaveBeenCalled();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled();
        expect(getTrustedHTMLHandler).toHaveBeenCalled();
        expect(mockedModel).toEqual(mockedMergeModel);
        expect(clipboardData).toEqual(undoSnapshotResult);
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
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.default).toHaveBeenCalledTimes(4);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(4);
        expect(addParserF.default).toHaveBeenCalledTimes(5);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelOnline);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(2);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('Excel Desktop', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelDesktop);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(2);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('PowerPoint', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.PowerPointDesktop);
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(1);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
    });

    // Plain Text
    it('Word Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(0);
    });

    it('Word Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(0);
    });

    it('Excel Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelOnline);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('Excel Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelDesktop);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('PowerPoint | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.PowerPointDesktop);
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

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

        pasteF.default(editor!, clipboardData);

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

        pasteF.mergePasteContent(
            sourceModel,
            { deletedEntities: [] },
            pasteModel,
            false /* applyCurrentFormat */,
            undefined /* customizedMerge */
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { deletedEntities: [] },
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
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
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

        pasteF.mergePasteContent(
            sourceModel,
            { deletedEntities: [] },
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

        pasteF.mergePasteContent(
            sourceModel,
            { deletedEntities: [] },
            pasteModel,
            true /* applyCurrentFormat */,
            undefined /* customizedMerge */
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { deletedEntities: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
            }
        );
    });
});
