import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { dataProcessor } from '../../../lib/domToModel/processors/dataProcessor';
import { DomToModelContext } from 'roosterjs-content-model-types';

describe('dataProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Data element with value attribute and text child', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '21053');
        data.textContent = 'Cherry Tomato';

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Cherry Tomato',
                            format: { dataValue: '21053' },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element combines multiple text child nodes', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '1');
        data.appendChild(document.createTextNode('Hello'));
        data.appendChild(document.createTextNode(' World'));

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Hello World',
                            format: { dataValue: '1' },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element keeps segment format from element', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '5');
        data.style.color = 'red';
        data.textContent = 'test';

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { dataValue: '5', textColor: 'red' },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element in selection', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '5');
        data.textContent = 'test';
        context.isInSelection = true;

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { dataValue: '5' },
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element calls domIndexer onSegment', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '5');
        data.textContent = 'test';

        const onSegmentSpy = jasmine.createSpy('onSegment');
        context.domIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
            reconcileChildList: null!,
            onBlockEntity: null!,
            reconcileElementId: null!,
            reconcileImageAttribute: null!,
            onMergeText: null!,
            clearIndex: null!,
        };

        dataProcessor(doc, data, context);

        const segment = {
            segmentType: 'Text',
            text: 'test',
            format: { dataValue: '5' },
        };
        const paragraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [segment],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph as any],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(data, paragraph, [segment]);
    });

    it('Data element without value attribute falls back to general processor', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.textContent = 'test';

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'General',
                            element: data,
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    isImplicit: true,
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'test',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element with non-text child falls back to general processor', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '5');
        data.innerHTML = '<span>test</span>';

        dataProcessor(doc, data, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'General',
                            element: data,
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    isImplicit: true,
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'test',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
