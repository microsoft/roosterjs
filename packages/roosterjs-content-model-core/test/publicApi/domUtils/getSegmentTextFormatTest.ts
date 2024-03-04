import { createImage, createText } from 'roosterjs-content-model-dom';
import { getSegmentTextFormat } from '../../../lib/publicApi/domUtils/getSegmentTextFormat';

describe('getSegmentTextFormat', () => {
    it('get format from text segment', () => {
        const segment = createText('test', {
            fontFamily: 'Arial',
            fontSize: '12px',
            textColor: 'red',
            backgroundColor: 'blue',
            letterSpacing: '1px',
            lineHeight: '1.5',
        });
        expect(getSegmentTextFormat(segment)).toEqual({
            fontFamily: 'Arial',
            fontSize: '12px',
            textColor: 'red',
            backgroundColor: 'blue',
            letterSpacing: '1px',
            lineHeight: '1.5',
        });
    });

    it('get format from text segment with partial format', () => {
        const segment = createText('test', {
            fontFamily: 'Arial',
            backgroundColor: 'blue',
            letterSpacing: '1px',
        });
        expect(getSegmentTextFormat(segment)).toEqual({
            fontFamily: 'Arial',
            backgroundColor: 'blue',
            letterSpacing: '1px',
        });
    });

    it('get format from image', () => {
        const segment = createImage('test', {
            borderBottom: '1px solid red',
            boxShadow: '1px 1px 1px 1px red',
            fontFamily: 'Arial',
            backgroundColor: 'blue',
            letterSpacing: '1px',
        });
        expect(getSegmentTextFormat(segment)).toEqual({
            fontFamily: 'Arial',
            backgroundColor: 'blue',
            letterSpacing: '1px',
        });
    });
});
