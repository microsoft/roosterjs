import changeFontSize from '../../../lib/publicApi/segment/changeFontSize';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { createRange } from 'roosterjs-content-model-dom/test/testUtils';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import { segmentTestCommon } from './segmentTestCommon';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';

describe('changeFontSize', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        change: 'increase' | 'decrease' = 'increase'
    ) {
        segmentTestCommon(
            'changeFontSize',
            editor => {
                changeFontSize(editor, change);
            },
            model,
            result,
            calledTimes
        );
    }

    it('empty content', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );
    });

    it('no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('Collapsed selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '10pt' },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontSize: '10pt',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '10pt' },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: { fontSize: '11pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('With selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '10pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '11pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With mixed selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '10pt' },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '15pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '11pt' },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '16pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    function testSizeChange(original: string, expected: string, change: 'increase' | 'decrease') {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: original },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: expected },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            change
        );
    }

    it('increase pt 1', () => {
        testSizeChange('7pt', '8pt', 'increase');
    });

    it('increase pt 2', () => {
        testSizeChange('8pt', '9pt', 'increase');
    });

    it('increase pt 3', () => {
        testSizeChange('28pt', '36pt', 'increase');
    });

    it('increase pt 4', () => {
        testSizeChange('37pt', '48pt', 'increase');
    });

    it('increase pt 5', () => {
        testSizeChange('72pt', '80pt', 'increase');
    });

    it('increase pt 6', () => {
        testSizeChange('80pt', '90pt', 'increase');
    });

    it('increase pt 7', () => {
        testSizeChange('990pt', '1000pt', 'increase');
    });

    it('increase pt 8', () => {
        testSizeChange('1000pt', '1000pt', 'increase');
    });

    it('decrease pt 1', () => {
        testSizeChange('1pt', '1pt', 'decrease');
    });

    it('decrease pt 2', () => {
        testSizeChange('7pt', '6pt', 'decrease');
    });

    it('decrease pt 3', () => {
        testSizeChange('8pt', '7pt', 'decrease');
    });

    it('decrease pt 4', () => {
        testSizeChange('28pt', '26pt', 'decrease');
    });

    it('decrease pt 5', () => {
        testSizeChange('37pt', '36pt', 'decrease');
    });

    it('decrease pt 6', () => {
        testSizeChange('72pt', '48pt', 'decrease');
    });

    it('decrease pt 7', () => {
        testSizeChange('80pt', '72pt', 'decrease');
    });

    it('decrease pt 8', () => {
        testSizeChange('990pt', '980pt', 'decrease');
    });

    it('decrease pt 9', () => {
        testSizeChange('1000pt', '990pt', 'decrease');
    });

    it('Test format parser', () => {
        const div = document.createElement('div');
        const sub = document.createElement('sub');

        sub.textContent = 'test';
        div.appendChild(sub);
        div.style.fontSize = '20pt';

        const model = domToContentModel(div, createDomToModelContext(undefined), {
            type: 'range',
            range: createRange(sub),
        });

        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        const editor = ({
            formatContentModel,
            focus: jasmine.createSpy(),
            getPendingFormat: () => null as ContentModelSegmentFormat,
        } as any) as IStandaloneEditor;

        changeFontSize(editor, 'increase');

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { superOrSubScriptSequence: 'sub' },
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Paragraph has font size', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segmentFormat: { fontSize: '20pt' },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '10pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segmentFormat: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '11pt' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            'increase'
        );
    });
});
