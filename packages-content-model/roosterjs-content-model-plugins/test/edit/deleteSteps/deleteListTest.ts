import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteList } from '../../../lib/edit/deleteSteps/deleteList';
import { deleteSelection } from 'roosterjs-content-model-core';
import { normalizeContentModel } from 'roosterjs-content-model-dom';

describe('deleteList', () => {
    it('deletes the list item when there is only one list item', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {
                        listStyleType: '"1. "',
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(result.deleteResult).toEqual('singleChar');

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('do not delete list with text', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {
                        listStyleType: '"1. "',
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        };
        const result = deleteSelection(model, [deleteList]);
        normalizeContentModel(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {
                        listStyleType: '"1. "',
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'text',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                },
            ],
        });
        expect(result.deleteResult).toEqual('notDeleted');
    });
});
