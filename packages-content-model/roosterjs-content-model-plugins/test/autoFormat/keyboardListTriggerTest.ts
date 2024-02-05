import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { keyboardListTrigger } from '../../lib/autoFormat/keyboardListTrigger';

describe('keyboardListTrigger', () => {
    let normalizeContentModelSpy: jasmine.Spy;
    beforeEach(() => {
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');
    });

    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean,
        shouldSearchForBullet: boolean = true,
        shouldSearchForNumbering: boolean = true
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                expect(result).toBe(expectedResult);
            });

        keyboardListTrigger(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            {
                preventDefault: () => {},
            } as KeyboardEvent,
            shouldSearchForBullet,
            shouldSearchForNumbering
        );

        if (expectedResult) {
            expect(normalizeContentModelSpy).toHaveBeenCalled();
        } else {
            expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        }

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('trigger numbering list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '1)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    startNumberOverride: 1,
                                    direction: undefined,
                                    textAlign: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('trigger continued numbering list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3,"unorderedStyleType":1}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '2)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: ' test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3,"unorderedStyleType":1}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 2,
                                    direction: undefined,
                                    textAlign: undefined,
                                    marginBottom: '0px',
                                    marginTop: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('should not trigger numbering list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '1)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '1)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            false,
            undefined,
            false
        );
    });

    it('should trigger bullet list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '*',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    startNumberOverride: 1,
                                    direction: undefined,
                                    textAlign: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"unorderedStyleType":1}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('should not trigger bullet list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '*',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '*',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            false,
            false
        );
    });

    it('trigger continued numbering list between lists', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '3)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"A) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"B) "',
                        },
                    },
                ],
                format: {},
            },

            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 3,
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    direction: undefined,
                                    textAlign: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"A) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"B) "',
                        },
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('trigger a new numbering list after a numbering list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'A)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {
                                    startNumberOverride: 1,
                                    marginTop: '0px',
                                    marginBottom: '0px',
                                    direction: undefined,
                                    textAlign: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });
});
