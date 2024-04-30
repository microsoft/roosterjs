import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteEmptyQuote } from '../../../lib/edit/deleteSteps/deleteEmptyQuote';
import { deleteSelection, normalizeContentModel } from 'roosterjs-content-model-dom';

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
