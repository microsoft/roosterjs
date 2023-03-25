import { isBlockGroupOfType } from '../../../lib/modelApi/common/isBlockGroupOfType';

describe('isBlockGroupOfType', () => {
    it('null input', () => {
        const result = isBlockGroupOfType(null, 'Document');
        expect(result).toBeFalse();
    });

    it('Valid input', () => {
        const result = isBlockGroupOfType(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            'Document'
        );
        expect(result).toBeTrue();
    });

    it('Invalid input', () => {
        const result = isBlockGroupOfType(
            {
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                blockType: 'BlockGroup',
                blocks: [],
                format: {},
            },
            'Document'
        );
        expect(result).toBeFalse();
    });
});
