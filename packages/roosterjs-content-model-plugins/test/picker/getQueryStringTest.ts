import { getQueryString } from '../../lib/picker/getQueryString';
import type {
    ContentModelBr,
    ContentModelParagraph,
    ContentModelText,
} from 'roosterjs-content-model-types';

describe('getQueryString', () => {
    it('paragraph with empty text segment', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: '',
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [segment],
        };
        const splittedResult: ContentModelText[] = [];

        const result = getQueryString('@', paragraph, segment, splittedResult);

        expect(result).toBe('');
        expect(splittedResult).toEqual([segment]);
    });

    it('paragraph with text segment, no trigger char', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test',
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [segment],
        };
        const splittedResult: ContentModelText[] = [];

        const result = getQueryString('@', paragraph, segment, splittedResult);

        expect(result).toBe('');
        expect(splittedResult).toEqual([segment]);
    });

    it('paragraph with multiple text segments, no trigger char', () => {
        const segment1: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test1',
        };
        const segment2: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test2',
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment2],
        };
        const splittedResult: ContentModelText[] = [];

        const result = getQueryString('@', paragraph, segment2, splittedResult);

        expect(result).toBe('');
        expect(splittedResult).toEqual([segment1, segment2]);
    });

    it('paragraph with multiple text segments, has trigger char', () => {
        const segment1: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'te@st1',
        };
        const segment2: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test2',
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment2],
        };
        const splittedResult: ContentModelText[] = [];

        const result = getQueryString('@', paragraph, segment2, splittedResult);

        expect(result).toBe('@st1test2');
        expect(splittedResult).toEqual([
            {
                segmentType: 'Text',
                format: {},
                text: '@st1',
                isSelected: undefined,
            },
            segment2,
        ]);
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    format: {},
                    text: 'te',
                    isSelected: undefined,
                },
                {
                    segmentType: 'Text',
                    format: {},
                    text: '@st1',
                    isSelected: undefined,
                },
                {
                    segmentType: 'Text',
                    format: {},
                    text: 'test2',
                },
            ],
        });
    });

    it('paragraph with multiple text segments, has other type of segment after trigger', () => {
        const segment1: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'te@st1',
        };
        const segment2: ContentModelText = {
            segmentType: 'Text',
            format: {},
            text: 'test2',
        };
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, br, segment2],
        };
        const splittedResult: ContentModelText[] = [];

        const result = getQueryString('@', paragraph, segment2, splittedResult);

        expect(result).toBe('');
        expect(splittedResult).toEqual([segment2]);
    });
});
