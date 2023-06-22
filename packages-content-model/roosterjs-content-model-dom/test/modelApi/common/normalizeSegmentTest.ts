import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import {
    createNormalizeSegmentContext,
    normalizeSegment,
} from '../../../lib/modelApi/common/normalizeSegment';

describe('normalizeSegment', () => {
    it('With initial context, image', () => {
        const context = createNormalizeSegmentContext();
        const image = createImage('test');

        normalizeSegment(image, context);

        expect(image).toEqual({
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        });

        expect(context).toEqual({
            textSegments: [],
            ignoreLeadingSpaces: false,
            ignoreTrailingSpaces: true,
            lastInlineSegment: image,
            lastTextSegment: undefined,
        });
    });

    it('With initial context, regular text', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('test');

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            text: 'test',
            format: {},
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: false,
            ignoreTrailingSpaces: true,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });

    it('With initial context, br', () => {
        const context = createNormalizeSegmentContext();
        const br = createBr();

        normalizeSegment(br, context);

        expect(br).toEqual({
            segmentType: 'Br',
            format: {},
        });

        expect(context).toEqual({
            textSegments: [],
            ignoreLeadingSpaces: true,
            ignoreTrailingSpaces: true,
            lastInlineSegment: undefined,
            lastTextSegment: undefined,
        });
    });

    it('Normalize an empty string', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('');

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            format: {},
            text: '',
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: false,
            ignoreTrailingSpaces: true,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });

    it('Normalize an string with spaces', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('   aa   ');

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            format: {},
            text: 'aa ',
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: true,
            ignoreTrailingSpaces: true,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });

    it('Normalize an string with &nbsp;', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('\u00A0\u00A0aa\u00A0\u00A0');

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            format: {},
            text: '\u00A0\u00A0aa\u00A0\u00A0',
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: false,
            ignoreTrailingSpaces: true,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });

    it('Normalize an string space and ignoreLeadingSpaces = false', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('  aa  ');

        context.ignoreLeadingSpaces = false;

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            format: {},
            text: '\u00A0aa ',
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: true,
            ignoreTrailingSpaces: true,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });

    it('Normalize an string space and ignoreTrailingSpaces = false', () => {
        const context = createNormalizeSegmentContext();
        const text = createText('  aa  ');

        context.ignoreTrailingSpaces = false;

        normalizeSegment(text, context);

        expect(text).toEqual({
            segmentType: 'Text',
            format: {},
            text: 'aa\u00A0',
        });

        expect(context).toEqual({
            textSegments: [text],
            ignoreLeadingSpaces: true,
            ignoreTrailingSpaces: false,
            lastInlineSegment: text,
            lastTextSegment: text,
        });
    });
});
