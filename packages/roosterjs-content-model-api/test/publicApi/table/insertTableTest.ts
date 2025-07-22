import { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';
import { insertTable } from '../../../lib/publicApi/table/insertTable';

describe('insertTable', () => {
    let editor: IEditor;
    let focusSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;

    beforeEach(() => {
        focusSpy = jasmine.createSpy('focus');
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');

        editor = {
            focus: focusSpy,
            formatContentModel: formatContentModelSpy,
            getPendingFormat: getPendingFormatSpy,
        } as any;
    });

    describe('insertTable with valid selection', () => {
        it('should insert a 2x2 table with default format', () => {
            // Arrange
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [],
            };

            formatContentModelSpy.and.callFake((callback: any) => {
                const result = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                expect(result).toBe(true);
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert
            expect(focusSpy).toHaveBeenCalled();
            expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.any(Function), {
                apiName: 'insertTable',
            });
        });

        it('should insert a table with custom format', () => {
            // Arrange
            const customFormat = {
                verticalAlign: 'middle' as const,
                borderCollapse: true,
            };

            formatContentModelSpy.and.callFake((callback: any) => {
                const model: ContentModelDocument = {
                    blockGroupType: 'Document',
                    blocks: [],
                };
                return callback(model, {});
            });

            // Act
            insertTable(editor, 3, 4, customFormat);

            // Assert
            expect(formatContentModelSpy).toHaveBeenCalled();
        });
    });

    describe('insertTable with no valid selection', () => {
        it('should return false when no insert position is available', () => {
            // Arrange
            formatContentModelSpy.and.callFake((callback: any) => {
                const model: ContentModelDocument = {
                    blockGroupType: 'Document',
                    blocks: [],
                };
                const result = callback(model, {});
                expect(result).toBe(false);
                return result;
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert
            expect(formatContentModelSpy).toHaveBeenCalled();
        });
    });

    describe('insertTable with pending format', () => {
        it('should apply pending format to table cells', () => {
            // Arrange
            const pendingFormat = {
                fontFamily: 'Arial',
                fontSize: '14px',
            };
            getPendingFormatSpy.and.returnValue(pendingFormat);

            formatContentModelSpy.and.callFake((callback: any) => {
                const model: ContentModelDocument = {
                    blockGroupType: 'Document',
                    blocks: [],
                };
                return callback(model, {});
            });

            // Act
            insertTable(editor, 2, 2);

            // Assert
            expect(getPendingFormatSpy).toHaveBeenCalled();
        });
    });

    // ...existing code...

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
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
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
                        rows: jasmine.any(Array), // 3 rows with 3 cells each
                        format: {
                            marginRight: '80px',
                        },
                        widths: jasmine.any(Array),
                        dataset: jasmine.any(Object),
                    },
                ],
            });
        });
    });
});
