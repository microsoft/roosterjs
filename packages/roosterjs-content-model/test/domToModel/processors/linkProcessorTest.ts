import { ContentModelBlockFormat } from '../../../lib/publicTypes/format/ContentModelBlockFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { linkProcessor } from '../../../lib/domToModel/processors/linkProcessor';

describe('linkProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Simple Anchor element', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';

        linkProcessor(group, a, context);

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
                            format: {},
                            link: { format: { href: '/test', underline: true }, dataset: {} },
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

        linkProcessor(group, a, context);

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
                            format: {},
                            link: {
                                format: { href: '/test', underline: true },
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

    it('Anchor element with display: block', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';
        a.style.display = 'block';

        linkProcessor(group, a, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { display: 'block' } as ContentModelBlockFormat,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            link: {
                                format: { href: '/test', underline: true, display: 'block' },
                                dataset: {},
                            },
                            text: 'test',
                        },
                    ],
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
        expect(context.link).toEqual({ format: {}, dataset: {} });
    });

    it('margin, padding and background color on link', () => {
        const group = createContentModelDocument();
        const a = document.createElement('a');

        a.href = '/test';
        a.textContent = 'test';
        a.style.margin = '10px';
        a.style.padding = '20px';
        a.style.backgroundColor = 'red';

        linkProcessor(group, a, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { backgroundColor: 'red' },
                            link: {
                                format: {
                                    href: '/test',
                                    underline: true,
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                    marginLeft: '10px',
                                    marginRight: '10px',
                                    paddingTop: '20px',
                                    paddingBottom: '20px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    backgroundColor: 'red',
                                },
                                dataset: {},
                            },
                            text: 'test',
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
        expect(context.link).toEqual({ format: {}, dataset: {} });
    });
});
