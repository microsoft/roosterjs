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

    it('Delimiter with selection end', () => {
        const doc = createContentModelDocument();
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test2');
        const span = document.createElement('span');
        const span2 = document.createElement('span');
        const div = document.createElement('div');

        span.appendChild(text2);

        div.appendChild(text1);
        div.appendChild(span);
        div.appendChild(span2);

        context.selection = {
            type: 'range',
            range: createRange(text1, 2, text2, 3),
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
        expect(context.isInSelection).toBeFalse();
    });
});
