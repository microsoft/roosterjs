import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { imageProcessor } from '../../../lib/domToModel/processors/imageProcessor';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    ContentModelDomIndexer,
    ContentModelImage,
    ContentModelParagraph,
    DomToModelContext,
} from 'roosterjs-content-model-types';

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

        context.rangeEx = {
            type: SelectionRangeTypes.ImageSelection,
            image: img,
        } as any;

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

        context.rangeEx = {
            type: SelectionRangeTypes.ImageSelection,
            image: img,
        } as any;

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

        context = createDomToModelContext(undefined, {
            formatParserOverride: { dataset: datasetParser },
        });

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

        context = createDomToModelContext(undefined, {
            formatParserOverride: { dataset: datasetParser },
        });

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

    it('Image with domIndexer', () => {
        const doc = createContentModelDocument();
        const img = document.createElement('img');
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;

        imageProcessor(doc, img, context);

        const segment: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: '',
            dataset: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            isImplicit: true,
            segments: [segment],
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(img, paragraph, [segment]);
    });
});
