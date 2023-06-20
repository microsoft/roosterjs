import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { headingProcessor } from '../../../lib/domToModel/processors/headingProcessor';

describe('headingProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Header with text content and format', () => {
        const group = createContentModelDocument();
        const h1 = document.createElement('h1');

        h1.appendChild(document.createTextNode('test'));
        h1.style.fontFamily = 'Test';

        headingProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontFamily: 'Test', fontSize: '2em', fontWeight: 'bold' },
                    },
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

    it('Header with non-bold text', () => {
        const group = createContentModelDocument();
        const h1 = document.createElement('h1');
        const span = document.createElement('span');

        span.style.fontWeight = 'normal';
        span.appendChild(document.createTextNode('test'));

        h1.appendChild(span);

        headingProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontSize: '2em', fontWeight: 'bold' },
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontWeight: 'normal' },
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
});
