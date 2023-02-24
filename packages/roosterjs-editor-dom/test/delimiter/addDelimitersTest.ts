import addDelimiters from '../../lib/delimiter/addDelimiters';
import { DelimiterClasses } from 'roosterjs-editor-types';

describe('addDelimiterstest', () => {
    afterAll(() => {
        document.body.childNodes.forEach(node => {
            document.body.removeChild(node);
        });
    });

    it('Add', () => {
        const element = document.createElement('span');
        document.body.append(element);

        addDelimiters(element);

        expect(element.nextElementSibling).toBeDefined();
        expect(element.nextElementSibling?.className).toEqual(DelimiterClasses.DELIMITER_AFTER);
        expect(element.previousElementSibling).toBeDefined();
        expect(element.previousElementSibling?.className).toEqual(
            DelimiterClasses.DELIMITER_BEFORE
        );
    });
});
