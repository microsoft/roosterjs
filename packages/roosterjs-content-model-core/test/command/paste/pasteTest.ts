import * as addParserF from 'roosterjs-content-model-plugins/lib/paste/utils/addParser';
import * as createPasteFragmentFile from '../../../lib/command/paste/createPasteFragment';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as ExcelF from 'roosterjs-content-model-plugins/lib/paste/Excel/processPastedContentFromExcel';
import * as generatePasteOptionFromPluginsFile from '../../../lib/command/paste/generatePasteOptionFromPlugins';
import * as getDocumentSourceF from 'roosterjs-content-model-plugins/lib/paste/pasteSourceValidations/getDocumentSource';
import * as getSelectedSegmentsF from 'roosterjs-content-model-dom/lib/modelApi/selection/collectSelections';
import * as mergeModelFile from 'roosterjs-content-model-dom/lib/modelApi/editing/mergeModel';
import * as mergePasteContentFile from '../../../lib/command/paste/mergePasteContent';
import * as PPT from 'roosterjs-content-model-plugins/lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from 'roosterjs-content-model-plugins/lib/paste/utils/setProcessor';
import * as WacComponents from 'roosterjs-content-model-plugins/lib/paste/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from 'roosterjs-content-model-plugins/lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { Editor } from '../../../lib/editor/Editor';
import { expectEqual, initEditor } from 'roosterjs-content-model-plugins/test/paste/e2e/testUtils';
import { paste } from '../../../lib/command/paste/paste';
import { PastePlugin } from 'roosterjs-content-model-plugins/lib/paste/PastePlugin';
import {
    ClipboardData,
    ContentModelDocument,
    IEditor,
    BeforePasteEvent,
    PluginEvent,
    PasteTypeOrGetter,
} from 'roosterjs-content-model-types';

let clipboardData: ClipboardData;

const DEFAULT_TIMES_ADD_PARSER_CALLED = 5; // The number of times addParser is called in PastePlugin initialization

describe('Paste ', () => {
    let editor: IEditor;
    let createContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let mockedMergeModel: ContentModelDocument;
    let getVisibleViewport: jasmine.Spy;

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
        paste(editor, clipboardData);

        expect(mockedModel).toEqual(mockedMergeModel);
    });

    it('Execute | As plain text', () => {
        paste(editor, clipboardData, 'asPlainText');

        expect(mockedModel).toEqual(mockedMergeModel);
    });

    it('Execute | With callback to return paste type', () => {
        spyOn(createPasteFragmentFile, 'createPasteFragment').and.callThrough();
        spyOn(
            generatePasteOptionFromPluginsFile,
            'generatePasteOptionFromPlugins'
        ).and.callThrough();

        const cb: PasteTypeOrGetter = () => 'normal';
        paste(editor, clipboardData, cb);

        expect(mockedModel).toEqual(mockedMergeModel);
        expect(createPasteFragmentFile.createPasteFragment).toHaveBeenCalledWith(
            jasmine.anything(),
            jasmine.anything(),
            'normal',
            jasmine.anything()
        );
        expect(
            generatePasteOptionFromPluginsFile.generatePasteOptionFromPlugins
        ).toHaveBeenCalledWith(
            jasmine.anything(),
            jasmine.anything(),
            jasmine.anything(),
            jasmine.anything(),
            'normal'
        );
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
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('wordDesktop');
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        paste(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 7);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        paste(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(3);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 7);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('Excel Desktop', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('PowerPoint', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        paste(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
    });

    // Plain Text
    it('Word Desktop | Plain Text', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('wordDesktop');
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        paste(editor!, clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(12);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online | Plain Text', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('wacComponents');
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        paste(editor!, clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(3);
        expect(addParserF.addParser).toHaveBeenCalledTimes(12);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online | Plain Text', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('excelOnline');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('Excel Desktop | Plain Text', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('excelDesktop');
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('PowerPoint | Plain Text', () => {
        spyOn(getDocumentSourceF, 'getDocumentSource').and.returnValue('powerPointDesktop');
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        paste(editor!, clipboardData, 'asPlainText');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(6);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
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

        paste(editor!, clipboardData);

        expect(eventChecker?.clipboardData).toEqual(clipboardData);
        expect(eventChecker?.htmlBefore).toBeTruthy();
        expect(eventChecker?.htmlAfter).toBeTruthy();
        expect(eventChecker?.pasteType).toEqual('normal');
    });
});

describe('Paste with clipboardData', () => {
    let editor: IEditor = undefined!;
    const ID = 'EDITOR_ID';
    let mergePasteContentSpy: jasmine.Spy;

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
        mergePasteContentSpy = spyOn(mergePasteContentFile, 'mergePasteContent').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(ID)?.remove();
    });

    it('Replace windowtext with set black font color from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><p style="color: windowtext;">Test</p></body></html>';

        paste(editor, clipboardData);

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
                        { segmentType: 'Br', format: {} },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        });
        expect(mergePasteContentSpy.calls.argsFor(0)[2]).toBeTrue();
    });

    xit('Second paste', () => {
        clipboardData.rawHtml = '';
        clipboardData.modelBeforePaste = {
            blockGroupType: 'Document',
            blocks: [],
        };

        paste(editor, clipboardData);

        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    isImplicit: true,
                    segments: [{ isSelected: true, segmentType: 'SelectionMarker', format: {} }],
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        });
        expect(mergePasteContentSpy.calls.argsFor(0)[2]).toBeFalse();
    });

    it('Remove unsupported url of link from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><a href="file://mylocalfile">Link</a></body></html>';

        paste(editor, clipboardData);

        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            text: 'Link',
                            segmentType: 'Text',
                            format: {
                                textColor: 'rgb(0, 0, 0)',
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
                                textColor: 'rgb(0,0,0)',
                                underline: false,
                            },
                        },
                    ],
                    blockType: 'Paragraph',
                    segmentFormat: { textColor: 'rgb(0, 0, 0)' },
                    format: {},
                },
            ],
            format: {},
        });
        expect(mergePasteContentSpy.calls.argsFor(0)[2]).toBeTrue();
    });

    it('Keep supported url of link from clipboardContent', () => {
        clipboardData.rawHtml =
            '<html><head></head><body><a href="https://github.com/microsoft/roosterjs">Link</a></body></html>';

        paste(editor, clipboardData);

        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            text: 'Link',
                            segmentType: 'Text',
                            format: { textColor: 'rgb(0, 0, 0)' },
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
                                textColor: 'rgb(0,0,0)',
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
                    segmentFormat: { textColor: 'rgb(0, 0, 0)' },
                    format: {},
                },
            ],
            format: {},
        });
        expect(mergePasteContentSpy.calls.argsFor(0)[2]).toBeTrue();
    });
});
