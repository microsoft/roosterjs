import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelQuote } from '../../../lib/publicTypes/group/ContentModelQuote';
import {
    areAllOperationalBlocksOfGroupType,
    isBlockGroupOfType,
} from '../../../lib/modelApi/common/isBlockGroupOfType';

describe('isBlockGroupOfType', () => {
    it('null input', () => {
        const result = isBlockGroupOfType(null, 'Document');
        expect(result).toBeFalse();
    });

    it('Valid input', () => {
        const result = isBlockGroupOfType(
            {
                blockGroupType: 'Document',
            },
            'Document'
        );
        expect(result).toBeTrue();
    });

    it('Invalid input', () => {
        const result = isBlockGroupOfType(
            {
                blockGroupType: 'Quote',
            },
            'Document'
        );
        expect(result).toBeFalse();
    });
});

describe('areAllOperationalBlocksOfGroupType', () => {
    it('empty array', () => {
        const result = areAllOperationalBlocksOfGroupType<
            ContentModelDocument,
            ContentModelDocument
        >([], 'Document');

        expect(result).toBeTrue();
    });

    it('Partial valid 1', () => {
        const result = areAllOperationalBlocksOfGroupType<
            ContentModelDocument | ContentModelQuote,
            ContentModelDocument
        >(
            [
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    format: {},
                    quoteSegmentFormat: {},
                    blocks: [],
                },
            ],
            'Document'
        );

        expect(result).toBeFalse();
    });

    it('Partial valid 2', () => {
        const result = areAllOperationalBlocksOfGroupType<
            ContentModelDocument | ContentModelQuote,
            ContentModelDocument
        >(
            [
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
                {
                    paragraph: null,
                    path: [],
                    segments: [],
                },
            ],
            'Document'
        );

        expect(result).toBeFalse();
    });

    it('All valid', () => {
        const result = areAllOperationalBlocksOfGroupType<
            ContentModelDocument | ContentModelQuote,
            ContentModelDocument
        >(
            [
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
                {
                    blockGroupType: 'Document',
                    blocks: [],
                },
            ],
            'Document'
        );

        expect(result).toBeTrue();
    });
});
