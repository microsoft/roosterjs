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
                            format: {},
                            data: {
                                format: { dataValue: '21053' },
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(context.data).toEqual({ format: {} });
    });

    it('Data element with empty value attribute', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '');
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
                            format: {},
                            data: {
                                format: { dataValue: '' },
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(context.data).toEqual({ format: {} });
    });

    it('Data element without value attribute', () => {
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
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(context.data).toEqual({ format: {} });
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
                            format: { textColor: 'red' },
                            data: {
                                format: { dataValue: '5' },
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Data element with multiple children', () => {
        const doc = createContentModelDocument();
        const data = document.createElement('data');

        data.setAttribute('value', '1');
        data.appendChild(document.createTextNode('Hello'));
        data.appendChild(document.createElement('br'));

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
                            text: 'Hello',
                            format: {},
                            data: {
                                format: { dataValue: '1' },
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Nested data element does not inherit parent value', () => {
        const doc = createContentModelDocument();
        const outer = document.createElement('data');
        const inner = document.createElement('data');

        outer.setAttribute('value', 'outer');
        inner.setAttribute('value', 'inner');
        inner.textContent = 'test';
        outer.appendChild(inner);

        dataProcessor(doc, outer, context);

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
                            format: {},
                            data: {
                                format: { dataValue: 'inner' },
                            },
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
                            format: {},
                            isSelected: true,
                            data: {
                                format: { dataValue: '5' },
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
