import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import changeFontSize from '../../../lib/publicApi/segment/changeFontSize';
import domToContentModel from '../../../lib/domToModel/domToContentModel';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createRange } from 'roosterjs-editor-dom';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
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
        spyOn(pendingFormat, 'setPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

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
            createContentModel: (option: any) =>
                domToContentModel(
                    div,
                    { isDarkMode: false },
                    {
                        selectionRange: {
                            type: SelectionRangeTypes.Normal,
                            areAllCollapsed: false,
                            ranges: [createRange(sub)],
                        },
                        includeRoot: true,
                        ...option,
                    }
                ),
            addUndoSnapshot,
            focus: jasmine.createSpy(),
            setContentModel,
        } as any) as IContentModelEditor;

        changeFontSize(editor, 'increase');

        expect(setContentModel).toHaveBeenCalledWith(
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
                                format: {
                                    fontSize: '22pt',
                                    superOrSubScriptSequence: 'sub',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            { onNodeCreated: undefined }
        );
    });
});
