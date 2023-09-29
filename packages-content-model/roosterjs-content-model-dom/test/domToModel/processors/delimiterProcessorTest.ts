import * as delimiterProcessorFile from '../../../lib/domToModel/processors/childProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createRange } from 'roosterjs-editor-dom';
import { delimiterProcessor } from '../../../lib/domToModel/processors/delimiterProcessor';
import { DomToModelContext } from 'roosterjs-content-model-types';

describe('delimiterProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Delimiter', () => {
        const doc = createContentModelDocument();
        const span = document.createElement('span');
        span.append(document.createTextNode(''));
        spyOn(delimiterProcessorFile, 'handleRegularSelection');

        delimiterProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(delimiterProcessorFile.handleRegularSelection).toHaveBeenCalledTimes(3);
    });

    it('Delimiter with selection', () => {
        const doc = createContentModelDocument();
        const text = document.createTextNode('test');
        const span = document.createElement('span');
        const span2 = document.createElement('span');
        const div = document.createElement('div');

        span.appendChild(text);

        div.appendChild(span);
        div.appendChild(span2);

        context.selection = {
            type: 'range',
            range: createRange(text, 0, span2, 0),
        };

        delimiterProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(context.isInSelection).toBeTrue();
    });
});
