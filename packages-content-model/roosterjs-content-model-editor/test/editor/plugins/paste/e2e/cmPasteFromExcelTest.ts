import * as processPastedContentFromExcel from '../../../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import ContentModelEditor from '../../../../../lib/editor/ContentModelEditor';
import ContentModelPastePlugin from '../../../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import paste from '../../../../../lib/publicApi/utils/paste';
import { Browser } from 'roosterjs-editor-dom';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { tableProcessor } from 'roosterjs-content-model-dom';
import {
    ClipboardData,
    ExperimentalFeatures,
    PasteType,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../../../../../lib/publicTypes/IContentModelEditor';

export function initEditor(id: string) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: ContentModelEditorOptions = {
        plugins: [new ContentModelPastePlugin()],
        experimentalFeatures: [ExperimentalFeatures.ContentModelPaste],
        defaultDomToModelOptions: {
            disableCacheElement: true,
        },
    };

    let editor = new ContentModelEditor(node as HTMLDivElement, options);

    return editor as IContentModelEditor;
}

const EXCEL_DESKTOP_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

const ID = 'CM_Paste_From_Excel_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['image/png', 'text/plain', 'text/html'],
    text: 'Test\tTest\r\n',
    image: {},
    files: [],
    rawHtml: '<html xmlns:v="urn:schemas-microsoft-com:vml"\r\nxmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:x="urn:schemas-microsoft-com:office:excel"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Excel.Sheet>\r\n<meta name=Generator content="Microsoft Excel 15">\r\n<link id=Main-File rel=Main-File\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip.htm">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<style>\r\n<!--table\r\n\t{mso-displayed-decimal-separator:"\\.";\r\n\tmso-displayed-thousand-separator:"\\,";}\r\n@page\r\n\t{margin:.75in .7in .75in .7in;\r\n\tmso-header-margin:.3in;\r\n\tmso-footer-margin:.3in;}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\nbr\r\n\t{mso-data-placement:same-cell;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:"Aptos Narrow", sans-serif;\r\n\tmso-font-charset:0;\r\n\tmso-number-format:General;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\tmso-background-source:auto;\r\n\tmso-pattern:auto;\r\n\tmso-protection:locked visible;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n-->\r\n</style>\r\n</head>\r\n\r\n<body link="#467886" vlink="#96607D">\r\n\r\n<table border=0 cellpadding=0 cellspacing=0 width=134 style=\'border-collapse:\r\n collapse;width:100pt\'>\r\n <col width=67 span=2 style=\'width:50pt\'>\r\n <tr height=19 style=\'height:14.4pt\'>\r\n<!--StartFragment-->\r\n  <td height=19 width=67 style=\'height:14.4pt;width:50pt\'>Test</td>\r\n  <td width=67 style=\'width:50pt\'>Test</td>\r\n<!--EndFragment-->\r\n </tr>\r\n</table>\r\n\r\n</body>\r\n\r\n</html>\r\n'.replace(
        '\r\n',
        ''
    ),
    customValues: {},
    imageDataUri: 'https://github.com/microsoft/roosterjs',
    snapshotBeforePaste: '<div><br></div><!--{"start":[0,0],"end":[0,0]}-->',
});

const body = document.createElement('body');
const html = document.createElement('html');
document.body.appendChild(html);
html.appendChild(body);

describe(ID, () => {
    let editor: IContentModelEditor | undefined;
    let triggerPluginEvent: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let setContent: jasmine.Spy;
    let getDocument: jasmine.Spy;
    let getTrustedHTMLHandler: jasmine.Spy;
    let addUndoSnapshot: any;
    let focus: jasmine.Spy;

    beforeEach(() => {
        const node = document.createElement('div');
        node.id = ID;
        node.innerHTML = clipboardData.rawHtml!;
        node.setAttribute(EXCEL_DESKTOP_ATTRIBUTE_NAME, EXCEL_ATTRIBUTE_VALUE);
        document.body.insertBefore(node, document.body.childNodes[0]);
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent').and.returnValue({
            eventType: PluginEventType.BeforePaste,
            clipboardData: clipboardData,
            fragment: document,
            sanitizingOption: {
                additionalGlobalStyleNodes: [],
            } as any,
            htmlBefore: '',
            htmlAfter: '',
            htmlAttributes: { EXCEL_DESKTOP_ATTRIBUTE_NAME },
            domToModelOption: {
                additionalFormatParsers: {},
            },
            pasteType: PasteType.Normal,
        });
        mockedModel = ({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'bb',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
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
        } as any) as ContentModelDocument;
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        setContent = jasmine.createSpy('setContent');
        getDocument = jasmine.createSpy('getDocument').and.returnValue(document);
        getTrustedHTMLHandler = jasmine
            .createSpy('getTrustedHTMLHandler')
            .and.returnValue((html: string) => html);
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            createContentModel,
            setContentModel,
            triggerPluginEvent,
            setContent,
            getDocument,
            getTrustedHTMLHandler,
            addUndoSnapshot,
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        editor = undefined;
        document.getElementById(ID)?.remove();
    });

    it('E2E', () => {
        if (Browser.isFirefox) {
            return;
        }
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData);

        expect(processPastedContentFromExcel.processPastedContentFromExcel).toHaveBeenCalled();
    });

    it('E2E paste a simage', () => {
        if (Browser.isFirefox) {
            return;
        }
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData, false, false, true);
        const model = editor!.createContentModel({
            processorOverride: {
                table: tableProcessor,
            },
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'https://github.com/microsoft/roosterjs',
                            format: { maxWidth: '100%' },
                            dataset: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
        });
        expect(processPastedContentFromExcel.processPastedContentFromExcel).not.toHaveBeenCalled();
    });
});
