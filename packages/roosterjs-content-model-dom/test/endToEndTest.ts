import * as createGeneralBlock from '../lib/modelApi/creators/createGeneralBlock';
import { contentModelToDom } from '../lib/modelToDom/contentModelToDom';
import { contentModelToText, createDomToModelContext, createModelToDomContext } from '../lib';
import { domToContentModel } from '../lib/domToModel/domToContentModel';
import { expectHtml } from './testUtils';
import {
    ContentModelBlockFormat,
    ContentModelDocument,
    ContentModelGeneralBlock,
} from 'roosterjs-content-model-types';

describe('End to end test for DOM => Model => DOM/TEXT', () => {
    function runTest(
        html: string,
        expectedModel: ContentModelDocument,
        expectedText: string,
        ...expectedHtml: string[]
    ) {
        const div1 = document.createElement('div');
        div1.innerHTML = html;

        const model = domToContentModel(div1, createDomToModelContext());

        expect(model).toEqual(expectedModel);

        const div2 = document.createElement('div');

        contentModelToDom(document, div2, model, createModelToDomContext());
        const text = contentModelToText(model);

        expect(text).toBe(expectedText);
        expectHtml(div2.innerHTML, expectedHtml);
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
                                segmentFormat: {
                                    fontFamily: 'Calibri, sans-serif',
                                    fontSize: '11pt',
                                    textColor: 'black',
                                },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                format: { marginBottom: '0in' },
                                dataset: {},
                            },
                        ],
                        format: {
                            marginRight: '0in',
                            marginLeft: '0in',
                        },
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri, sans-serif',
                                fontSize: '11pt',
                                textColor: 'black',
                            },
                            isSelected: false,
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
                                segmentFormat: {
                                    fontFamily: 'Calibri, sans-serif',
                                    fontSize: '11pt',
                                    textColor: 'black',
                                },
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                format: { marginBottom: '0in' },
                                dataset: {},
                            },
                        ],
                        format: {
                            marginRight: '0in',
                            marginLeft: '0in',
                        },
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {
                                fontFamily: 'Calibri, sans-serif',
                                fontSize: '11pt',
                                textColor: 'black',
                            },
                            isSelected: false,
                        },
                    },
                ],
            },
            '1\r\n2',
            '<ul style="margin-bottom: 0in;"><li style="font-family: Calibri, sans-serif; font-size: 11pt; color: black; margin-right: 0in; margin-left: 0in;">1</li><li style="font-family: Calibri, sans-serif; font-size: 11pt; color: black; margin-right: 0in; margin-left: 0in;">2</li></ul>'
        );
    });

    it('list with partially same format in list item and segment', () => {
        runTest(
            '<div><ul><li style="font-family: Arial; font-size: 10pt; color: red;"><div><span style="font-size: 12pt; font-family: Arial; font-weight: bold">test</span></div></li></ul></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {
                                            fontFamily: 'Arial',
                                            fontSize: '12pt',
                                            textColor: 'red',
                                            fontWeight: 'bold',
                                        },
                                    },
                                ],
                                format: {},
                                segmentFormat: {
                                    fontFamily: 'Arial',
                                    fontSize: '12pt',
                                    textColor: 'red',
                                },
                            },
                        ],
                        levels: [{ listType: 'UL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: 'Arial',
                                fontSize: '10pt',
                                textColor: 'red',
                            },
                        },
                        format: {},
                    },
                ],
            },
            'test',
            '<ul><li style="font-family: Arial; font-size: 10pt; color: red;"><div style="font-size: 12pt;"><b>test</b></div></li></ul>'
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
                        levels: [
                            { listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
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
                        levels: [
                            { listType: 'OL', format: {}, dataset: {} },
                            { listType: 'OL', format: { startNumberOverride: 1 }, dataset: {} },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
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
                        levels: [
                            {
                                listType: 'OL',
                                format: { displayForDummyItem: 'block' },
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
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
                        levels: [{ listType: 'OL', format: {}, dataset: {} }],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
            '1\r\na\r\nb\r\n2',
            '<ol start="1"><li>1</li><ol start="1"><li>a</li></ol><li style="display: block;">b</li><li>2</li></ol>'
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
                                segmentFormat: { fontFamily: 'monospace' },
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
            'aa\nbb\r\ncc\ndd\r\nee',
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
                                segmentFormat: { fontFamily: 'monospace' },
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
                                segmentFormat: { fontFamily: 'monospace' },
                            },
                        ],
                    },
                ],
            },
            'test1\r\ntest2',
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
            'aa\r\nbb\r\ncc',
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
            'aa\r\nbb\r\ncc',
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
                            display: 'block',
                        },
                    },
                ],
            },
            'aa\r\nbb\r\ncc',
            '<div style="background-color: red; display: block;"><b>aa</b><table><tbody><tr><td><b>bb</b></td></tr></tbody></table><b>cc</b></div>'
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
            'aa\r\naa',
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
                            display: 'block',
                        } as ContentModelBlockFormat,
                        isImplicit: false,
                    },
                ],
            },
            'aa',
            '<div style="margin: 20px; display: block;"><b>aa</b></div>'
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
            'aaa\r\nbbb',
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
            'aaa\r\nbbb',
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
                                format: {},
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
                                format: {},
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
                                format: {},
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
            'aa\r\nbb\r\ncc',
            '<h1>aa</h1><h2>bb</h2><h3 style="margin: 50px;">cc</h3>'
        );
    });

    it('Header with format from context', () => {
        runTest(
            '<div style="font-size: 16px"><h1 style="font-size: 40px">test</h1></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                        decorator: {
                            tagName: 'h1',
                            format: { fontSize: '40px', fontWeight: 'bold' },
                        },
                    },
                ],
            },
            'test',
            '<h1 style="font-size: 40px;">test</h1>'
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
                                segmentFormat: { fontFamily: 'monospace' },
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
                                segmentFormat: { fontFamily: 'monospace', fontSize: '20px' },
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
            'aaa\nbbb\r\naaa\nbb',
            '<pre><div>aaa\nbbb</div></pre><pre><div style="font-size: 20px;">aaa\nbb</div></pre>'
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
            'aaabbbccc\r\naaabbbccc',
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
                        segmentFormat: { textColor: 'red' },
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
                                segmentFormat: {
                                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                                    fontSize: '12pt',
                                    textColor: 'rgb(102, 102, 102)',
                                },
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
                        segmentFormat: { textColor: 'red' },
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
                        segmentFormat: { textColor: 'red' },
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
                        segmentFormat: {
                            fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                            fontSize: '12pt',
                            textColor: 'rgb(102, 102, 102)',
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
                        segmentFormat: {
                            textColor: 'red',
                        },
                    },
                ],
            },
            'aaaa\r\nbbbbbb\r\ncccc\r\naaaa\r\nbbbbbb\r\ncccc',
            '<div style="color: red;">aaaa</div><blockquote style="padding-left: 10px; border-left: 3px solid rgb(200, 200, 200);"><div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(102, 102, 102);">bbbbbb</div></blockquote><div style="color: red;">cccc</div><div style="color: red;">aaaa</div><div style="margin-right: 40px; margin-left: 40px; font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(102, 102, 102);">bbbbbb</div><div style="color: red;">cccc</div>'
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
                                segmentFormat: {
                                    fontFamily: 'monospace',
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
            'aaa\r\nbbb\r\nccc',
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
            'aaa\r\nbbb',
            '<div style="margin-left: 40px;">aaa</div><div style="margin: 0px 50px 0px 90px;">bbb</div>'
        );
    });

    it('text after format container', () => {
        runTest(
            '<div align="center" style="background-color: red;">test1</div>test2',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test1',
                                format: {},
                            },
                        ],
                        format: {
                            htmlAlign: 'center',
                            backgroundColor: 'red',
                        },
                        isImplicit: false,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test2',
                                format: {},
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            'test1\r\ntest2',
            '<div align="center" style="background-color: red;">test1</div>test2',
            '<div style="background-color: red;" align="center">test1</div>test2'
        );
    });

    it('Center', () => {
        const cloneNodeSpy = jasmine
            .createSpy('cloneNode')
            .and.returnValue(document.createElement('center'));
        const mockedElement = {
            name: 'ELEMENT',
            cloneNode: cloneNodeSpy,
        } as any;
        const mockedGeneral: ContentModelGeneralBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: mockedElement,
            blocks: [],
            format: {},
        };

        const createGeneralBlockSpy = spyOn(
            createGeneralBlock,
            'createGeneralBlock'
        ).and.returnValue(mockedGeneral);

        runTest(
            '<center>test1<table><tr><td>test2</td></tr></table><div align="right">test3</div></center>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'General',
                        format: {},
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                isImplicit: true,
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        format: {},
                                        text: 'test1',
                                    },
                                ],
                            },
                            {
                                blockType: 'Table',
                                format: {},
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
                                                        format: {},
                                                        isImplicit: true,
                                                        segments: [
                                                            {
                                                                segmentType: 'Text',
                                                                format: {},
                                                                text: 'test2',
                                                            },
                                                        ],
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
                                widths: [],
                                dataset: {},
                            },
                            {
                                blockType: 'Paragraph',
                                format: { htmlAlign: 'end' },
                                isImplicit: false,
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        format: {},
                                        text: 'test3',
                                    },
                                ],
                            },
                        ],
                        element: mockedElement,
                    },
                ],
            },
            'test1\r\ntest2\r\ntest3',
            '<center>test1<table><tbody><tr><td>test2</td></tr></tbody></table><div align="right">test3</div></center>'
        );

        expect(createGeneralBlockSpy).toHaveBeenCalledTimes(1);
        expect(cloneNodeSpy).toHaveBeenCalledTimes(1);
    });

    it('html align overwrite text align from context', () => {
        runTest(
            '<div style="text-align:center">aaa<div align=right>bbb<div>ccc</div>ddd</div>eee</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: { textAlign: 'center' },
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'aaa',
                            },
                        ],
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        format: {
                            htmlAlign: 'end',
                        },
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        format: {},
                                        text: 'bbb',
                                    },
                                ],
                                isImplicit: true,
                            },
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        format: {},
                                        text: 'ccc',
                                    },
                                ],
                            },
                            {
                                blockType: 'Paragraph',
                                format: {},
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        format: {},
                                        text: 'ddd',
                                    },
                                ],
                                isImplicit: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'center',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'eee',
                            },
                        ],
                        isImplicit: true,
                    },
                ],
            },
            'aaa\r\nbbb\r\nccc\r\nddd\r\neee',
            '<div style="text-align: center;">aaa</div><div align="right">bbb<div>ccc</div>ddd</div><div style="text-align: center;">eee</div>'
        );
    });

    it('SUB needs to be put inside S or U if any', () => {
        runTest(
            '<div><s><u><sub>test</sub></u></s></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    strikethrough: true,
                                    underline: true,
                                    superOrSubScriptSequence: 'sub',
                                },
                            },
                        ],
                    },
                ],
            },
            'test',
            '<div><sub><u><s>test</s></u></sub></div>'
        );
    });

    it('Table with margin under "align=center"', () => {
        runTest(
            '<div align="center"><table style="margin: 0"><tr><td></td></tr></table></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        format: { htmlAlign: 'center' },
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Table',
                                format: {
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                    marginRight: '0px',
                                    marginTop: '0px',
                                },
                                widths: [],
                                dataset: {},
                                rows: [
                                    {
                                        format: {},
                                        height: 0,
                                        cells: [
                                            {
                                                blockGroupType: 'TableCell',
                                                format: {},
                                                spanAbove: false,
                                                spanLeft: false,
                                                isHeader: false,
                                                dataset: {},
                                                blocks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            '',
            '<div align="center"><table style="margin: 0px;"><tbody><tr><td></td></tr></tbody></table></div>'
        );
    });

    it('A with display:block', () => {
        runTest(
            '<a href="#" style="display:block;color:red">test</a>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { textColor: 'red' },
                                link: {
                                    format: {
                                        underline: true,
                                        href: '#',
                                        textColor: 'red',
                                        display: 'block',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        segmentFormat: { textColor: 'red' },
                    },
                ],
            },
            'test',
            '<span style="color: red;"><a href="#" style="color: red; display: block;">test</a></span>',
            '<span style="color: red;"><a style="color: red; display: block;" href="#">test</a></span>'
        );
    });

    it('Segment format on block', () => {
        runTest(
            '<div style="font-weight: bold; font-style: italic; text-decoration: underline line-through">test</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    strikethrough: true,
                                    underline: true,
                                    italic: true,
                                    fontWeight: 'bold',
                                },
                            },
                        ],
                        format: {},
                        segmentFormat: {
                            strikethrough: true,
                            underline: true,
                            italic: true,
                            fontWeight: 'bold',
                        },
                    },
                ],
            },
            'test',
            '<div><b><i><u><s><s>test</s></s></u></i></b></div>'
        );
    });

    it('Segment format on block from parent', () => {
        runTest(
            'aaa<b>bbb<div>ccc</div>ddd</b>eeee',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'aaa', format: {} },
                            { segmentType: 'Text', text: 'bbb', format: { fontWeight: 'bold' } },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'ccc', format: { fontWeight: 'bold' } },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'Text', text: 'ddd', format: { fontWeight: 'bold' } },
                            { segmentType: 'Text', text: 'eeee', format: {} },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            'aaabbb\r\nccc\r\ndddeeee',
            'aaa<b>bbb</b><div><b>ccc</b></div><b>ddd</b>eeee'
        );
    });

    it('Link inside superscript', () => {
        runTest(
            '<div><sup><a href="http://www.bing.com">www.bing.com</a></sup></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'www.bing.com',
                                format: { superOrSubScriptSequence: 'super' },
                                link: {
                                    format: { underline: true, href: 'http://www.bing.com' },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
            },
            'www.bing.com',
            '<div><sup><a href="http://www.bing.com">www.bing.com</a></sup></div>'
        );
    });

    it('Multiple P tag with margin-left', () => {
        runTest(
            '<p style="margin-left: 40px">aaa</p><p style="margin-left: 40px">bbb</p>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '40px',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'aaa',
                            },
                        ],
                        decorator: {
                            format: {},
                            tagName: 'p',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '40px',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'bbb',
                            },
                        ],
                        decorator: {
                            format: {},
                            tagName: 'p',
                        },
                    },
                ],
            },
            'aaa\r\nbbb',
            '<p style="margin-left: 40px;">aaa</p><p style="margin-left: 40px;">bbb</p>'
        );
    });

    it('SPAN inside link with color', () => {
        runTest(
            '<a href="#">before<span style="color:red">test</span>after</a>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'before',
                                format: {},
                                link: {
                                    format: { underline: true, href: '#' },
                                    dataset: {},
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { textColor: 'red' },
                                link: {
                                    format: { underline: true, href: '#', textColor: 'red' },
                                    dataset: {},
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'after',
                                format: {},
                                link: {
                                    format: { underline: true, href: '#' },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                    },
                ],
            },
            'beforetestafter',
            '<a href="#">before</a><span style="color: red;"><a href="#" style="color: red;">test</a></span><a href="#">after</a>'
        );
    });

    it('text-indent', () => {
        runTest(
            '<div style="text-indent:20px">aa<div>bb</div>cc</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: { textIndent: '20px' },
                        segments: [{ segmentType: 'Text', format: {}, text: 'aa' }],
                    },
                    {
                        blockType: 'Paragraph',
                        format: { textIndent: '20px' },
                        segments: [{ segmentType: 'Text', format: {}, text: 'bb' }],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [{ segmentType: 'Text', format: {}, text: 'cc' }],
                        isImplicit: true,
                    },
                ],
            },
            'aa\r\nbb\r\ncc',
            '<div style="text-indent: 20px;">aa</div><div style="text-indent: 20px;">bb</div>cc'
        );
    });

    it('text-indent with inner block', () => {
        runTest(
            '<div style="text-indent: 20px"><div>aa</div>bb<div style="text-indent: 40px">cc</div></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: { textIndent: '20px' },
                        segments: [{ segmentType: 'Text', format: {}, text: 'aa' }],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [{ segmentType: 'Text', format: {}, text: 'bb' }],
                        isImplicit: true,
                    },
                    {
                        blockType: 'Paragraph',
                        format: { textIndent: '40px' },
                        segments: [{ segmentType: 'Text', format: {}, text: 'cc' }],
                    },
                ],
            },
            'aa\r\nbb\r\ncc',
            '<div style="text-indent: 20px;">aa</div>bb<div style="text-indent: 40px;">cc</div>'
        );
    });

    it('Table with COLGROUP', () => {
        runTest(
            '<table><colgroup><col width="100"><col style="width: 150px"><col style="width: 90pt"></colgroup><tr><td>a</td><td>b</td><td>c</td></tr></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'b',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'c',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                ],
                                format: {},
                                height: 0,
                            },
                        ],
                        dataset: {},
                        format: {},
                        widths: [100, 150, 120],
                    },
                ],
            },
            'a\r\nb\r\nc',
            '<table><tbody><tr><td style="width: 100px;">a</td><td style="width: 150px;">b</td><td style="width: 120px;">c</td></tr></tbody></table>'
        );
    });

    it('Table with COLGROUP with span', () => {
        runTest(
            '<table><colgroup><col style="width: 150px" span="2"><col style="width: 90pt"></colgroup><tr><td>a</td><td>b</td><td>c</td></tr></table>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'a',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'b',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'c',
                                                        format: {},
                                                    },
                                                ],
                                                format: {},
                                                isImplicit: true,
                                            },
                                        ],
                                        dataset: {},
                                        format: {},
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                    },
                                ],
                                format: {},
                                height: 0,
                            },
                        ],
                        dataset: {},
                        format: {},
                        widths: [150, 150, 120],
                    },
                ],
            },
            'a\r\nb\r\nc',
            '<table><tbody><tr><td style="width: 150px;">a</td><td style="width: 150px;">b</td><td style="width: 120px;">c</td></tr></tbody></table>'
        );
    });

    it('list with list style', () => {
        runTest(
            '<ol><ol style="list-style-type: &quot;1) &quot;;"><li>test</li></ol></ol>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                isImplicit: true,
                                format: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        levels: [
                            {
                                listType: 'OL',
                                format: { startNumberOverride: 1 },
                                dataset: {},
                            },
                            {
                                listType: 'OL',
                                format: { listStyleType: '"1) "', startNumberOverride: 1 },
                                dataset: {},
                            },
                        ],
                        format: {},
                    },
                ],
            },
            'test',
            '<ol start="1"><ol start="1" style="list-style-type: &quot;1) &quot;;"><li>test</li></ol></ol>'
        );
    });

    it('link with color', () => {
        runTest(
            '<div style="font-family: Calibri; font-size: 11pt; color: rgb(0, 0, 0);"><span style="color: rgb(245, 212, 39);"><a href="http://www.bing.com" style="color: rgb(245, 212, 39);">www.bing.com</a></span></div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'www.bing.com',
                                format: {
                                    fontFamily: 'Calibri',
                                    fontSize: '11pt',
                                    textColor: 'rgb(245, 212, 39)',
                                },
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'http://www.bing.com',
                                        textColor: 'rgb(245, 212, 39)',
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                        segmentFormat: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(245, 212, 39)',
                        },
                    },
                ],
            },
            'www.bing.com',
            '<div style="font-family: Calibri; font-size: 11pt; color: rgb(245, 212, 39);"><a href="http://www.bing.com" style="color: rgb(245, 212, 39);">www.bing.com</a></div>'
        );
    });

    it('HTML align together with CSS text-align', () => {
        runTest(
            '<div align="left" style="text-align:center">test</div>',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                        format: {
                            textAlign: 'center',
                        },
                        isImplicit: false,
                    },
                ],
            },
            'test',
            '<div style="text-align: center;">test</div>'
        );
    });
});
