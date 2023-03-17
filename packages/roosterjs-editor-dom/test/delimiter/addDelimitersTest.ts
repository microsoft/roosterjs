import addDelimiters from '../../lib/delimiter/addDelimiters';
import { DelimiterClasses } from 'roosterjs-editor-types';

describe('addDelimitersTest', () => {
    afterAll(() => {
        document.body.childNodes.forEach(node => {
            document.body.removeChild(node);
        });
    });

    it('Add', () => {
        const element = document.createElement('span');
        document.body.append(element);

        const [after, before] = addDelimiters(element);

        expect(element.nextElementSibling).toBeDefined();
        expect(element.nextElementSibling?.className).toEqual(DelimiterClasses.DELIMITER_AFTER);
        expect(element.previousElementSibling).toBeDefined();
        expect(element.previousElementSibling?.className).toEqual(
            DelimiterClasses.DELIMITER_BEFORE
        );
        expect(after.outerHTML).toBe('<span class="entityDelimiterAfter">​</span>');
        expect(before.outerHTML).toBe('<span class="entityDelimiterBefore">​</span>');
    });

    it('Add between other Entity with delimiters', () => {
        const element1 = document.createElement('span');
        const element2 = document.createElement('span');
        const element3 = document.createElement('span');
        document.body.append(element1);
        document.body.append(element2);
        document.body.append(element3);

        addDelimiters(element1);
        addDelimiters(element3);
        addDelimiters(element2);

        [element1, element2, element3].forEach(element => {
            expect(element.nextElementSibling).toBeDefined();
            expect(element.nextElementSibling?.className).toEqual(DelimiterClasses.DELIMITER_AFTER);
            expect(element.previousElementSibling).toBeDefined();
            expect(element.previousElementSibling?.className).toEqual(
                DelimiterClasses.DELIMITER_BEFORE
            );
        });
    });
});
