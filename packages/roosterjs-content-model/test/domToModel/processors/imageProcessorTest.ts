import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { imageProcessor } from '../../../lib/domToModel/processors/imageProcessor';

describe('imageProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty image', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: '',
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with src and alt', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        img.src = 'http://test.com/testSrc';
        img.alt = 'testAlt';

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: 'http://test.com/testSrc',
                            alt: 'testAlt',
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with regular selection', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        context.isInSelection = true;

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: '',
                            isSelected: true,
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with image selection', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        context.imageSelection = { image: img };

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: '',
                            isSelected: true,
                            isSelectedAsImageSelection: true,
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with id and display:block', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        img.id = 'id1';
        img.style.display = 'block';

        context.imageSelection = { image: img };

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {
                                id: 'id1',
                                display: 'block',
                            },
                            src: '',
                            isSelected: true,
                            isSelectedAsImageSelection: true,
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with link format', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');

        context.link = {
            format: { href: '/test' },
            dataset: {},
        };
        img.src = 'http://test.com/testSrc';

        imageProcessor(doc, img, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            format: {},
                            src: 'http://test.com/testSrc',
                            link: {
                                format: {
                                    href: '/test',
                                },
                                dataset: {},
                            },
                            dataset: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Image with dataset', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');
        const datasetParser = jasmine.createSpy('datasetParser').and.callFake(format => {
            format.a = 'b';
        });

        img.src = 'http://test.com/testSrc';

        context.formatParsers.dataset = [datasetParser];

        imageProcessor(doc, img, context);

        expect(datasetParser).toHaveBeenCalledWith({ a: 'b' }, img, context, {});
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'http://test.com/testSrc',
                            format: {},
                            dataset: {
                                a: 'b',
                            },
                        },
                    ],
                },
            ],
        });
    });

    it('Image with dataset', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');
        const datasetParser = jasmine.createSpy('datasetParser').and.callFake(format => {
            format.a = 'b';
        });

        img.src = 'http://test.com/testSrc';

        context.formatParsers.dataset = [datasetParser];

        imageProcessor(doc, img, context);

        expect(datasetParser).toHaveBeenCalledWith({ a: 'b' }, img, context, {});
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'http://test.com/testSrc',
                            format: {},
                            dataset: {
                                a: 'b',
                            },
                        },
                    ],
                },
            ],
        });
    });
});
