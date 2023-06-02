import { blockProcessor } from '../../../lib/domToModel/processors/blockProcessor';
import { ContentModelBlockFormat } from '../../../lib/publicTypes/format/ContentModelBlockFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';

describe('blockProcessor', () => {
    let context: DomToModelContext;
    let group: ContentModelDocument;
    let childSpy: jasmine.Spy;

    beforeEach(() => {
        context = createDomToModelContext();
        group = createContentModelDocument();
        childSpy = jasmine.createSpy('child');

        context.elementProcessors.child = childSpy;
    });

    function runTest(
        element: HTMLElement,
        expectedModel: ContentModelDocument,
        expectContextFormat: ContentModelBlockFormat,
        segmentFormat?: ContentModelSegmentFormat
    ) {
        blockProcessor(group, element, context, segmentFormat);

        expect(group).toEqual(expectedModel);
        expect(context.blockFormat).toEqual(expectContextFormat);

        expect(childSpy).toHaveBeenCalledTimes(1);
        expect(childSpy).toHaveBeenCalledWith(group, element, context);
    }

    it('empty DIV', () => {
        const div = document.createElement('div');

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {}
        );
    });

    it('DIV with decorator', () => {
        context.blockDecorator = {
            tagName: 'p',
            format: {},
        };

        const div = document.createElement('div');

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                ],
            },
            {}
        );
    });

    it('DIV with blockFormat', () => {
        const div = document.createElement('div');

        div.style.lineHeight = '2';

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {
                            lineHeight: '2',
                        },
                    },
                ],
            },
            { lineHeight: '2' }
        );
    });

    it('DIV with blockFormat and containerFormat', () => {
        const div = document.createElement('div');

        div.style.lineHeight = '2';
        div.style.backgroundColor = 'red';

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {
                            lineHeight: '2',
                            backgroundColor: 'red',
                        },
                    },
                ],
            },
            { lineHeight: '2' }
        );
    });

    it('DIV with context format', () => {
        const div = document.createElement('div');

        div.style.margin = '20px';
        context.blockFormat.marginLeft = '40px';

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {
                            marginLeft: '60px',
                            marginTop: '20px',
                            marginRight: '20px',
                            marginBottom: '20px',
                        },
                    },
                ],
            },
            { marginLeft: '60px', marginRight: '20px' }
        );
    });

    it('A', () => {
        const a = document.createElement('a');

        runTest(
            a,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            {}
        );
    });

    it('DIV with segment format', () => {
        const div = document.createElement('div');

        runTest(
            div,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                        segmentFormat: { fontSize: '20px' },
                    },
                ],
            },
            {},
            {
                fontSize: '20px',
            }
        );
    });
});
