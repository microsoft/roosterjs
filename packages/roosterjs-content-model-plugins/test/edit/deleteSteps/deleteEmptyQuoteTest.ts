import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteEmptyQuote } from '../../../lib/edit/deleteSteps/deleteEmptyQuote';
import { deleteSelection, normalizeContentModel } from 'roosterjs-content-model-dom';
import { editingTestCommon } from '../editingTestCommon';
import { keyboardInput } from '../../../lib/edit/keyboardInput';

describe('deleteEmptyQuote', () => {
    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        deleteResult: string
    ) {
        const result = deleteSelection(model, [deleteEmptyQuote]);
        normalizeContentModel(model);
        expect(result.deleteResult).toEqual(deleteResult);
        expect(model).toEqual(expectedModel);
    }

    it('should delete empty quote', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                                {
                                    segmentType: 'Br',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
            ],
            format: {},
        };
        const expectedTestModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                    ],
                    segmentFormat: { textColor: 'rgb(102, 102, 102)' },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(model, expectedTestModel, 'range');
    });

    it('should not delete non-empty quote', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
            ],
            format: {},
        };
        runTest(model, model, 'notDeleted');
    });
});

describe('deleteEmptyQuote - keyboardInput', () => {
    function runTest(
        input: ContentModelDocument,
        key: string,
        expectedResult: ContentModelDocument,
        doNotCallDefaultFormat: boolean = false,
        calledTimes: number = 1
    ) {
        const preventDefault = jasmine.createSpy('preventDefault');
        const mockedEvent = ({
            key: key,
            shiftKey: false,
            preventDefault,
        } as any) as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            undefined,
            newEditor => {
                editor = newEditor;

                editor.getDOMSelection = () => ({
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                });

                keyboardInput(editor, mockedEvent);
            },
            input,
            expectedResult,
            calledTimes,
            doNotCallDefaultFormat
        );
    }

    it('should delete empty quote when press Enter', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                                {
                                    segmentType: 'Br',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
            ],
            format: {},
        };
        const expectedTestModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                    ],
                    segmentFormat: { textColor: 'rgb(102, 102, 102)' },
                    format: {},
                },
            ],
            format: {},
        };

        runTest(model, 'Enter', expectedTestModel);
    });

    it('should exit quote when press Enter', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                                {
                                    segmentType: 'Br',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
            ],
            format: {},
        };
        const expectedTestModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        runTest(model, 'Enter', expectedTestModel);
    });

    it('should not exit quote when press Enter', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            format: {},
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginRight: '40px',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        paddingLeft: '10px',
                        borderLeft: '3px solid rgb(200, 200, 200)',
                    },
                },
            ],
            format: {},
        };

        runTest(model, 'Enter', model, false, 0);
    });
});
