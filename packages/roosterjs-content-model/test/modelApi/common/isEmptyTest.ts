import { isEmpty } from '../../../lib/modelApi/common/isEmpty';

describe('isEmpty', () => {
    it('Empty paragraph', () => {
        const result = isEmpty({
            blockType: 'Paragraph',
            format: {},
            segments: [],
        });

        expect(result).toBeTrue();
    });

    it('Paragraph has text', () => {
        const result = isEmpty({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    format: {},
                    text: 'test',
                },
            ],
        });

        expect(result).toBeFalse();
    });

    it('Paragraph has selection marker', () => {
        const result = isEmpty({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
            ],
        });

        expect(result).toBeFalse();
    });

    it('Empty table 1', () => {
        const result = isEmpty({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });

        expect(result).toBeTrue();
    });

    it('Empty table 2', () => {
        const result = isEmpty({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [] },
                { format: {}, height: 0, cells: [] },
                { format: {}, height: 0, cells: [] },
            ],
            widths: [],
            dataset: {},
        });

        expect(result).toBeTrue();
    });

    it('Table has cell', () => {
        const result = isEmpty({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            format: {},
                            spanAbove: false,
                            spanLeft: false,
                            blocks: [],
                            dataset: {},
                        },
                    ],
                },
            ],
            widths: [],
            dataset: {},
        });

        expect(result).toBeFalse();
    });

    it('Empty quote', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            format: {},
            blocks: [],
        });

        expect(result).toBeTrue();
    });

    it('Quote has empty block', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'blockquote',
            format: {},
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result).toBeTrue();
    });

    it('FormatContainer with DIV', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'div',
            format: {},
            blocks: [],
        });

        expect(result).toBeFalse();
    });

    it('Empty list item', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            format: {},
            blocks: [],
            levels: [],
            formatHolder: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
        });

        expect(result).toBeTrue();
    });

    it('List item has empty block', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            format: {},
            levels: [],
            formatHolder: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result).toBeTrue();
    });

    it('Empty general node', () => {
        const result = isEmpty({
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: document.createElement('div'),
            format: {},
            blocks: [],
        });

        expect(result).toBeFalse();
    });

    it('Empty entity node', () => {
        const result = isEmpty({
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            type: 'Test',
            id: 'Test',
            wrapper: document.createElement('div'),
            isReadonly: false,
        });

        expect(result).toBeFalse();
    });

    it('Empty document', () => {
        const result = isEmpty({
            blockGroupType: 'Document',

            blocks: [],
        });

        expect(result).toBeFalse();
    });

    it('Document with empty block', () => {
        const result = isEmpty({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result).toBeFalse();
    });

    it('Document with content', () => {
        const result = isEmpty({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });

        expect(result).toBeFalse();
    });

    it('Empty table cell', () => {
        const result = isEmpty({
            blockGroupType: 'TableCell',
            format: {},
            spanAbove: false,
            spanLeft: false,
            blocks: [],
            dataset: {},
        });

        expect(result).toBeFalse();
    });

    it('Empty text', () => {
        const result = isEmpty({
            segmentType: 'Text',
            format: {},
            text: '',
        });

        expect(result).toBeTrue();
    });

    it('Text has only spaces', () => {
        const result = isEmpty({
            segmentType: 'Text',
            format: {},
            text: ' \t \r \n ',
        });

        expect(result).toBeFalse();
    });

    it('Text has content', () => {
        const result = isEmpty({
            segmentType: 'Text',
            format: {},
            text: '  aa  ',
        });

        expect(result).toBeFalse();
    });

    it('Text has content and CR', () => {
        const result = isEmpty({
            segmentType: 'Text',
            format: {},
            text: '  aa  \r\n  bb  ',
        });

        expect(result).toBeFalse();
    });

    it('Selection marker', () => {
        const result = isEmpty({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        });

        expect(result).toBeFalse();
    });

    it('Br', () => {
        const result = isEmpty({
            segmentType: 'Br',
            format: {},
            isSelected: true,
        });

        expect(result).toBeFalse();
    });
});
