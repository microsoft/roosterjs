import * as addParserF from '../../../lib/paste/utils/addParser';
import * as getPasteSourceF from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import * as oneNote from '../../../lib/paste/oneNote/processPastedContentFromOneNote';
import * as setProcessorF from '../../../lib/paste/utils/setProcessor';
import { expectEqual, initEditor } from './testUtils';
import { IEditor } from 'roosterjs-content-model-types';
import { paste } from 'roosterjs-content-model-core';
import {
    oneNoteClipboardContent1,
    oneNoteClipboardContent2,
} from './htmlTemplates/oneNoteClipboardContent';

describe('OneNote', () => {
    let editor: IEditor = undefined!;

    beforeEach(() => {
        editor = initEditor('OneNote');
        spyOn(oneNote, 'processPastedContentFromOneNote').and.callThrough();
        spyOn(getPasteSourceF, 'getPasteSource').and.returnValue('oneNoteDesktop');
        spyOn(addParserF, 'addParser').and.callThrough();
        spyOn(setProcessorF, 'setProcessor').and.callThrough();
    });

    afterEach(() => {
        document.getElementById('OneNote')?.remove();
    });

    it('OneNote', () => {
        paste(editor!, oneNoteClipboardContent1, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(4);
        expect(oneNote.processPastedContentFromOneNote).toHaveBeenCalledTimes(1);

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
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'upper-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: '1',
                                        segmentType: 'Text',
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
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Asd',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Asd',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Asd',
                                        segmentType: 'Text',
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
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '36px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
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
        }
    });

    it('OneNote 2', () => {
        paste(editor!, oneNoteClipboardContent2, 'normal');

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(2);
        expect(addParserF.addParser).toHaveBeenCalledTimes(4);
        expect(oneNote.processPastedContentFromOneNote).toHaveBeenCalledTimes(1);

        const model = editor?.getContentModelCopy('connected');
        expect(model).toBeDefined();
        if (model) {
            expectEqual(model, {
                blockGroupType: 'Document',
                blocks: [
                    {
                        segments: [
                            {
                                text: 'Meeting recording:',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: 'Participants:',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: 'Agenda',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '0px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Topic 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Next steps',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Step 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Step 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help needed',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Topic 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Status 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Next steps',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Step 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Step 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help needed',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help 1',
                                        segmentType: 'Text',
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
                    },
                    {
                        formatHolder: {
                            isSelected: false,
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'decimal',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-alpha',
                                },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: {
                                    direction: 'ltr',
                                    marginTop: '0in',
                                    marginBottom: '0in',
                                    listStyleType: 'lower-roman',
                                },
                                dataset: {},
                            },
                        ],
                        blockType: 'BlockGroup',
                        format: {
                            direction: 'ltr',
                            marginTop: '0px',
                            marginBottom: '0px',
                        },
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                isImplicit: true,
                                segments: [
                                    {
                                        text: 'Help 2',
                                        segmentType: 'Text',
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
                    },
                    {
                        segments: [
                            {
                                text: ' ',
                                segmentType: 'Text',
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
                        },
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '108px',
                            direction: 'ltr',
                            marginTop: '0in',
                            marginRight: '0in',
                            marginBottom: '0in',
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
                                    fontFamily: 'Calibri',
                                    fontSize: '11pt',
                                    textColor: 'rgb(0,0,0)',
                                    backgroundColor: '',
                                    fontWeight: 'normal',
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
                        format: {
                            marginLeft: '0px',
                        },
                    },
                ],
                format: {},
            });
        }
    });
});
