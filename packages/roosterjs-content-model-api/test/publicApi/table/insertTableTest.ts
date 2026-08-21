import { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';
import { insertTable } from '../../../lib/publicApi/table/insertTable';

describe('insertTable', () => {
    let editor: IEditor;
    let focusSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let getContentModelCopySpy: jasmine.Spy;
    let mockDocument: Document;

    beforeEach(() => {
        mockDocument = document.implementation.createHTMLDocument('test');
        focusSpy = jasmine.createSpy('focus');
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue(null);
        getContentModelCopySpy = jasmine.createSpy('getContentModelCopy');

        editor = {
            focus: focusSpy,
            formatContentModel: formatContentModelSpy,
            getPendingFormat: getPendingFormatSpy,
            getDOMSelection: getDOMSelectionSpy,
            getContentModelCopy: getContentModelCopySpy,
        } as any;
    });

    function setupRangeSelection(model: ContentModelDocument) {
        const div = mockDocument.createElement('div');
        div.textContent = 'selected';
        mockDocument.body.appendChild(div);
        const range = mockDocument.createRange();
        range.selectNodeContents(div);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range,
            isReverted: false,
        });
        getContentModelCopySpy.and.returnValue(model);
    }

    describe('insertTable with indentation', () => {
        it('should insert table with proper indentation when cursor is in indented text', () => {
            // Arrange
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '    ', // 4 spaces for indentation
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
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any, options: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert
            expect(focusSpy).toHaveBeenCalled();
            expect(formatContentModelSpy).toHaveBeenCalled();

            // Verify the model structure after table insertion
            expect(resultModel!).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                format: {},
                                height: jasmine.any(Number),
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
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
                                        format: jasmine.any(Object),
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
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
                                        format: jasmine.any(Object),
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                            {
                                format: {},
                                height: jasmine.any(Number),
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
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
                                        format: jasmine.any(Object),
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                    {
                                        blockGroupType: 'TableCell',
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
                                        format: jasmine.any(Object),
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {
                            marginLeft: '40px',
                            borderCollapse: true,
                            useBorderBox: true,
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
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
                ],
            });
        });

        it('should insert table with RTL indentation when direction is RTL', () => {
            // Arrange
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '        ', // 8 spaces = 2 tabs
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 3, 3);

            // Assert
            expect(resultModel!).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: jasmine.any(Array),
                        format: {
                            marginRight: '80px',
                            borderCollapse: true,
                            useBorderBox: true,
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                    },
                ],
            });
        });

        it('should insert table with format', () => {
            // Arrange
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
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
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 3, 3, undefined, {
                marginBottom: '1px',
            });

            // Assert
            expect(resultModel!).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: jasmine.any(Array),
                        format: {
                            borderCollapse: true,
                            useBorderBox: true,
                            marginBottom: '1px',
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
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
                ],
            });
        });
        it('should insert table with minimum width', () => {
            // Arrange
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
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
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(
                editor,
                1,
                1,
                undefined,
                {
                    marginBottom: '1px',
                },
                {
                    minWidth: '15px',
                }
            );

            // Assert
            expect(resultModel!).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                format: {},
                                height: jasmine.any(Number),
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
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
                                        format: {
                                            minWidth: '15px',
                                            useBorderBox: true,
                                            borderTop: '1px solid #ABABAB',
                                            borderRight: '1px solid #ABABAB',
                                            borderBottom: '1px solid #ABABAB',
                                            borderLeft: '1px solid #ABABAB',
                                            verticalAlign: 'top',
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {
                            borderCollapse: true,
                            useBorderBox: true,
                            marginBottom: '1px',
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
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
                ],
            });
        });
    });

    describe('insertTable with range selection (insertTableContent)', () => {
        it('should insert table with selected paragraphs content into first column cells', () => {
            // Arrange - Multiple paragraphs with selected text (range selection)
            const selectedModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 3',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            // Setup the range selection mock
            setupRangeSelection(selectedModel);

            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 3',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act - insert 2 columns x 3 rows table
            insertTable(editor, 2, 3);

            // Assert
            expect(focusSpy).toHaveBeenCalled();
            expect(formatContentModelSpy).toHaveBeenCalled();

            // Verify table was created with content in first column
            expect(resultModel!.blocks.length).toBe(2); // Table + trailing paragraph
            expect(resultModel!.blocks[0].blockType).toBe('Table');

            const table = resultModel!.blocks[0] as any;
            expect(table.rows.length).toBe(3);

            // First row, first cell should have "Line 1" content
            expect(table.rows[0].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({
                    segmentType: 'Text',
                    text: 'Line 1',
                })
            );

            // Second row, first cell should have "Line 2" content
            expect(table.rows[1].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({
                    segmentType: 'Text',
                    text: 'Line 2',
                })
            );

            // Third row, first cell should have "Line 3" content
            expect(table.rows[2].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({
                    segmentType: 'Text',
                    text: 'Line 3',
                })
            );

            // Second column cells should have empty content (Br)
            expect(table.rows[0].cells[1].blocks[0].segments[0].segmentType).toBe('Br');
            expect(table.rows[1].cells[1].blocks[0].segments[0].segmentType).toBe('Br');
            expect(table.rows[2].cells[1].blocks[0].segments[0].segmentType).toBe('Br');
        });

        it('should add extra rows when more selected paragraphs than requested rows', () => {
            // Arrange - 4 paragraphs selected but only 2 rows requested
            const selectedModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 3',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 4',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            // Setup the range selection mock
            setupRangeSelection(selectedModel);

            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 3',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Line 4',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act - insert 2x2 table but with 4 selected paragraphs
            insertTable(editor, 2, 2);

            // Assert - Should have 4 rows to accommodate all content
            expect(resultModel!.blocks[0].blockType).toBe('Table');
            const table = resultModel!.blocks[0] as any;
            expect(table.rows.length).toBe(4);

            // Verify all 4 lines are in the table
            expect(table.rows[0].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Line 1' })
            );
            expect(table.rows[1].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Line 2' })
            );
            expect(table.rows[2].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Line 3' })
            );
            expect(table.rows[3].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Line 4' })
            );
        });

        it('should insert table with selected list items into cells', () => {
            // Arrange - List items with selection
            const model: ContentModelDocument = {
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
                                        text: 'Item 1',
                                        format: {},
                                        isSelected: true,
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
                                        text: 'Item 2',
                                        format: {},
                                        isSelected: true,
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
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert - Table is inserted inside the first ListItem
            expect(resultModel!.blocks[0].blockType).toBe('BlockGroup');
            const firstListItem = resultModel!.blocks[0] as any;
            expect(firstListItem.blockGroupType).toBe('ListItem');

            // The table is inside the list item
            expect(firstListItem.blocks[0].blockType).toBe('Table');
            const table = firstListItem.blocks[0];

            // Table should have the expected structure
            expect(table.rows.length).toBe(2);
            expect(table.rows[0].cells.length).toBe(2);
        });

        it('should insert table with selected quote blocks into cells', () => {
            // Arrange - FormatContainer (blockquote) with selection
            // When selecting content inside FormatContainers, the table is inserted
            // inside the first FormatContainer
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
                                        text: 'Quote 1',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: {},
                            },
                        ],
                        format: {},
                    },
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
                                        text: 'Quote 2',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert - Table is inserted inside the first blockquote
            expect(resultModel!.blocks[0].blockType).toBe('BlockGroup');
            const firstBlockquote = resultModel!.blocks[0] as any;
            expect(firstBlockquote.blockGroupType).toBe('FormatContainer');
            expect(firstBlockquote.tagName).toBe('blockquote');

            // The table is inside the blockquote
            expect(firstBlockquote.blocks[0].blockType).toBe('Table');
            const table = firstBlockquote.blocks[0];

            // Table should have the expected structure
            expect(table.rows.length).toBe(2);
            expect(table.rows[0].cells.length).toBe(2);
        });

        it('should insert table with mixed selected content (paragraph and list)', () => {
            // Arrange - Mix of paragraph and list item
            const selectedModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Paragraph',
                                format: {},
                                isSelected: true,
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
                                        text: 'List Item',
                                        format: {},
                                        isSelected: true,
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
                    },
                ],
            };

            // Setup the range selection mock
            setupRangeSelection(selectedModel);

            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Paragraph',
                                format: {},
                                isSelected: true,
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
                                        text: 'List Item',
                                        format: {},
                                        isSelected: true,
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
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert
            expect(resultModel!.blocks[0].blockType).toBe('Table');
            const table = resultModel!.blocks[0] as any;

            // First row should have paragraph
            expect(table.rows[0].cells[0].blocks[0].blockType).toBe('Paragraph');
            expect(table.rows[0].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Paragraph' })
            );

            // Second row should have the whole list item
            expect(table.rows[1].cells[0].blocks[0].blockGroupType).toBe('ListItem');
        });

        it('should insert table with fewer selected items than rows', () => {
            // Arrange - Only 1 paragraph selected, but 3 rows requested
            const selectedModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Only one line',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            // Setup the range selection mock
            setupRangeSelection(selectedModel);

            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Only one line',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act - insert 2x3 table with only 1 selected paragraph
            insertTable(editor, 2, 3);

            // Assert
            expect(resultModel!.blocks[0].blockType).toBe('Table');
            const table = resultModel!.blocks[0] as any;

            // Should still have 3 rows as requested
            expect(table.rows.length).toBe(3);

            // First row should have the content
            expect(table.rows[0].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Only one line' })
            );

            // Other rows should have empty content
            expect(table.rows[1].cells[0].blocks[0].segments[0].segmentType).toBe('Br');
            expect(table.rows[2].cells[0].blocks[0].segments[0].segmentType).toBe('Br');
        });

        it('should preserve custom cell format when inserting content', () => {
            // Arrange
            const selectedModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Content 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Content 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            // Setup the range selection mock
            setupRangeSelection(selectedModel);

            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Content 1',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Content 2',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            };

            let resultModel: ContentModelDocument | null = null;

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                resultModel = model;
                return result;
            });

            // Act - insert table with custom cell format
            insertTable(editor, 2, 2, { verticalAlign: 'middle' }, undefined, {
                minWidth: '15px',
            });

            // Assert
            expect(resultModel!.blocks[0].blockType).toBe('Table');
            const table = resultModel!.blocks[0] as any;

            // Verify custom format is applied to all cells
            expect(table.rows[0].cells[0].format.minWidth).toBe('15px');
            expect(table.rows[0].cells[0].format.verticalAlign).toBe('middle');
            expect(table.rows[0].cells[1].format.minWidth).toBe('15px');
            expect(table.rows[1].cells[0].format.minWidth).toBe('15px');
            expect(table.rows[1].cells[1].format.minWidth).toBe('15px');

            // Verify content is preserved
            expect(table.rows[0].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Content 1' })
            );
            expect(table.rows[1].cells[0].blocks[0].segments).toContain(
                jasmine.objectContaining({ segmentType: 'Text', text: 'Content 2' })
            );
        });
    });
});
