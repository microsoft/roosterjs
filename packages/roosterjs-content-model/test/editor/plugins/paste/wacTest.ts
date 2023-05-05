import contentModelToDom from '../../../../lib/modelToDom/contentModelToDom';
import domToContentModel from '../../../../lib/domToModel/domToContentModel';
import { ContentModelDocument } from '../../../../lib/publicTypes';
import { createBeforePasteEventMock } from './wordDesktopTest';
import { handleWacComponentsPaste } from '../../../../lib/editor/plugins/PastePlugin/WacComponents/handleWacComponentsPaste';
import { moveChildNodes } from 'roosterjs-editor-dom';

describe('convertPastedContentForLi', () => {
    let div: HTMLElement;
    let fragment: DocumentFragment;

    function runTest(source?: string, expected?: string, expectedModel?: ContentModelDocument) {
        //Act
        if (source) {
            div = document.createElement('div');
            div.innerHTML = source;
            fragment = document.createDocumentFragment();
            moveChildNodes(fragment, div);
        }
        const event = createBeforePasteEventMock(fragment);
        handleWacComponentsPaste(event);

        const model = domToContentModel(
            fragment,
            {
                isDarkMode: false,
            },
            {
                ...event.domToModelOption,
                includeRoot: true,
            }
        );
        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }

        contentModelToDom(
            document,
            div,
            model,
            {
                isDarkMode: false,
            },
            {}
        );

        //Assert
        if (expected) {
            expect(div.innerHTML).toBe(expected);
        }
        div.parentElement?.removeChild(div);
    }

    it('Empty input', () => {
        runTest('', '');
    });

    it('Single text node', () => {
        runTest('test', 'test');
    });

    it('Empty DIV', () => {
        runTest('<div></div>', '<div></div>');
    });

    it('Single DIV', () => {
        runTest('<div>test</div>', '<div>test</div>');
    });

    it('Single DIV with nested elements', () => {
        runTest('<div><span>test</span></div>', '<div><span>test</span></div>');
    });

    it('Single DIV with child LI', () => {
        runTest('<div><li>1</li><li>2</li></div>', '<ul><li>1</li><li>2</li></ul>');
    });

    it('Single DIV with deeper child LI', () => {
        runTest(
            '<div><div><li>1</li></div><li>2</li></div>',
            '<div><div><li>1</li></div><li>2</li></div>'
        );
    });

    it('Single DIV with text and LI', () => {
        runTest('<div>test<li>1</li></div>', '<div>test<li>1</li></div>');
    });

    it('Single DIV with empty text and LI', () => {
        runTest('<div> <li>1</li> \n </div>', '<ul> <li>1</li> \n </ul>');
    });

    it('Single LI', () => {
        runTest('<li>1</li>', '<ul><li>1</li></ul>');
    });

    it('Single LI and text', () => {
        runTest('<li>1</li>test', '<li>1</li>test');
    });

    it('Single LI and empty text', () => {
        runTest(' <li>1</li> \n ', '<ul> <li>1</li> \n </ul>');
    });

    it('Multiple LI', () => {
        runTest('<li>1</li><li>2</li>', '<ul><li>1</li><li>2</li></ul>');
    });

    it('Multiple LI and text', () => {
        runTest('<li>1</li>test<li>2</li>', '<li>1</li>test<li>2</li>');
    });

    it('Multiple LI and empty text', () => {
        runTest(' <li>1</li> \n <li>2</li> ', '<ul> <li>1</li> \n <li>2</li> </ul>');
    });

    it('UL and LI', () => {
        runTest('<ul><li>test</li></ul>', '<ul><li>test</li></ul>');
    });

    it('OL and LI', () => {
        runTest('<ol><li>test</li></ol>', '<ol><li>test</li></ol>');
    });

    it('Single IMG', () => {
        runTest('<img>', '<img>');
    });
});
