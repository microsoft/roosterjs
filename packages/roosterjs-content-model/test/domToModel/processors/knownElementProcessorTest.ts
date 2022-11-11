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
        const group = createContentModelDocument(document);
        const div = document.createElement('div');

        spyOn(parseFormat, 'parseFormat');

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
        const group = createContentModelDocument(document);
        const div = document.createElement('div');

        div.appendChild(document.createTextNode('test'));

        knownElementProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
        const group = createContentModelDocument(document);
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
            document: document,
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
        const group = createContentModelDocument(document);
        const h1 = document.createElement('h1');

        h1.appendChild(document.createTextNode('test'));
        h1.style.fontFamily = 'Test';

        knownElementProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    header: {
                        headerLevel: 1,
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
        const group = createContentModelDocument(document);
        const h1 = document.createElement('h1');
        const span = document.createElement('span');

        span.style.fontWeight = 'normal';
        span.appendChild(document.createTextNode('test'));

        h1.appendChild(span);

        knownElementProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    header: {
                        headerLevel: 1,
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
        const group = createContentModelDocument(document);
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';

        knownElementProcessor(group, a, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
        const group = createContentModelDocument(document);
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';
        a.dataset.a = 'b';
        a.dataset.c = 'd';

        knownElementProcessor(group, a, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
});
