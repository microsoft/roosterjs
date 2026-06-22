import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { normalizeSingleSegment } from '../../../lib/modelApi/common/normalizeSegment';
import { ReadonlyContentModelParagraph } from 'roosterjs-content-model-types';

describe('normalizeSingleSegment', () => {
    it('should ignore leading spaces when no previous segment', () => {
        const para = createParagraph();
        const text = createText('  hello');

        para.segments.push(text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe('hello');
    });

    it('should keep leading space when previous text does not end with space', () => {
        const para = createParagraph();
        const prev = createText('world');
        const text = createText('  hello');

        para.segments.push(prev, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe(' hello');
    });

    it('should ignore leading spaces when previous text ends with space', () => {
        const para = createParagraph();
        const prev = createText('world ');
        const text = createText('  hello');

        para.segments.push(prev, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe('hello');
    });

    it('should skip SelectionMarker when searching for previous text', () => {
        const para = createParagraph();
        const prev = createText('world');
        const marker = createSelectionMarker();
        const text = createText('  hello');

        para.segments.push(prev, marker, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe(' hello');
    });

    it('should skip empty text segments when searching for previous text', () => {
        const para = createParagraph();
        const prev = createText('world');
        const empty = createText('');
        const text = createText('  hello');

        para.segments.push(prev, empty, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        // Empty text is skipped, prev "world" is found (doesn't end with space) => keep leading space
        expect(text.text).toBe(' hello');
    });

    it('should not look past non-text non-marker segments', () => {
        const para = createParagraph();
        const prev = createText('world');
        const image = createImage('img');
        const text = createText('  hello');

        para.segments.push(prev, image, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        // Image breaks the backward search, no prev text found => ignoreLeadingSpaces stays true
        expect(text.text).toBe('hello');
    });

    it('should handle ignoreTrailingSpaces parameter', () => {
        const para = createParagraph();
        const text = createText('hello   ');

        para.segments.push(text);

        normalizeSingleSegment(
            para as ReadonlyContentModelParagraph,
            text,
            true /*ignoreTrailingSpaces*/
        );

        expect(text.text).toBe('hello ');
    });

    it('should handle text with no leading or trailing spaces', () => {
        const para = createParagraph();
        const text = createText('hello');

        para.segments.push(text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe('hello');
    });

    it('should skip empty text segment without error', () => {
        const para = createParagraph();
        const empty = createText('');

        para.segments.push(empty);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, empty);

        expect(empty.text).toBe('');
    });

    it('should handle segment in middle with prev ending in non-space and next text', () => {
        const para = createParagraph();
        const prev = createText('before');
        const text = createText('  middle  ');
        const next = createText('after');

        para.segments.push(prev, text, next);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        // prev doesn't end with space => ignoreLeadingSpaces = false => leading spaces become single space
        // ignoreTrailingSpaces defaults to false => trailing spaces become nbsp
        expect(text.text).toBe(' middle\u00A0');
    });

    it('should handle multiple SelectionMarkers between prev text and current', () => {
        const para = createParagraph();
        const prev = createText('abc');
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();
        const text = createText('  def');

        para.segments.push(prev, marker1, marker2, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe(' def');
    });

    it('should ignore leading spaces when prev text ends with space after skipping markers', () => {
        const para = createParagraph();
        const prev = createText('abc ');
        const marker = createSelectionMarker();
        const text = createText('  def');

        para.segments.push(prev, marker, text);

        normalizeSingleSegment(para as ReadonlyContentModelParagraph, text);

        expect(text.text).toBe('def');
    });
});
