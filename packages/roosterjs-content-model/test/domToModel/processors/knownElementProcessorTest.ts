import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { HyperLinkColorPlaceholder } from '../../../lib/formatHandlers/utils/defaultStyles';
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

        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(2);
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

    it('Header with text content and format', () => {
        const group = createContentModelDocument();
        const h1 = document.createElement('h1');

        h1.appendChild(document.createTextNode('test'));
        h1.style.fontFamily = 'Test';

        knownElementProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontWeight: 'bold', fontSize: '2em', fontFamily: 'Test' },
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontWeight: 'bold', fontFamily: 'Test', fontSize: '2em' },
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

    it('Header with non-bold text', () => {
        const group = createContentModelDocument();
        const h1 = document.createElement('h1');
        const span = document.createElement('span');

        span.style.fontWeight = 'normal';
        span.appendChild(document.createTextNode('test'));

        h1.appendChild(span);

        knownElementProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontWeight: 'bold', fontSize: '2em' },
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontWeight: 'normal', fontSize: '2em' },
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

    it('Simple Anchor element', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');

        a.href = '/test';
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
                            format: {
                                underline: true,
                                textColor: HyperLinkColorPlaceholder,
                            },
                            link: { format: { href: '/test' }, dataset: {} },
                            text: 'test',
                        },
                    ],
                },
            ],
        });
        expect(context.link).toEqual({ format: {}, dataset: {} });
    });

    it('Anchor element with dataset', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';
        a.dataset.a = 'b';
        a.dataset.c = 'd';

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
                            format: {
                                underline: true,
                                textColor: HyperLinkColorPlaceholder,
                            },
                            link: {
                                format: { href: '/test' },
                                dataset: {
                                    a: 'b',
                                    c: 'd',
                                },
                            },
                            text: 'test',
                        },
                    ],
                },
            ],
        });
        expect(context.link).toEqual({ format: {}, dataset: {} });
    });

    it('P tag', () => {
        const group = createContentModelDocument();
        const p = document.createElement('p');

        spyOn(parseFormat, 'parseFormat');

        knownElementProcessor(group, p, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
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

        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(2);
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            p,
            context.formatParsers.block,
            context.blockFormat,
            context
        );
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            p,
            context.formatParsers.segmentOnBlock,
            context.segmentFormat,
            context
        );
    });

    it('Div with top margin', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        context.defaultStyles.div = {
            marginTop: '20px',
            marginBottom: '40px',
            display: 'block',
        };

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginTop: '20px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: { marginBottom: '40px' },
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

    it('BLOCKQUOTE used for indent', () => {
        const group = createContentModelDocument();
        const quote = document.createElement('blockquote');
        quote.appendChild(document.createTextNode('test1'));

        knownElementProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginTop: '1em',
                    },
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                        marginRight: '40px',
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
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginBottom: '1em',
                    },
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
        quote.appendChild(document.createTextNode('test1'));

        context.isInSelection = true;
        knownElementProcessor(group, quote, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginTop: '1em',
                    },
                    isSelected: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {
                        marginLeft: '40px',
                        marginRight: '40px',
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
                    blockType: 'Divider',
                    tagName: 'div',
                    format: {
                        marginBottom: '1em',
                    },
                    isSelected: true,
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
