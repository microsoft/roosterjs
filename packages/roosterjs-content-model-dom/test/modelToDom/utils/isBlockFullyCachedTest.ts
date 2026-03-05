import { isBlockFullyCached } from '../../../lib/modelToDom/utils/isBlockFullyCached';
import type { ContentModelBlock } from 'roosterjs-content-model-types';

describe('isBlockFullyCached', () => {
    describe('Paragraph', () => {
        it('returns false when no cachedElement', () => {
            const block: ContentModelBlock = {
                blockType: 'Paragraph',
                format: {},
                segments: [],
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns true when cachedElement and no segments', () => {
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Paragraph',
                format: {},
                segments: [],
                cachedElement: div,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });

        it('returns false when segment is selected', () => {
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Paragraph',
                format: {},
                segments: [{ segmentType: 'Text', text: 'hello', format: {}, isSelected: true }],
                cachedElement: div,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when segment is General type', () => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            const block: ContentModelBlock = {
                blockType: 'Paragraph',
                format: {},
                segments: [
                    {
                        segmentType: 'General',
                        element: span,
                        blockType: 'BlockGroup',
                        blockGroupType: 'General',
                        blocks: [],
                        format: {},
                    },
                ],
                cachedElement: div,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns true when cachedElement and unselected non-General segments', () => {
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Paragraph',
                format: {},
                segments: [
                    { segmentType: 'Text', text: 'hello', format: {} },
                    { segmentType: 'Br', format: {} },
                ],
                cachedElement: div,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });
    });

    describe('Divider', () => {
        it('returns false when no cachedElement', () => {
            const block: ContentModelBlock = {
                blockType: 'Divider',
                tagName: 'hr',
                format: {},
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns true when cachedElement and not selected', () => {
            const hr = document.createElement('hr');
            const block: ContentModelBlock = {
                blockType: 'Divider',
                tagName: 'hr',
                format: {},
                cachedElement: hr,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });

        it('returns false when selected', () => {
            const hr = document.createElement('hr');
            const block: ContentModelBlock = {
                blockType: 'Divider',
                tagName: 'hr',
                format: {},
                cachedElement: hr,
                isSelected: true,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });
    });

    describe('Entity', () => {
        it('always returns false', () => {
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Entity',
                segmentType: 'Entity',
                format: {},
                wrapper: div,
                entityFormat: { entityType: 'test', isReadonly: false },
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });
    });

    describe('Table', () => {
        it('returns false when no cachedElement', () => {
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [],
                rows: [],
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when a row has no cachedElement', () => {
            const table = document.createElement('table');
            const td = document.createElement('td');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                cachedElement: td,
                            },
                        ],
                        // No cachedElement on row
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when a cell has no cachedElement', () => {
            const table = document.createElement('table');
            const tr = document.createElement('tr');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cachedElement: tr,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                // No cachedElement on cell
                            },
                        ],
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when a cell is selected', () => {
            const table = document.createElement('table');
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cachedElement: tr,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                cachedElement: td,
                                isSelected: true,
                            },
                        ],
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when cell content is not fully cached', () => {
            const table = document.createElement('table');
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cachedElement: tr,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        segments: [], // No cachedElement
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                cachedElement: td,
                            },
                        ],
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns true when table has span cells (span cells have no cachedElement)', () => {
            const table = document.createElement('table');
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100, 100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cachedElement: tr,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        segments: [],
                                        cachedElement: div,
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                cachedElement: td,
                            },
                            {
                                // spanLeft cell: no DOM element, no cachedElement
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [],
                                spanAbove: false,
                                spanLeft: true,
                            },
                        ],
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });

        it('returns true when all rows, cells and paragraphs are cached', () => {
            const table = document.createElement('table');
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'Table',
                format: {},
                dataset: {},
                widths: [100],
                rows: [
                    {
                        format: {},
                        height: 20,
                        cachedElement: tr,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        segments: [],
                                        cachedElement: div,
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                cachedElement: td,
                            },
                        ],
                    },
                ],
                cachedElement: table,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });
    });

    describe('FormatContainer', () => {
        it('returns false when no cachedElement', () => {
            const block: ContentModelBlock = {
                blockType: 'BlockGroup',
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                format: {},
                blocks: [],
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when blocks is empty (vacuous truth guard)', () => {
            const bq = document.createElement('blockquote');
            const block: ContentModelBlock = {
                blockType: 'BlockGroup',
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                format: {},
                blocks: [],
                cachedElement: bq,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns false when a child block is not cached', () => {
            const bq = document.createElement('blockquote');
            const block: ContentModelBlock = {
                blockType: 'BlockGroup',
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                format: {},
                blocks: [{ blockType: 'Paragraph', format: {}, segments: [] }],
                cachedElement: bq,
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });

        it('returns true when cachedElement and all children are cached', () => {
            const bq = document.createElement('blockquote');
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'BlockGroup',
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                format: {},
                blocks: [
                    { blockType: 'Paragraph', format: {}, segments: [], cachedElement: div },
                ],
                cachedElement: bq,
            };
            expect(isBlockFullyCached(block)).toBe(true);
        });
    });

    describe('General block', () => {
        it('always returns false', () => {
            const div = document.createElement('div');
            const block: ContentModelBlock = {
                blockType: 'BlockGroup',
                blockGroupType: 'General',
                element: div,
                blocks: [],
                format: {},
            };
            expect(isBlockFullyCached(block)).toBe(false);
        });
    });
});
