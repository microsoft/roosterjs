import contentModelToDom from '../../lib/modelToDom/contentModelToDom';
import domToContentModel from '../../lib/domToModel/domToContentModel';
import { ContentModelDocument } from '../../lib/publicTypes/group/ContentModelDocument';
import { EditorContext } from '../../lib/publicTypes/context/EditorContext';

describe('End to end test for DOM => Model', () => {
    function runTest(
        html: string,
        expectedModel: ContentModelDocument,
        expectedHtml: string,
        expectedHTMLFirefox?: string
    ) {
        const context: EditorContext = {
            isDarkMode: false,
        };

        const div1 = document.createElement('div');
        div1.innerHTML = html;

        const model = domToContentModel(div1, context, {});

        expect(model).toEqual(expectedModel);

        const div2 = document.createElement('div');

        contentModelToDom(document, div2, model, context);
        const possibleHTML = [
            expectedHtml, //chrome or firefox
            expectedHTMLFirefox, //firefox
        ];

        expect(possibleHTML.indexOf(div2.innerHTML)).toBeGreaterThanOrEqual(0);
    }

    it('List with margin', () => {
        runTest(
            '<ul type="disc" style="margin-bottom: 0in;"><li style="margin-right: 0in; margin-left: 0in; font-size: 11pt; font-family: Calibri, sans-serif;color:black; background:white">1</li><li style="margin-right: 0in; margin-left: 0in; font-size: 11pt; font-family: Calibri, sans-serif;color:black; background:white">2</li></ul>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockGroupType: 'ListItem',
                        blockType: 'BlockGroup',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '1',
                                        format: {
                                            fontFamily: 'Calibri, sans-serif',
                                            fontSize: '11pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                marginBottom: '0in',
                            },
                        ],
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri, sans-serif',
                                fontSize: '11pt',
                                textColor: 'black',
                            },
                            isSelected: true,
                        },
                    },
                    {
                        blockGroupType: 'ListItem',
                        blockType: 'BlockGroup',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: '2',
                                        format: {
                                            fontFamily: 'Calibri, sans-serif',
                                            fontSize: '11pt',
                                            textColor: 'black',
                                        },
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                marginBottom: '0in',
                            },
                        ],
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri, sans-serif',
                                fontSize: '11pt',
                                textColor: 'black',
                            },
                            isSelected: true,
                        },
                    },
                ],
            },
            '<ul style="flex-direction: column; display: flex; margin-bottom: 0in;"><li style="font-family: Calibri, sans-serif; font-size: 11pt; color: black;"><span style="font-family: Calibri, sans-serif; font-size: 11pt; color: black;">1</span></li><li style="font-family: Calibri, sans-serif; font-size: 11pt; color: black;"><span style="font-family: Calibri, sans-serif; font-size: 11pt; color: black;">2</span></li></ul>'
        );
    });

    it('list with dummy item', () => {
        runTest(
            '<ol><li>1</li><ol><li>a</li></ol><li style="display:block">b</li><li>2</li></ol>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '1', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'OL' }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'a', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'OL' }, { listType: 'OL' }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'b', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'OL', displayForDummyItem: 'block' }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: '2', format: {} }],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [{ listType: 'OL' }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            '<ol start="1" style="flex-direction: column; display: flex;"><li>1</li><ol start="1" style="flex-direction: column; display: flex;"><li style="list-style-type: lower-alpha;">a</li></ol><li style="display: block;">b</li><li>2</li></ol>',
            '<ol style="flex-direction: column; display: flex;" start="1"><li>1</li><ol style="flex-direction: column; display: flex;" start="1"><li style="list-style-type: lower-alpha;">a</li></ol><li style="display: block;">b</li><li>2</li></ol>'
        );
    });
});
