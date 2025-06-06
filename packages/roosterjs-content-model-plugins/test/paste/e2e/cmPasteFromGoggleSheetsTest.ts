import { expectEqual, initEditor } from './testUtils';
import { googleSheetsHtmlClipboard } from './htmlTemplates/htmlFromGoogleSheetsClipboardContent';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Google Sheets E2E', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor('Google Sheets E2E');
    });

    afterEach(() => {
        document.getElementById('Google Sheets E2E')?.remove();
    });

    itChromeOnly('E2E', () => {
        paste(editor, googleSheetsHtmlClipboard);
        const model = editor.getContentModelCopy('connected');

        expectEqual(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            element: jasmine.anything() as any,
                            blockType: 'BlockGroup',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                            blockGroupType: 'General',
                            blocks: [
                                {
                                    widths: [],
                                    rows: [
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                        fontWeight: 'bold',
                                                                        underline: true,
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        backgroundColor: 'rgb(255, 255, 255)',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                        fontWeight: 'bold',
                                                                        underline: true,
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        backgroundColor: 'rgb(255, 255, 255)',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                        fontWeight: 'bold',
                                                                        underline: true,
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: { direction: 'ltr' },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        backgroundColor: 'rgb(255, 255, 255)',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
                                            cells: [
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
                                            cells: [
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
                                            cells: [
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
                                            cells: [
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                                {
                                                    spanAbove: false,
                                                    spanLeft: false,
                                                    isHeader: false,
                                                    blockGroupType: 'TableCell',
                                                    blocks: [],
                                                    format: {
                                                        direction: 'ltr',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                        {
                                            height: 0,
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
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
                                                                    text: '■■■',
                                                                    segmentType: 'Text',
                                                                    format: {
                                                                        fontFamily: '"Courier New"',
                                                                        fontSize: '10pt',
                                                                    },
                                                                },
                                                            ],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                        {
                                                            isImplicit: true,
                                                            segments: [],
                                                            blockType: 'Paragraph',
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'end',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'end',
                                                        paddingTop: '2px',
                                                        paddingRight: '3px',
                                                        paddingBottom: '2px',
                                                        paddingLeft: '3px',
                                                        verticalAlign: 'bottom',
                                                        width: '100px',
                                                        height: '21px',
                                                    },
                                                    dataset: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Table',
                                    format: {
                                        direction: 'ltr',
                                        width: '0px',
                                        tableLayout: 'fixed',
                                        useBorderBox: true,
                                        borderCollapse: true,
                                    },
                                    dataset: { sheetsRoot: '1', sheetsBaot: '1' },
                                },
                            ],
                            segmentType: 'General',
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
                {
                    segments: [
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: '#000000',
                                backgroundColor: '',
                                fontWeight: '',
                                italic: false,
                                letterSpacing: '',
                                lineHeight: '',
                                strikethrough: false,
                                superOrSubScriptSequence: '',
                                underline: false,
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        });
    });
});
