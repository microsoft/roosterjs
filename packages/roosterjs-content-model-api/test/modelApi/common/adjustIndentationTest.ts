import {
    adjustListIndentation,
    adjustTableIndentation,
} from '../../../lib/modelApi/common/adjustIndentation';
import {
    ContentModelTable,
    InsertPoint,
    ShallowMutableContentModelListItem,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

describe('adjustIndentation', () => {
    describe('adjustListIndentation', () => {
        it('should adjust indentation for list item with regular spaces', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '    Hello World', // 4 spaces (1 tab)
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual({
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Hello World',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            marginLeft: '40px',
                        },
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            });
        });

        it('should adjust indentation for list item with non-breaking spaces', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Test', // 8 non-breaking spaces (2 tabs)
                                format: {},
                            },
                        ],
                        format: {},
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
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual({
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
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
                            marginLeft: '80px', // 2 tabs * 40px
                        },
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            });
        });

        it('should adjust indentation for list item with EN spaces', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '\u2002\u2002\u2002\u2002Content', // 4 EN spaces (1 tab)
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual({
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Content',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            marginLeft: '40px',
                        },
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            });
        });

        it('should not adjust indentation when no spaces at the beginning', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'No indentation',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            const originalListItem = JSON.parse(JSON.stringify(listItem));

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual(originalListItem);
        });

        it('should not adjust when block is not a paragraph', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [],
                        format: {},
                        widths: [],
                        dataset: {},
                    } as any,
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            const originalListItem = JSON.parse(JSON.stringify(listItem));

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual(originalListItem);
        });

        it('should not adjust when first segment is not text', () => {
            // Arrange
            const listItem: ShallowMutableContentModelListItem = {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
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
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            };

            const originalListItem = JSON.parse(JSON.stringify(listItem));

            // Act
            adjustListIndentation(listItem);

            // Assert
            expect(listItem).toEqual(originalListItem);
        });
    });

    describe('adjustTableIndentation', () => {
        it('should adjust table indentation for LTR with spaces', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: '        ', // 8 spaces (2 tabs)
                        format: {},
                    },
                    marker,
                ],
                format: {},
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual({
                blockType: 'Table',
                rows: [],
                format: {
                    marginLeft: '80px', // 2 tabs * 40px
                },
                widths: [],
                dataset: {},
            });
            expect(insertPoint.paragraph.segments).toEqual([marker]);
        });

        it('should adjust table indentation for RTL with spaces', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: '    ', // 4 spaces (1 tab)
                        format: {},
                    },
                    marker,
                ],
                format: {
                    direction: 'rtl',
                },
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual({
                blockType: 'Table',
                rows: [],
                format: {
                    marginRight: '40px', // 1 tab * 40px
                },
                widths: [],
                dataset: {},
            });
            expect(insertPoint.paragraph.segments).toEqual([marker]);
        });

        it('should not adjust indentation when text contains non-whitespace', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: '  Hello  ',
                        format: {},
                    },
                    marker,
                ],
                format: {},
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            const originalTable = JSON.parse(JSON.stringify(table));

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual(originalTable);
        });

        it('should handle segments with Br elements', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: '    ', // 4 spaces
                        format: {},
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                    marker,
                ],
                format: {},
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual({
                blockType: 'Table',
                rows: [],
                format: {
                    marginLeft: '40px',
                },
                widths: [],
                dataset: {},
            });
        });

        it('should not adjust when paragraph has less than 2 segments', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            const originalTable = JSON.parse(JSON.stringify(table));

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual(originalTable);
        });

        it('should handle paragraph with two selection markers', () => {
            // Arrange
            const marker = {
                segmentType: 'SelectionMarker' as const,
                isSelected: true,
                format: {},
            };
            const marker2 = {
                segmentType: 'SelectionMarker' as const,
                isSelected: false,
                format: {},
            };
            const paragraph: ShallowMutableContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: '    ', // 4 spaces
                        format: {},
                    },
                    marker2,
                    marker,
                ],
                format: {},
            };
            const insertPoint: InsertPoint = {
                paragraph,
                marker,
                path: [],
            };
            const table: ContentModelTable = {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            };

            // Act
            adjustTableIndentation(insertPoint, table);

            // Assert
            expect(table).toEqual({
                blockType: 'Table',
                rows: [],
                format: {
                    marginLeft: '40px',
                },
                widths: [],
                dataset: {},
            });
            expect(insertPoint.paragraph.segments).toEqual([marker]);
        });
    });
});
