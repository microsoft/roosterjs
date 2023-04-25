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

        expect(possibleHTML.indexOf(div2.innerHTML)).toBeGreaterThanOrEqual(0, div2.innerHTML);
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

    it('div with whiteSpace, pre and blockquote', () => {
        runTest(
            '<div style="white-space:pre">aa\nbb</div><pre>cc\ndd</pre><blockquote>ee</blockquote>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa\nbb',
                                format: {},
                            },
                        ],
                        format: {
                            whiteSpace: 'pre',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'cc\ndd',
                                        format: { fontFamily: 'monospace' },
                                    },
                                ],
                                format: { whiteSpace: 'pre' },
                                isImplicit: true,
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                            whiteSpace: 'pre',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'blockquote',
                        format: {
                            marginRight: '40px',
                            marginLeft: '40px',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                isImplicit: true,
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'ee',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                    },
                ],
            },
            '<div style="white-space: pre;">aa\nbb</div><pre><div>cc\ndd</div></pre><blockquote>ee</blockquote>'
        );
    });

    it('Two PRE tags', () => {
        runTest(
            '<pre>test1</pre><pre>test2</pre>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                            whiteSpace: 'pre',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: { whiteSpace: 'pre' },
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test1',
                                        format: { fontFamily: 'monospace' },
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                            whiteSpace: 'pre',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: { whiteSpace: 'pre' },
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: { fontFamily: 'monospace' },
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                    },
                ],
            },
            '<pre><div>test1</div></pre><pre><div>test2</div></pre>'
        );
    });

    it('Block under styled inline', () => {
        runTest(
            '<b style="background-color:red">aa<div>bb</div>cc</b>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa',
                                format: {
                                    fontWeight: 'bold',
                                    backgroundColor: 'red',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
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
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'cc',
                                format: {
                                    fontWeight: 'bold',
                                    backgroundColor: 'red',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            '<span style="background-color: red;"><b>aa</b></span><div><b>bb</b></div><span style="background-color: red;"><b>cc</b></span>'
        );
    });

    it('Table under styled inline', () => {
        runTest(
            '<b style="background-color:red">aa<table><tr><td>bb</td></tr></table>cc</b>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa',
                                format: {
                                    fontWeight: 'bold',
                                    backgroundColor: 'red',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                    {
                        blockType: 'Table',
                        cells: [
                            [
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
                        ],
                        format: {},
                        widths: [],
                        heights: [],
                        dataset: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'cc',
                                format: {
                                    fontWeight: 'bold',
                                    backgroundColor: 'red',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            '<span style="background-color: red;"><b>aa</b></span><table><tbody><tr><td><b>bb</b></td></tr></tbody></table><span style="background-color: red;"><b>cc</b></span>'
        );
    });

    it('Table under styled block', () => {
        runTest(
            '<b style="background-color:red; display: block">aa<table><tr><td>bb</td></tr></table>cc</b>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'aa',
                                        format: {
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                            {
                                blockType: 'Table',
                                cells: [
                                    [
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
                                ],
                                format: {},
                                widths: [],
                                heights: [],
                                dataset: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'cc',
                                        format: {
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        format: {
                            backgroundColor: 'red',
                        },
                    },
                ],
            },
            '<div style="background-color: red;"><b>aa</b><table><tbody><tr><td><b>bb</b></td></tr></tbody></table><b>cc</b></div>'
        );
    });

    it('Blockquote with margins', () => {
        runTest(
            '<blockquote style="margin: 20px">aa</blockquote><blockquote style="margin: 0 20px">aa</blockquote>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'blockquote',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'aa',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        format: {
                            marginTop: '20px',
                            marginRight: '20px',
                            marginBottom: '20px',
                            marginLeft: '20px',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa',
                                format: {},
                            },
                        ],
                        format: {
                            marginTop: '0px',
                            marginRight: '20px',
                            marginBottom: '0px',
                            marginLeft: '20px',
                        },
                    },
                ],
            },
            '<blockquote style="margin: 20px;">aa</blockquote><div style="margin: 0px 20px;">aa</div>'
        );
    });

    it('margin on paragraph', () => {
        runTest(
            '<b style="display:block; margin: 20px">aa</b>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa',
                                format: {
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        format: {
                            marginTop: '20px',
                            marginRight: '20px',
                            marginBottom: '20px',
                            marginLeft: '20px',
                        },
                        isImplicit: false,
                    },
                ],
            },
            '<div style="margin: 20px;"><b>aa</b></div>'
        );
    });

    it('Multiple P tag', () => {
        runTest(
            '<p>aaa</p><p>bbb</p>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
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
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'bbb',
                                format: {},
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
                ],
            },
            '<p>aaa</p><p>bbb</p>'
        );
    });

    it('P tags with margin', () => {
        runTest(
            '<p style="margin: 0">aaa</p><p style="margin: 0">bbb</p>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
                            },
                        ],
                        format: {
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'bbb',
                                format: {},
                            },
                        ],
                        format: {
                            marginTop: '0px',
                            marginRight: '0px',
                            marginBottom: '0px',
                            marginLeft: '0px',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                ],
            },
            '<p style="margin: 0px;">aaa</p><p style="margin: 0px;">bbb</p>'
        );
    });

    it('Headers', () => {
        runTest(
            '<h1>aa</h1><h2>bb</h2><h3 style="margin: 50px">cc</h3>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aa',
                                format: {
                                    fontSize: '2em',
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        format: {},
                        decorator: {
                            tagName: 'h1',
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                            },
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'bb',
                                format: {
                                    fontSize: '1.5em',
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        format: {},
                        decorator: {
                            tagName: 'h2',
                            format: {
                                fontSize: '1.5em',
                                fontWeight: 'bold',
                            },
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'cc',
                                format: {
                                    fontSize: '1.17em',
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        format: {
                            marginTop: '50px',
                            marginRight: '50px',
                            marginBottom: '50px',
                            marginLeft: '50px',
                        },
                        decorator: {
                            tagName: 'h3',
                            format: {
                                fontSize: '1.17em',
                                fontWeight: 'bold',
                            },
                        },
                    },
                ],
            },
            '<h1>aa</h1><h2>bb</h2><h3 style="margin: 50px;">cc</h3>'
        );
    });

    it('PREs', () => {
        runTest(
            '<pre>aaa\nbbb</pre><pre style="font-size: 20px">aaa\nbb</pre>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'aaa\nbbb',
                                        format: {
                                            fontFamily: 'monospace',
                                        },
                                    },
                                ],
                                format: {
                                    whiteSpace: 'pre',
                                },
                                isImplicit: true,
                            },
                        ],
                        format: {
                            whiteSpace: 'pre',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'aaa\nbb',
                                        format: {
                                            fontFamily: 'monospace',
                                            fontSize: '20px',
                                        },
                                    },
                                ],
                                format: {
                                    whiteSpace: 'pre',
                                },
                                isImplicit: true,
                            },
                        ],
                        format: {
                            whiteSpace: 'pre',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                ],
            },
            '<pre><div>aaa\nbbb</div></pre><pre><div><span style="font-size: 20px;">aaa\nbb</span></div></pre>'
        );
    });

    it('Code and Link', () => {
        runTest(
            '<div>aaa<code>bbb</code>ccc</div><div>aaa<a href="#">bbb</a>ccc</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'bbb',
                                format: {},
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'ccc',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'bbb',
                                format: {},
                                link: {
                                    format: {
                                        underline: true,
                                        href: '#',
                                    },
                                    dataset: {},
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'ccc',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
            },
            '<div>aaa<code>bbb</code>ccc</div><div>aaa<a href="#">bbb</a>ccc</div>'
        );
    });

    it('BlockQuotes', () => {
        runTest(
            '<div style="color:red"><div>aaaa</div><blockquote style="color: rgb(102, 102, 102); border-left: 3px solid rgb(200, 200, 200); padding-left: 10px;"><div><span style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt;">bbbbbb</span></div></blockquote><div>cccc</div><div>aaaa</div><blockquote style="color: rgb(102, 102, 102); margin: 0 40px"><div><span style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt;">bbbbbb</span></div></blockquote><div>cccc</div></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaaa',
                                format: {
                                    textColor: 'red',
                                },
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'blockquote',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'bbbbbb',
                                        format: {
                                            fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                                            fontSize: '12pt',
                                            textColor: 'rgb(102, 102, 102)',
                                        },
                                    },
                                ],
                                format: {},
                            },
                        ],
                        format: {
                            borderLeft: '3px solid rgb(200, 200, 200)',
                            marginTop: '1em',
                            marginRight: '40px',
                            marginBottom: '1em',
                            marginLeft: '40px',
                            paddingLeft: '10px',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'cccc',
                                format: {
                                    textColor: 'red',
                                },
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaaa',
                                format: {
                                    textColor: 'red',
                                },
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'bbbbbb',
                                format: {
                                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                                    fontSize: '12pt',
                                    textColor: 'rgb(102, 102, 102)',
                                },
                            },
                        ],
                        format: {
                            marginRight: '40px',
                            marginLeft: '40px',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'cccc',
                                format: {
                                    textColor: 'red',
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            },
            '<div><span style="color: red;">aaaa</span></div><blockquote style="padding-left: 10px; border-left: 3px solid rgb(200, 200, 200);"><div><span style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(102, 102, 102);">bbbbbb</span></div></blockquote><div><span style="color: red;">cccc</span></div><div><span style="color: red;">aaaa</span></div><div style="margin-right: 40px; margin-left: 40px;"><span style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(102, 102, 102);">bbbbbb</span></div><div><span style="color: red;">cccc</span></div>'
        );
    });

    it('margin left and format container', () => {
        runTest(
            '<div style="margin-left: 40px">aaa<pre><div>bbb</div></pre>ccc</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
                            },
                        ],
                        format: {
                            marginLeft: '40px',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'pre',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'bbb',
                                        format: {
                                            fontFamily: 'monospace',
                                        },
                                    },
                                ],
                                format: {
                                    whiteSpace: 'pre',
                                },
                            },
                        ],
                        format: {
                            whiteSpace: 'pre',
                            marginTop: '1em',
                            marginBottom: '1em',
                            marginLeft: '40px',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'ccc',
                                format: {},
                            },
                        ],
                        format: {
                            marginLeft: '40px',
                        },
                        isImplicit: true,
                    },
                ],
            },
            '<div style="margin-left: 40px;">aaa</div><pre style="margin-left: 40px;"><div>bbb</div></pre><div style="margin-left: 40px;">ccc</div>'
        );
    });

    it('nested margin left', () => {
        runTest(
            '<div style="margin-left: 40px">aaa<div style="margin: 0 50px">bbb</div></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaa',
                                format: {},
                            },
                        ],
                        format: {
                            marginLeft: '40px',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'bbb',
                                format: {},
                            },
                        ],
                        format: {
                            marginLeft: '90px',
                            marginTop: '0px',
                            marginRight: '50px',
                            marginBottom: '0px',
                        },
                    },
                ],
            },
            '<div style="margin-left: 40px;">aaa</div><div style="margin: 0px 50px 0px 90px;">bbb</div>'
        );
    });
});
