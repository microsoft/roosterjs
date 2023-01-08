import * as getComputedStyles from 'roosterjs-editor-dom/lib/utils/getComputedStyles';
import changeFontSize from '../../../lib/publicApi/segment/changeFontSize';
import domToContentModel from '../../../lib/publicApi/domToContentModel';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createRange } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';
import { segmentTestCommon } from './segmentTestCommon';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('changeFontSize', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        change: 'increase' | 'decrease' = 'increase'
    ) {
        segmentTestCommon(
            'changeFontSize',
            editor => changeFontSize(editor, change),
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
            1
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

    it('increase pt', () => {
        testSizeChange('7pt', '8pt', 'increase');
        testSizeChange('8pt', '9pt', 'increase');
        testSizeChange('28pt', '36pt', 'increase');
        testSizeChange('37pt', '48pt', 'increase');
        testSizeChange('72pt', '80pt', 'increase');
        testSizeChange('80pt', '90pt', 'increase');
        testSizeChange('990pt', '1000pt', 'increase');
        testSizeChange('1000pt', '1000pt', 'increase');
    });

    it('decrease pt', () => {
        testSizeChange('1pt', '1pt', 'decrease');
        testSizeChange('7pt', '6pt', 'decrease');
        testSizeChange('8pt', '7pt', 'decrease');
        testSizeChange('28pt', '26pt', 'decrease');
        testSizeChange('37pt', '36pt', 'decrease');
        testSizeChange('72pt', '48pt', 'decrease');
        testSizeChange('80pt', '72pt', 'decrease');
        testSizeChange('990pt', '980pt', 'decrease');
        testSizeChange('1000pt', '990pt', 'decrease');
    });

    it('Test format parser', () => {
        const addUndoSnapshot = jasmine.createSpy().and.callFake((callback: () => void) => {
            callback();
        });
        const setContentModel = jasmine.createSpy();
        const div = document.createElement('div');
        const sub = document.createElement('sub');

        sub.textContent = 'test';
        div.appendChild(sub);
        div.style.fontSize = '20pt';

        const editor = ({
            createContentModel: (startNode: any, option: any) =>
                domToContentModel(div, null!, {
                    selectionRange: {
                        type: SelectionRangeTypes.Normal,
                        areAllCollapsed: false,
                        ranges: [createRange(sub)],
                    },
                    includeRoot: true,
                    ...option,
                }),
            addUndoSnapshot,
            focus: jasmine.createSpy(),
            setContentModel,
            getPendingFormat: () => <ContentModelDocument | null>null,
            setPendingFormat: () => {},
        } as any) as IExperimentalContentModelEditor;

        spyOn(getComputedStyles, 'getComputedStyle').and.callFake(
            (node: HTMLElement, style: string) => {
                return node.style.fontSize;
            }
        );

        changeFontSize(editor, 'increase');

        expect(setContentModel).toHaveBeenCalledWith({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                fontSize: '22pt',
                                superOrSubScriptSequence: 'sub',
                            },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });

        expect(getComputedStyles.getComputedStyle).toHaveBeenCalledTimes(1);
        expect(getComputedStyles.getComputedStyle).toHaveBeenCalledWith(div, 'font-size');
    });
});
