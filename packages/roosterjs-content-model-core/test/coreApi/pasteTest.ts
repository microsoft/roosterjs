import * as addParserF from 'roosterjs-content-model-plugins/lib/paste/utils/addParser';
import * as cloneModel from '../../lib/publicApi/model/cloneModel';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as ExcelF from 'roosterjs-content-model-plugins/lib/paste/Excel/processPastedContentFromExcel';
import * as getPasteSourceF from 'roosterjs-content-model-plugins/lib/paste/pasteSourceValidations/getPasteSource';
import * as getSelectedSegmentsF from '../../lib/publicApi/selection/collectSelections';
import * as mergeModelFile from '../../lib/publicApi/model/mergeModel';
import * as PPT from 'roosterjs-content-model-plugins/lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from 'roosterjs-content-model-plugins/lib/paste/utils/setProcessor';
import * as WacComponents from 'roosterjs-content-model-plugins/lib/paste/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from 'roosterjs-content-model-plugins/lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { Editor } from '../../lib/editor/Editor';
import { expectEqual, initEditor } from 'roosterjs-content-model-plugins/test/paste/e2e/testUtils';
import { PastePlugin } from 'roosterjs-content-model-plugins/lib/paste/PastePlugin';
import {
    ClipboardData,
    ContentModelDocument,
    IEditor,
    BeforePasteEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

let clipboardData: ClipboardData;

const DEFAULT_TIMES_ADD_PARSER_CALLED = 4;

describe('Paste ', () => {
    let editor: IEditor;
    let createContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let mockedMergeModel: ContentModelDocument;
    let getVisibleViewport: jasmine.Spy;

    const mockedCloneModel = 'CloneModel' as any;

    let div: HTMLDivElement;

    beforeEach(() => {
        spyOn(domToContentModel, 'domToContentModel').and.callThrough();
        spyOn(cloneModel, 'cloneModel').and.returnValue(mockedCloneModel);
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
        getVisibleViewport = jasmine.createSpy('getVisibleViewport');
        spyOn(mergeModelFile, 'mergeModel').and.callFake(() => {
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

        editor = new Editor(div, {
            plugins: [new PastePlugin()],
            coreApiOverride: {
                focus,
                createContentModel,
                getVisibleViewport,
                //                formatContentModel,
            },
        });

        spyOn(editor, 'getDocument').and.callThrough();
        spyOn(editor, 'triggerEvent').and.callThrough();
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        editor.pasteFromClipboard(clipboardData);

        expect(mockedModel).toEqual(mockedMergeModel);
    });

    it('Execute | As plain text', () => {
        editor.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(mockedModel).toEqual(mockedMergeModel);
    });
});

describe('paste with content model & paste plugin', () => {
    let editor: Editor | undefined;
    let div: HTMLDivElement | undefined;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        editor = new Editor(div, {
            plugins: [new PastePlugin()],
        });
        spyOn(addParserF, 'addParser').and.callThrough();
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

        editor?.pasteFromClipboard(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 4);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        editor?.pasteFromClipboard(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 6);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.pasteFromClipboard(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('Excel Desktop', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.pasteFromClipboard(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('PowerPoint', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        editor?.pasteFromClipboard(clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
    });

    // Plain Text
    it('Word Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wordDesktop');
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        editor?.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(0);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(0);
    });

    it('Word Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        editor?.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(0);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(0);
    });

    it('Excel Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('Excel Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        editor?.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('PowerPoint | Plain Text', () => {
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        editor?.pasteFromClipboard(clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.addParser).toHaveBeenCalledTimes(0);
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
        editor = new Editor(div!, {
            plugins: [
                {
                    initialize: () => {},
                    dispose: () => {},
                    getName: () => 'test',
                    onPluginEvent(event: PluginEvent) {
                        if (event.eventType === 'beforePaste') {
                            eventChecker = event;
                        }
                    },
                },
            ],
        });

        editor?.pasteFromClipboard(clipboardData);

        expect(eventChecker?.clipboardData).toEqual(clipboardData);
        expect(eventChecker?.htmlBefore).toBeTruthy();
        expect(eventChecker?.htmlAfter).toBeTruthy();
        expect(eventChecker?.pasteType).toEqual('normal');
    });
});

describe('Paste with clipboardData', () => {
    let editor: IEditor = undefined!;
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

    it('Replace windowtext with set black font color from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><p style="color: windowtext;">Test</p></body></html>';

        editor.pasteFromClipboard(clipboardData);

        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Test',
                            format: {
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: '',
                                backgroundColor: '',
                                fontFamily: '',
                                fontSize: '',
                                fontWeight: '',
                                italic: false,
                                letterSpacing: '',
                                lineHeight: '',
                                strikethrough: false,
                                superOrSubScriptSequence: '',
                                underline: false,
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
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

        editor.pasteFromClipboard(clipboardData);

        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        { text: 'Link', segmentType: 'Text', format: {} },
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

        editor.pasteFromClipboard(clipboardData);

        const model = editor.getContentModelCopy('connected');

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
