import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { reducedModelChildProcessor } from '../../../lib/domToModel/processors/reducedModelChildProcessor';

describe('reducedModelChildProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: reducedModelChildProcessor,
            },
        });
    });

    it('Empty DOM', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Single child node, with selected Node in context', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.appendChild(span);
        span.textContent = 'test';
        context.selectionRootNode = span;

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
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
    });

    it('Multiple child nodes, with selected Node in context', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
        span1.textContent = 'test1';
        span2.textContent = 'test2';
        span3.textContent = 'test3';
        context.selectionRootNode = span2;

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple child nodes, with selected Node in context, with more child nodes under selected node', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
        span1.textContent = 'test1';
        span2.innerHTML = '<div>line1</div><div>line2</div>';
        span3.textContent = 'test3';
        context.selectionRootNode = span2;

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'line1',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'line2',
                            format: {},
                        },
                    ],
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

    it('Multiple layer with multiple child nodes, with selected Node in context, with more child nodes under selected node', () => {
        const doc = createContentModelDocument();
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div3.appendChild(span1);
        div3.appendChild(span2);
        div3.appendChild(span3);
        div1.appendChild(div2);
        div2.appendChild(div3);
        span1.textContent = 'test1';
        span2.innerHTML = '<div>line1</div><div>line2</div>';
        span3.textContent = 'test3';
        context.selectionRootNode = span2;

        reducedModelChildProcessor(doc, div1, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                { blockType: 'Paragraph', segments: [], format: {} },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'line1', format: {} }],
                    format: {},
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'line2', format: {} }],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });
});
