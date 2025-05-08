import * as addParserF from '../../../lib/paste/utils/addParser';
import * as getPasteSourceF from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import * as ppt from '../../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from '../../../lib/paste/utils/setProcessor';
import { expectEqual, initEditor } from './testUtils';
import { IEditor } from 'roosterjs-content-model-types';
import { paste } from 'roosterjs-content-model-core';
import {
    pptClipboardContent1,
    pptClipboardContent2,
    pptClipboardContent3,
    pptClipboardContent4,
} from './htmlTemplates/powerPointClipboardContent';

describe('PowerPoint', () => {
    let editor: IEditor = undefined!;

    beforeAll(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    beforeEach(() => {
        editor = initEditor('PowerPoint');
        spyOn(ppt, 'processPastedContentFromPowerPoint').and.callThrough();
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('powerPointDesktop');
        spyOn(addParserF, 'addParser').and.callThrough();
        spyOn(setProcessorF, 'setProcessor').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById('PowerPoint')?.remove();
    });

    function copy(string1: any) {
        window.navigator.clipboard.writeText(JSON.stringify(string1));
    }

    it('PowerPoint 1', () => {
        paste(editor!, pptClipboardContent1, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ppt.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);

        const model = editor?.getContentModelCopy('connected');
        expect(model).toBeDefined();
        if (model) {
            expectEqual(model, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Circle',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'circle',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":9}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'square',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":3}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Square',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":10}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"❑ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Hollow\nsquare',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"❖ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '5',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":4}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"➢ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Arrow',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":12}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"✔ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Check\nmark',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '6pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '6pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '6pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '12312313',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":3}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"1) "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '13123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'ads',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-alpha',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":9}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '12312313',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":6}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"a) "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":5}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '213123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '7pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 6,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '7pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '6pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '213',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '6pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '6pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '213 ',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '5pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '123',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '5pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '5pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
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
        }
    });

    it('PowerPoint 2', () => {
        paste(editor!, pptClipboardContent2, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ppt.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);

        const model = editor?.getContentModelCopy('connected');
        expect(model).toBeDefined();
        if (model) {
            expectEqual(model, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: '"Segoe Sans Text"',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Introduction\nto Meditation',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: '"Segoe Sans Text"',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Mental\nHealth Benefits',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: '"Segoe Sans Text"',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Physical\nHealth Benefits',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: '"Segoe Sans Text"',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Enhanced\nSelf-Awareness',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: '"Segoe Sans Text"',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'disc',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Incorporating\nMeditation Into Daily Life',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        segments: [
                            {
                                isSelected: true,
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontFamily: '"Segoe Sans Text"',
                                    fontSize: '20pt',
                                    textColor: 'black',
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
                                    fontFamily: 'Aptos',
                                    fontSize: '7pt',
                                    textColor: 'black',
                                },
                            },
                        ],
                        segmentFormat: { fontFamily: 'Aptos', fontSize: '7pt', textColor: 'black' },
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            });
        }
    });

    it('PowerPoint 3', () => {
        paste(editor!, pptClipboardContent3, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ppt.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);

        const model = editor?.getContentModelCopy('connected');
        expect(model).toBeDefined();
        if (model) {
            expectEqual(model, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                            listStyleType: '"❖ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Quiet and Comfortable Space',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                            {
                                listType: 'UL',
                                format: { direction: 'ltr', marginTop: '5pt', marginBottom: '0pt' },
                                dataset: { editingInfo: '{"unorderedStyleType":4}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                            listStyleType: '"➢ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Finding\na quiet and comfortable space is essential for a successful meditation\npractice, helping you focus and relax.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                            listStyleType: '"❖ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Guided Meditations',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                            {
                                listType: 'UL',
                                format: { direction: 'ltr', marginTop: '5pt', marginBottom: '0pt' },
                                dataset: { editingInfo: '{"unorderedStyleType":4}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                            listStyleType: '"➢ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Using\nguided meditations can provide structure and support, making it easier for\nbeginners to connect with their practice.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                            listStyleType: '"❖ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Join a Meditation Group',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                            {
                                listType: 'UL',
                                format: { direction: 'ltr', marginTop: '5pt', marginBottom: '0pt' },
                                dataset: { editingInfo: '{"unorderedStyleType":4}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                            listStyleType: '"➢ "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Joining\na meditation group offers motivation and community support, enhancing your\nexperience and commitment to the practice.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"unorderedStyleType":11}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: { listStyleType: '"❖ "' },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                segments: [
                                    {
                                        isSelected: true,
                                        segmentType: 'SelectionMarker',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                            backgroundColor: '',
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
                                    fontSize: '11pt',
                                    textColor: 'rgb(0, 0, 0)',
                                    fontFamily: 'Calibri',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                ],
                format: {},
            });
        }
    });

    it('PowerPoint 4', () => {
        paste(editor!, pptClipboardContent4, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.addParser).toHaveBeenCalledTimes(5);
        expect(ppt.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);

        const model = editor?.getContentModelCopy('connected');
        expect(model).toBeDefined();
        if (model) {
            copy(model);
            expectEqual(model, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Wandering Thoughts',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'decimal',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":1}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":6}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                            listStyleType: '"a) "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Wandering\nthoughts can be a common hurdle for beginners in meditation, but\nrecognizing them is the first step to overcoming them.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '18pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '10pt',
                                    marginBottom: '0pt',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":3}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '10pt',
                            marginBottom: '0pt',
                            listStyleType: '"1) "',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Wandering Thoughts',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '18pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '18pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Difficulty Sitting Still',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":5}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Many\nnewcomers find it challenging to sit still during meditation. Practicing\npatience can help improve focus and comfort over time.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '25pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Importance of Patience',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '25pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":17}' },
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '5pt',
                                    marginBottom: '0pt',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: { editingInfo: '{"orderedStyleType":13}' },
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            lineHeight: '90%',
                            marginTop: '5pt',
                            marginBottom: '0pt',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text:
                                            'Acknowledging\nthe challenges is essential, as they are part of the learning process. Patience\nis key to developing a successful meditation practice.',
                                        segmentType: 'Text',
                                        format: {
                                            fontFamily: 'Aptos',
                                            fontSize: '14pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                segmentFormat: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                },
                                blockType: 'Paragraph',
                                format: {},
                            },
                        ],
                    },
                    {
                        segments: [
                            {
                                isSelected: true,
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                    fontWeight: 'bold',
                                    backgroundColor: '',
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
                                    fontFamily: 'Aptos',
                                    fontSize: '14pt',
                                    textColor: 'black',
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        segmentFormat: {
                            fontFamily: 'Aptos',
                            fontSize: '14pt',
                            textColor: 'black',
                        },
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            });
        }
    });
});
