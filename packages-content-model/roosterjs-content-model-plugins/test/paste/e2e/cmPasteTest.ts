import * as wordFile from '../../../lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { ClipboardData, DomToModelOption } from 'roosterjs-content-model-types';
import { expectEqual, initEditor } from './testUtils';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { tableProcessor } from 'roosterjs-content-model-dom';

const ID = 'CM_Paste_E2E';

describe(ID, () => {
    let editor: IContentModelEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
        spyOn(wordFile, 'processPastedContentFromWordDesktop').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        editor = undefined!;
        document.getElementById(ID)?.remove();
    });

    itChromeOnly('Paste Table and keep borders', () => {
        const clipboardData = <ClipboardData>(<any>{
            types: ['text/plain', 'text/html'],
            text: 'No.\r\nID\r\nWork Item Type',
            image: null,
            files: [],
            rawHtml:
                '<html>\r\n<body>\r\n<!--StartFragment--><table style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-variant-position: inherit; font-weight: 400; font-stretch: inherit; font-size: 15px; line-height: inherit; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web (West European)&quot;, &quot;Segoe UI&quot;, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; color: rgb(0, 0, 0); letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: 170pt; border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;"><tbody><tr><td data-ogsb="white" style="white-space: nowrap; text-align: center; border-width: 0.5pt; border-style: solid; border-color: initial; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 52pt; height: 28.5pt; background-color: white !important;"><div style="border: 0px; font: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: inherit; text-align: center; white-space: nowrap;"><span data-ogsc="black" style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: 700; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Calibri, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black !important;">No.</span></div></td><td data-ogsb="white" style="white-space: nowrap; text-align: center; border-top: 0.5pt solid; border-right: 0.5pt solid; border-bottom: 0.5pt solid; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 56pt; background-color: white !important;"><div style="border: 0px; font: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: inherit; text-align: center; white-space: nowrap;"><span data-ogsc="black" style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: 700; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Calibri, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black !important;">ID</span></div></td><td data-ogsb="white" style="white-space: normal; text-align: center; border-top: 0.5pt solid; border-right: 0.5pt solid; border-bottom: 0.5pt solid; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 62pt; background-color: white !important;"><div style="border: 0px; font: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: inherit; text-align: center; white-space: normal;"><span data-ogsc="black" style="border: 0px; font-style: inherit; font-variant: inherit; font-weight: 700; font-stretch: inherit; font-size: 11pt; line-height: inherit; font-family: Calibri, sans-serif; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; margin: 0px; padding: 0px; vertical-align: baseline; color: black !important;">Work Item Type</span></div></td></tr></tbody></table><!--EndFragment-->\r\n</body>\r\n</html>',
            customValues: {},
            pasteNativeEvent: true,
            snapshotBeforePaste:
                '<table style="text-align: left; white-space: normal; width: 170pt; box-sizing: border-box; border-collapse: collapse; border-spacing: 0px; background-color: rgb(255, 255, 255);"><tbody><tr><td data-ogsb="white" style="text-align: center; white-space: nowrap; border-width: 0.5pt; border-style: solid; border-color: initial; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 52pt; height: 28.5pt; background-color: white;"><div style="text-align: center; white-space: nowrap; margin: 0px;"><span style="letter-spacing: normal; font-family: Calibri, sans-serif; font-size: 11pt; font-weight: 700; color: black;">No.</span></div></td><td data-ogsb="white" style="text-align: center; white-space: nowrap; border-top: 0.5pt solid; border-right: 0.5pt solid; border-bottom: 0.5pt solid; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 56pt; background-color: white;"><div style="text-align: center; white-space: nowrap; margin: 0px;"><span style="letter-spacing: normal; font-family: Calibri, sans-serif; font-size: 11pt; font-weight: 700; color: black;">ID</span></div></td><td data-ogsb="white" style="text-align: center; white-space: normal; border-top: 0.5pt solid; border-right: 0.5pt solid; border-bottom: 0.5pt solid; padding-top: 1px; padding-right: 1px; padding-left: 1px; vertical-align: middle; width: 62pt; background-color: white;"><div style="text-align: center; white-space: normal; margin: 0px;"><span style="letter-spacing: normal; font-family: Calibri, sans-serif; font-size: 11pt; font-weight: 700; color: black;">Work Item Type</span></div></td></tr></tbody></table><div><br></div><!--{"start":[0],"end":[1,0]}-->',
        });

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
                    blockType: 'Table',
                    rows: [
                        {
                            height: <any>jasmine.anything(),
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
                                                    text: 'No.',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                marginTop: '0px',
                                                marginRight: '0px',
                                                marginBottom: '0px',
                                                marginLeft: '0px',
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
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {
                                        ogsb: 'white',
                                    },
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'ID',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                marginTop: '0px',
                                                marginRight: '0px',
                                                marginBottom: '0px',
                                                marginLeft: '0px',
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
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {
                                        ogsb: 'white',
                                    },
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'Work Item Type',
                                                    format: {
                                                        fontFamily: 'Calibri, sans-serif',
                                                        fontSize: '11pt',
                                                        fontWeight: '700',
                                                        textColor: 'black',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'center',
                                                marginTop: '0px',
                                                marginRight: '0px',
                                                marginBottom: '0px',
                                                marginLeft: '0px',
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
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {
                                        ogsb: 'white',
                                    },
                                },
                            ],
                        },
                    ],
                    format: <any>{
                        textAlign: 'start',
                        backgroundColor: 'rgb(255, 255, 255)',
                        width: '170pt',
                        useBorderBox: true,
                        borderCollapse: true,
                        textColor: 'rgb(0, 0, 0)',
                    },
                    widths: <any>jasmine.anything(),
                    dataset: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
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
                    format: {},
                },
            ],
            format: {},
        });
    });
});
