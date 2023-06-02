import * as formatContainerProcessor from '../../../lib/domToModel/processors/formatContainerProcessor';
import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { knownElementProcessor } from '../../../lib/domToModel/processors/knownElementProcessor';

describe('knownElementProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty DIV', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        spyOn(parseFormat, 'parseFormat');

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });

        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(3);
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            div,
            context.formatParsers.block,
            context.blockFormat,
            context
        );
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            div,
            context.formatParsers.segmentOnBlock,
            context.segmentFormat,
            context
        );
    });

    it('Div with text content', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.appendChild(document.createTextNode('test'));

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Inline div with text content', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        group.blocks[0] = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        };

        div.style.display = 'inline';
        div.appendChild(document.createTextNode('test'));

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
            ],
        });
    });

    it('Div with top margin', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.marginTop = '20px';
        div.style.marginBottom = '40px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    format: {
                        marginTop: '20px',
                        marginBottom: '40px',
                    },
                    blocks: [],
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('BLOCKQUOTE with other style', () => {
        const doc = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.style.color = 'red';
        quote.appendChild(document.createTextNode('test'));

        knownElementProcessor(doc, quote, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginRight: '40px',
                        marginLeft: '40px',
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    segmentFormat: { textColor: 'red' },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {
                                textColor: 'red',
                            },
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Div with 0 margin', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.margin = '0px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '0px',
                        marginRight: '0px',
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    segments: [],
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

    it('Nested DIV with left margin', () => {
        const group = createContentModelDocument();
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.style.marginLeft = '40px';
        div2.style.marginLeft = '60px';
        div2.appendChild(document.createTextNode('test2'));

        div1.appendChild(document.createTextNode('test1'));
        div1.appendChild(div2);
        div1.appendChild(document.createTextNode('test3'));

        knownElementProcessor(group, div1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '100px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Div with padding', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.padding = '20px 0 40px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    format: {
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        paddingTop: '20px',
                        paddingBottom: '40px',
                    },
                    tagName: 'div',
                    blocks: [],
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('Div with border', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.border = 'solid 1px black';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    blocks: [],
                    format: {
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                        borderTop: '1px solid black',
                        borderBottom: '1px solid black',
                    },
                    tagName: 'div',
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('DIV with width', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.width = '100px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    blocks: [],
                    format: {
                        width: '100px',
                    },
                    tagName: 'div',
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('DIV with width', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.maxWidth = '100px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    blocks: [],
                    format: {
                        maxWidth: '100px',
                    },
                    tagName: 'div',
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('DIV with padding left', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.paddingLeft = '10px';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    blocks: [],
                    format: {
                        paddingLeft: '10px',
                    },
                    tagName: 'div',
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('BLOCKQUOTE used for indent', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.appendChild(document.createTextNode('test1'));

        knownElementProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                        marginRight: '40px',
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('BLOCKQUOTE used for indent with selection', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');

        quote.style.marginTop = '0';
        quote.style.marginBottom = '0';
        quote.appendChild(document.createTextNode('test1'));

        context.isInSelection = true;
        knownElementProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                        marginRight: '40px',
                        marginTop: '0px',
                        marginBottom: '0px',
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('div with align attribute, need to use FormatContainer', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.align = 'center';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    format: {
                        htmlAlign: 'center',
                    },
                    blocks: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('div with align attribute and display=inline-block, need to use FormatContainer', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.align = 'center';
        div.style.display = 'inline-block';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    format: {
                        htmlAlign: 'center',
                        display: 'inline-block',
                    },
                    blocks: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('A with inline-block, do not use FormatContainer', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');
        const formatContainerSpy = spyOn(formatContainerProcessor, 'formatContainerProcessor');

        a.href = '#';
        a.style.display = 'inline-block';
        a.textContent = 'test';

        knownElementProcessor(group, a, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                },
            ],
        });

        expect(formatContainerSpy).not.toHaveBeenCalled();
    });

    it('DIV with inline styles', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        div.style.fontFamily = 'Arial';
        div.style.fontSize = '20px';
        div.textContent = 'test';

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontFamily: 'Arial', fontSize: '20px' },
                        },
                    ],
                    segmentFormat: { fontFamily: 'Arial', fontSize: '20px' },
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });
});
