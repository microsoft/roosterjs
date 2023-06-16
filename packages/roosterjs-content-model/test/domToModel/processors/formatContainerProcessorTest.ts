import { ContentModelBlockFormat } from '../../../lib/publicTypes/format/ContentModelBlockFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { formatContainerProcessor } from '../../../lib/domToModel/processors/formatContainerProcessor';

describe('formatContainerProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty BLOCKQUOTE tag', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                        marginRight: '40px',
                        marginLeft: '40px',
                    },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('BLOCKQUOTE with non-zero value style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '1px';
        quote.style.marginBottom = '0';

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1px',
                        marginBottom: '0px',
                        marginRight: '40px',
                        marginLeft: '40px',
                    },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('BLOCKQUOTE with margin and border', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.style.border = 'solid 1px black';

        formatContainerProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '0px',
                        marginRight: '40px',
                        marginBottom: '0px',
                        marginLeft: '40px',
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderBottom: '1px solid black',
                        borderLeft: '1px solid black',
                    },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('Nested BLOCKQUOTE with left margin and border', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const div = document.createElement('div');

        quote.style.borderLeft = 'solid 2px black';
        quote.style.marginLeft = '40px';
        div.style.marginLeft = '60px';
        div.appendChild(document.createTextNode('test2'));

        quote.appendChild(document.createTextNode('test1'));
        quote.appendChild(div);
        quote.appendChild(document.createTextNode('test3'));

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
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
                                    text: 'test1',
                                    format: {},
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
                                    text: 'test2',
                                    format: {},
                                },
                            ],
                            format: {
                                marginLeft: '60px',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '2px solid black',
                    },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('Verify inherited formats are correctly handled', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const childProcessor = jasmine
            .createSpy('childProcessor')
            .and.callFake((group, element, context) => {
                expect(context.blockFormat).toEqual({});
                expect(context.segmentFormat).toEqual({
                    fontSize: '20px',
                    textColor: 'blue',
                });
            });

        quote.style.color = 'blue';
        quote.style.borderLeft = 'solid 1px black';
        context.segmentFormat.textColor = 'green';
        context.segmentFormat.fontSize = '20px';
        context.elementProcessors.child = childProcessor;

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '1px solid black',
                    },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('Verify inherited formats from context are correctly handled', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        const childProcessor = jasmine.createSpy('childProcessor');

        quote.style.borderLeft = 'solid 1px black';

        context.blockFormat.backgroundColor = 'red';
        context.blockFormat.htmlAlign = 'center';
        context.blockFormat.lineHeight = '2';
        context.blockFormat.whiteSpace = 'pre';
        context.blockFormat.direction = 'rtl';

        context.elementProcessors.child = childProcessor;

        formatContainerProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        borderLeft: '1px solid black',
                        backgroundColor: 'red',
                        htmlAlign: 'center',
                        lineHeight: '2',
                        whiteSpace: 'pre',
                        direction: 'rtl',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {
                        backgroundColor: 'red',
                        htmlAlign: 'center',
                        lineHeight: '2',
                        whiteSpace: 'pre',
                        direction: 'rtl',
                    },
                    isImplicit: true,
                },
            ],
        });

        expect(childProcessor).toHaveBeenCalledTimes(1);
    });

    it('formatContainer with zero font size', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.fontSize = '0px';

        formatContainerProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    blocks: [],
                    zeroFontSize: true,
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('formatContainer with zero font size and single paragraph child', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.fontSize = '0px';
        div.appendChild(document.createTextNode('test'));

        formatContainerProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontSize: '0px' },
                        },
                    ],
                    format: {},
                    isImplicit: false,
                    segmentFormat: { fontSize: '0' },
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('formatContainer with max-width and display:inline-block', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.display = 'inline-block';
        div.style.maxWidth = '50%';
        div.appendChild(document.createTextNode('test'));

        formatContainerProcessor(group, div, context);

        expect(group).toEqual({
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
                        maxWidth: '50%',
                        display: 'inline-block',
                    } as ContentModelBlockFormat,
                    isImplicit: false,
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });
});
