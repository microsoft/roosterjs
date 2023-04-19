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
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
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
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
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
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                },
                {
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['FormatContainer']
        );
        expect(result).toBe(0);
    });

    it('Multiple expected value types, path with expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['TableCell', 'FormatContainer']
        );
        expect(result).toBe(0);
    });

    it('Path with expected value, with stop types after expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['FormatContainer'],
            ['Document', 'ListItem']
        );
        expect(result).toBe(0);
    });

    it('Path with expected value, with stop types before expected value', () => {
        const result = getClosestAncestorBlockGroupIndex(
            [
                {
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    blocks: [],
                    format: {},
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            ['Document'],
            ['ListItem', 'FormatContainer']
        );
        expect(result).toBe(-1);
    });
});
