import * as processPastedContentFromExcel from '../../../lib/paste/Excel/processPastedContentFromExcel';
import { expectEqual, initEditor } from './testUtils';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { tableProcessor } from 'roosterjs-content-model-dom';
import type { ClipboardData, IStandaloneEditor } from 'roosterjs-content-model-types';

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

describe(ID, () => {
    let editor: IStandaloneEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
    });

    afterEach(() => {
        document.getElementById(ID)?.remove();
    });

    itChromeOnly('E2E', () => {
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        editor.pasteFromClipboard(clipboardData);
        editor.createContentModel({});

        expect(processPastedContentFromExcel.processPastedContentFromExcel).toHaveBeenCalled();
    });

    itChromeOnly('E2E paste as image', () => {
        spyOn(processPastedContentFromExcel, 'processPastedContentFromExcel').and.callThrough();

        editor.pasteFromClipboard(clipboardData, 'asImage');

        const model = editor.createContentModel({
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
                            format: {
                                maxWidth: '100px',
                            },
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
            format: {},
        });
        expect(processPastedContentFromExcel.processPastedContentFromExcel).not.toHaveBeenCalled();
    });

    itChromeOnly('Copy Table with text color in cell', () => {
        const CD = <ClipboardData>(<any>{
            types: ['image/png', 'text/plain', 'text/html'],
            text:
                'No.\tID\tWork Item Type\r\n1\tlink\tBug\r\n2\tlink\tBug\r\n3\tlink\tBug\r\n4\tlink\tBug\r\n5\tlink\tBug\r\n6\tlink\tBug\r\n7\tlink\tBug\r\n',
            image: {},
            files: [],
            rawHtml:
                "<html xmlns:v=\"urn:schemas-microsoft-com:vml\"\r\nxmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\nxmlns:x=\"urn:schemas-microsoft-com:office:excel\"\r\nxmlns=\"http://www.w3.org/TR/REC-html40\">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">\r\n<meta name=ProgId content=Excel.Sheet>\r\n<meta name=Generator content=\"Microsoft Excel 15\">\r\n<link id=Main-File rel=Main-File\r\nhref=\"file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip.htm\">\r\n<link rel=File-List\r\nhref=\"file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml\">\r\n<style>\r\n<!--table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\n@page\r\n\t{margin:.75in .7in .75in .7in;\r\n\tmso-header-margin:.3in;\r\n\tmso-footer-margin:.3in;}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\nbr\r\n\t{mso-data-placement:same-cell;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\tmso-number-format:General;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\tmso-background-source:auto;\r\n\tmso-pattern:auto;\r\n\tmso-protection:locked visible;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n.xl68\r\n\t{background:white;\r\n\tmso-pattern:black none;}\r\n.xl69\r\n\t{background:white;\r\n\tmso-pattern:black none;}\r\n.xl70\r\n\t{text-align:center;\r\n\tvertical-align:middle;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl71\r\n\t{text-align:center;\r\n\tvertical-align:middle;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl72\r\n\t{color:#0563C1;\r\n\ttext-decoration:underline;\r\n\ttext-underline-style:single;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl73\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;\r\n\twhite-space:normal;}\r\n.xl74\r\n\t{color:black;\r\n\tfont-weight:700;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl75\r\n\t{color:black;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n.xl76\r\n\t{color:#DBDBDB;\r\n\ttext-align:center;\r\n\tvertical-align:middle;\r\n\tborder:.5pt solid windowtext;\r\n\tbackground:white;\r\n\tmso-pattern:black none;}\r\n-->\r\n</style>\r\n</head>\r\n\r\n<body link=\"#0563C1\" vlink=\"#954F72\">\r\n\r\n<table border=0 cellpadding=0 cellspacing=0 width=227 style='border-collapse:\r\n collapse;width:170pt'>\r\n<!--StartFragment-->\r\n <col width=70 style='width:52pt'>\r\n <col width=75 style='mso-width-source:userset;mso-width-alt:2519;width:56pt'>\r\n <col width=82 style='mso-width-source:userset;mso-width-alt:2775;width:62pt'>\r\n <tr height=38 style='mso-height-source:userset;height:28.5pt'>\r\n  <td height=38 class=xl74 width=70 style='height:28.5pt;width:52pt'>No.</td>\r\n  <td class=xl74 width=75 style='border-left:none;width:56pt'>ID</td>\r\n  <td class=xl73 width=82 style='border-left:none;width:62pt'>Work Item Type</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>1</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>2</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>3</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>4</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>5</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>6</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n <tr height=40 style='mso-height-source:userset;height:30.0pt'>\r\n  <td height=40 class=xl75 style='height:30.0pt;border-top:none'>7</td>\r\n  <td class=xl72 style='border-top:none;border-left:none'><a\r\n  href=\"http://www.microsoft.com/\">link</a></td>\r\n  <td class=xl76 style='border-top:none;border-left:none'>Bug</td>\r\n </tr>\r\n<!--EndFragment-->\r\n</table>\r\n\r\n</body>\r\n\r\n</html>\r\n",
            customValues: {},
            pasteNativeEvent: true,
            imageDataUri: '',
            snapshotBeforePaste: '<br><!--{"start":[0],"end":[0]}-->',
        });

        editor.pasteFromClipboard(CD);

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
                                        width: '52pt',
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
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '56pt',
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
                                            },
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '0.5pt solid',
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '62pt',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        borderLeft: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        height: '30pt',
                                        width: '69.333px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '74.667px',
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
                                        borderRight: '0.5pt solid',
                                        borderBottom: '0.5pt solid',
                                        backgroundColor: 'white',
                                        paddingTop: '1px',
                                        paddingRight: '1px',
                                        paddingLeft: '1px',
                                        verticalAlign: 'middle',
                                        width: '82.667px',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        width: jasmine.anything(),
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
