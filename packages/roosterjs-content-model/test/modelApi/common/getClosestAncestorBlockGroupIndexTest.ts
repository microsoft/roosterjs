import { getClosestAncestorBlockGroupIndex } from '../../../lib/modelApi/common/getClosestAncestorBlockGroupIndex';

describe('getClosestAncestorBlockGroupIndex', () => {
    it('Empty path', () => {
        const result = getClosestAncestorBlockGroupIndex([], ['ListItem']);
        expect(result).toBe(-1);
    });

    it('Path without expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['ListItem']
        );
        expect(result).toBe(-1);
    });

    it('Path with expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['Document']
        );
        expect(result).toBe(1);
    });

    it('Path with multiple expected values', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['Quote']
        );
        expect(result).toBe(0);
    });

    it('Multiple expected value types, path with expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['TableCell', 'Quote']
        );
        expect(result).toBe(0);
    });

    it('Path with expected value, with stop types after expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['Quote'],
            ['Document', 'ListItem']
        );
        expect(result).toBe(0);
    });

    it('Path with expected value, with stop types before expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'Quote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['Document'],
            ['ListItem', 'Quote']
        );
        expect(result).toBe(-1);
    });
});
