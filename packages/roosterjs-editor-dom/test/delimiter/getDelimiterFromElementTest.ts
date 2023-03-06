import createElement from '../../lib/utils/createElement';
import getDelimiterFromElement from '../../lib/delimiter/getDelimiterFromElement';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

describe('getDelimiterFromElementTest', () => {
    afterEach(() => {
        document.body.childNodes.forEach(node => {
            document.body.removeChild(node);
        });
    });

    it('Is Delimiter', () => {
        const result = getDelimiterFromElement(createEl());

        expect(result).toBeTruthy();
    });

    it('No ZWS', () => {
        const result = getDelimiterFromElement(
            createEl(false /* changeTag */, false /* changeClass */, true /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('No Class', () => {
        const result = getDelimiterFromElement(
            createEl(false /* changeTag */, true /* changeClass */, false /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('No Span', () => {
        const result = getDelimiterFromElement(
            createEl(true /* changeTag */, false /* changeClass */, false /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('No Span & class', () => {
        const result = getDelimiterFromElement(
            createEl(true /* changeTag */, true /* changeClass */, false /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('No ZWS & class', () => {
        const result = getDelimiterFromElement(
            createEl(false /* changeTag */, true /* changeClass */, true /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('No ZWS & SPAN', () => {
        const result = getDelimiterFromElement(
            createEl(true /* changeTag */, false /* changeClass */, true /* changeChildren */)
        );

        expect(result).toBeNull();
    });

    it('Null', () => {
        const result = getDelimiterFromElement(null);

        expect(result).toBeNull();
    });
});

function createEl(
    changeTag: boolean = false,
    changeClass: boolean = false,
    changeChildren: boolean = false
) {
    return createElement(
        {
            tag: changeTag ? 'div' : 'span',
            className: changeClass ? '' : DelimiterClasses.DELIMITER_AFTER,
            children: changeChildren ? [] : [ZERO_WIDTH_SPACE],
        },
        document
    );
}
