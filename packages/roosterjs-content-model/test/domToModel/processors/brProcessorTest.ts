import { brProcessor } from '../../../lib/domToModel/processors/brProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/domToModel/context/DomToModelContext';

describe('brProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Regular Br', () => {
        const doc = createContentModelDocument(document);
        const br = document.createElement('br');

        brProcessor(doc, br, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
            document: document,
        });
    });
});
