import * as processPastedContentFromExcel from '../../../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import paste from '../../../../../lib/publicApi/utils/paste';
import { ClipboardData, PasteType, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../../../lib/publicTypes/IContentModelEditor';

const PROG_ID_NAME = 'ProgId';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

const ID = 'CM_Paste_From_ExcelOnline_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['text/plain', 'text/html'],
    text: 'Test\tTest',
    image: null,
    files: [],
    rawHtml:
        "<html>\r\n<body>\r\n<!--StartFragment--><div  ccp_infra_version='3' ProgId='urn:schemas-microsoft-com:office:excel' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div><!--EndFragment-->\r\n</body>\r\n</html>",
    customValues: {},
    snapshotBeforePaste: '<br><!--{"start":[0],"end":[0]}-->',
    htmlFirstLevelChildTags: ['DIV'],
    html:
        "<div ccp_infra_version='3' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div>",
});

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
        node.setAttribute(PROG_ID_NAME, EXCEL_ONLINE_ATTRIBUTE_VALUE);
        document.body.insertBefore(node, document.body.childNodes[0]);
        spyOn(document, 'querySelectorAll').and.callThrough();
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent').and.returnValue({
            eventType: PluginEventType.BeforePaste,
            clipboardData: clipboardData,
            fragment: document,
            sanitizingOption: {
                additionalGlobalStyleNodes: [],
            } as any,
            htmlBefore: '',
            htmlAfter: '',
            htmlAttributes: { PROG_ID_NAME },
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
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        paste(editor!, clipboardData);

        expect(processPastedContentFromExcel.processPastedContentFromExcel).toHaveBeenCalled();
    });
});
