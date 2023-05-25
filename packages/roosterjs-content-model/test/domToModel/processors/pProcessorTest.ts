import * as parseFormat from '../../../lib/domToModel/utils/parseFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { pProcessor } from '../../../lib/domToModel/processors/pProcessor';

describe('pProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Header with text content and format', () => {
        const group = createContentModelDocument();
        const h1 = document.createElement('h1');

        h1.appendChild(document.createTextNode('test'));
        h1.style.fontFamily = 'Test';

        pProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontWeight: 'bold', fontSize: '2em', fontFamily: 'Test' },
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontWeight: 'bold', fontFamily: 'Test', fontSize: '2em' },
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                    decorator: {
                        tagName: 'h1',
                        format: { fontFamily: 'Test', fontSize: '2em', fontWeight: 'bold' },
                    },
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

        pProcessor(group, h1, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: { fontWeight: 'bold', fontSize: '2em' },
                    },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontWeight: 'normal', fontSize: '2em' },
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                    decorator: { tagName: 'h1', format: { fontSize: '2em', fontWeight: 'bold' } },
                },
            ],
        });
    });

    it('P tag', () => {
        const group = createContentModelDocument();
        const p = document.createElement('p');

        spyOn(parseFormat, 'parseFormat');

        pProcessor(group, p, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
            ],
        });

        expect(parseFormat.parseFormat).toHaveBeenCalledTimes(4);
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            p,
            context.formatParsers.block,
            context.blockFormat,
            context
        );
        expect(parseFormat.parseFormat).toHaveBeenCalledWith(
            p,
            context.formatParsers.segmentOnBlock,
            context.segmentFormat,
            context
        );
    });
});
