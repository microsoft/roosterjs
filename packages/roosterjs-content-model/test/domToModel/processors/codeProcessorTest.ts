import { codeProcessor } from '../../../lib/domToModel/processors/codeProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';

describe('codeProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Simple Code element', () => {
        const group = createContentModelDocument();
        const code = document.createElement('code');

        code.appendChild(document.createTextNode('test'));
        context.segmentFormat.fontFamily = 'Arial';

        codeProcessor(group, code, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontFamily: 'Arial' },
                            text: 'test',
                            code: {
                                format: { fontFamily: 'monospace' },
                            },
                        },
                    ],
                },
            ],
        });
        expect(context.code).toEqual({ format: {} });
    });

    it('Code element with a different font', () => {
        const group = createContentModelDocument();
        const code = document.createElement('code');

        code.style.fontFamily = 'Tahoma';
        code.appendChild(document.createTextNode('test'));
        context.segmentFormat.fontFamily = 'Arial';

        codeProcessor(group, code, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontFamily: 'Tahoma' },
                            text: 'test',
                            code: {
                                format: { fontFamily: 'Tahoma' },
                            },
                        },
                    ],
                },
            ],
        });
        expect(context.code).toEqual({ format: {} });
    });

    it('Code with display:block', () => {
        const group = createContentModelDocument();
        const code = document.createElement('code');

        code.appendChild(document.createTextNode('test'));
        code.style.display = 'block';

        codeProcessor(group, code, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                            code: {
                                format: {
                                    fontFamily: 'monospace',
                                    display: 'block',
                                },
                            },
                        },
                    ],
                },
            ],
        });
        expect(context.code).toEqual({ format: {} });
    });
});
