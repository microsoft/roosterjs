import { blockProcessor } from '../../../lib/domToModel/processors/blockProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import {
    ContentModelBlockFormat,
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelContext,
} from 'roosterjs-content-model-types';

describe('blockProcessor', () => {
    let context: DomToModelContext;
    let group: ContentModelDocument;
    let childSpy: jasmine.Spy;
    let assignMarkerToModelSpy: jasmine.Spy;

    beforeEach(() => {
        group = createContentModelDocument();
        childSpy = jasmine.createSpy('child');

        assignMarkerToModelSpy = jasmine.createSpy('assignMarkerToModel');

        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: childSpy,
            },
        });

        context.paragraphMap = {
            assignMarkerToModel: assignMarkerToModelSpy,
        } as any;
    });

    function runTest(
        element: HTMLElement,
        expectedModel: ContentModelDocument,
        expectContextFormat: ContentModelBlockFormat,
        paragraphMapCalledTimes: number,
        segmentFormat?: ContentModelSegmentFormat
    ) {
        blockProcessor(group, element, context, segmentFormat);

        expect(group).toEqual(expectedModel);
        expect(context.blockFormat).toEqual(expectContextFormat);

        expect(childSpy).toHaveBeenCalledTimes(1);
        expect(childSpy).toHaveBeenCalledWith(group, element, context);

        expect(assignMarkerToModelSpy).toHaveBeenCalledTimes(paragraphMapCalledTimes);
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
            {},
            1
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
            {},
            1
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
            { lineHeight: '2' },
            1
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
            { lineHeight: '2' },
            1
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
            { marginLeft: '60px', marginRight: '20px' },
            1
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
            {},
            0
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
            1,
            {
                fontSize: '20px',
            }
        );
    });
});
