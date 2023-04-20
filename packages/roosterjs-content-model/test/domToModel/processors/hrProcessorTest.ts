import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { hrProcessor } from '../../../lib/domToModel/processors/hrProcessor';

describe('hrProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Regular HR', () => {
        const doc = createContentModelDocument();
        const hr = document.createElement('hr');

        hrProcessor(doc, hr, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'hr',
                    format: {},
                },
            ],
        });
    });

    it('HR with format', () => {
        const doc = createContentModelDocument();
        const hr = document.createElement('hr');

        hr.style.marginBottom = '20px';
        context.blockFormat = { marginTop: '10px' };

        hrProcessor(doc, hr, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'hr',
                    format: {
                        marginTop: '10px',
                        marginBottom: '20px',
                    },
                },
            ],
        });
    });

    it('HR with selection', () => {
        const doc = createContentModelDocument();
        const hr = document.createElement('hr');

        context.isInSelection = true;

        hrProcessor(doc, hr, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'hr',
                    format: {},
                    isSelected: true,
                },
            ],
        });
    });

    it('HR with width, size and display', () => {
        const doc = createContentModelDocument();
        const hr = document.createElement('hr');

        hr.style.display = 'inline-block';
        hr.style.width = '98%';
        hr.size = '2';

        hrProcessor(doc, hr, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Divider',
                    tagName: 'hr',
                    size: '2',
                    format: {
                        display: 'inline-block',
                        width: '98%',
                    },
                },
            ],
        });
    });
});
