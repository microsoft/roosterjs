import * as processPastedContentFromExcel from '../../../lib/paste/Excel/processPastedContentFromExcel';
import { ClipboardData } from 'roosterjs-editor-types';
import { expectEqual, initEditor } from './testUtils';
import { IContentModelEditor, paste } from 'roosterjs-content-model-editor';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { tableProcessor } from 'roosterjs-content-model-dom';

const ID = 'CM_Paste_From_ExcelOnline_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['text/plain', 'text/html'],
    text: 'Test\tTest',
    image: null,
    files: [],
    rawHtml:
        "<html>\r\n<body>\r\n<!--StartFragment--><div ccp_infra_version='3' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div><!--EndFragment-->\r\n</body>\r\n</html>",
    customValues: {},
    snapshotBeforePaste: '<div><br></div><!--{"start":[0,0],"end":[0,0]}-->',
    htmlFirstLevelChildTags: ['DIV'],
    html:
        "<div ccp_infra_version='3' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div>",
});

describe(ID, () => {
    let editor: IContentModelEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
    });

    afterEach(() => {
        document.getElementById(ID)?.remove();
    });

    it('E2E', () => {
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        paste(editor, clipboardData);
        editor.createContentModel({
            processorOverride: {
                table: tableProcessor,
            },
        });

        expect(processPastedContentFromExcel.processPastedContentFromExcel).toHaveBeenCalled();
    });

    itChromeOnly('E2E Table with table cells with text color', () => {
        const CD = <ClipboardData>(<any>{
            types: ['text/plain', 'text/html'],
            text:
                'No.\tID\tWork Item Type\r\n1\tlink\tBug\r\n2\tlink\tBug\r\n3\tlink\tBug\r\n4\tlink\tBug\r\n5\tlink\tBug\r\n6\tlink\tBug\r\n7\tlink\tBug',
            image: null,
            files: [] as any,
            rawHtml:
                "<html>\r\n<body>\r\n<!--StartFragment--><div ccp_infra_version='3' ccp_infra_timestamp='1696347982050' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='5ca49c09-d93e-4bbd-af7b-8a42769fd7bf' data-ccp-timestamp='1696347982050'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n.xl30\r\n\t{color:#0563C1;\r\n\ttext-decoration:underline;\r\n\ttext-underline-style:single;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl31\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;\r\n\twhite-space:normal;}\r\n.xl32\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl33\r\n\t{color:black;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl34\r\n\t{color:#DBDBDB;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=209 style='border-collapse:collapse;width:157pt'><!--StartFragment--><col width=64 style='width:48pt'><col width=69 style='width:52pt'><col width=76 style='width:57pt'><tr height=38 style='height:28.5pt'><td width=64 height=38 class=xl32 style='width:48pt;height:28.5pt'>No.</td><td width=69 class=xl32 style='width:52pt'>ID</td><td width=76 class=xl31 style='width:57pt'>Work Item Type</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>1</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>2</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>3</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>4</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>5</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>6</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><tr height=40 style='height:30.0pt'><td height=40 class=xl33 style='height:30.0pt'>7</td><td class=xl30><a href=\"http://www.microsoft.com/\">link</a></td><td class=xl34>Bug</td></tr><!--EndFragment--></table></body></html></div><!--EndFragment-->\r\n</body>\r\n</html>",
            customValues: {},
            pasteNativeEvent: true,
            snapshotBeforePaste: '<div><br></div><!--{"start":[0,0],"end":[0,0]}-->',
        });

        paste(editor, CD);

        const model = editor.createContentModel({
            processorOverride: {
                table: tableProcessor,
            },
        });

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
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'No.',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '48pt',
                                        height: '28.5pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'ID',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '52pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Work Item Type',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'normal',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'normal',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '57pt',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '1',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '2',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '3',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '4',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '5',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '6',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: jasmine.anything() as any,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: '7',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'link',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(5, 99, 193)',
                                                        underline: true,
                                                    },
                                                    link: {
                                                        format: {
                                                            underline: true,
                                                            href: 'http://www.microsoft.com/',
                                                        },
                                                        dataset: {},
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Bug',
                                                    segmentType: 'Text',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '400',
                                                        textColor: 'rgb(219, 219, 219)',
                                                    },
                                                },
                                            ],
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        width: '157pt' as any,
                        useBorderBox: true,
                        borderCollapse: true,
                    } as any,
                    dataset: {},
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
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
