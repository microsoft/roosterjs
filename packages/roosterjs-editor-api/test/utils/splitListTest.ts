import * as TestHelper from '../TestHelper';
import splitList from 'roosterjs-editor-api/lib/utils/splitList';
import { IEditor, PositionType } from 'roosterjs-editor-types';
import { safeInstanceOf } from 'roosterjs-editor-dom/lib';

describe('splitListTest()', () => {
    const testID = 'processList';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('split List', () => {
        // Arrange
        const originalContent =
            '<div><ol id="OL"><li>item 1</li><li>item 2</li><li id="focusNode">item 3</li><li>item 4</li></ol></div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);
        const list = document.getElementById('OL');

        // Act
        if (safeInstanceOf(list, 'HTMLOListElement')) {
            splitList(editor, list);
        }

        // Assert
        expect(editor.getContent()).toBe(
            '<div><ol id="OL"><li>item 1</li><li>item 2</li></ol><ol start="1"><li id="focusNode">item 3</li><li>item 4</li></ol></div>'
        );
    });

    it('split deep level List', () => {
        // Arrange
        const originalContent =
            '<div><ol id="OL"><li>Item 1</li><ol style="list-style-type: lower-alpha;"><li>Upper Level Item 1</li><li>Upper Level Item 2</li><li id="focusNode">Upper Level Item 3</li><li>Upper Level Item 4</li></ol><li>Item 2</li><li>Item 3</li></ol></div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);
        const list = document.getElementById('OL');

        // Act
        if (safeInstanceOf(list, 'HTMLOListElement')) {
            splitList(editor, list);
        }

        // Assert
        expect(editor.getContent()).toBe(
            '<div><ol id="OL"><li>Item 1</li><ol style="list-style-type: lower-alpha;"><li>Upper Level Item 1</li><li>Upper Level Item 2</li></ol></ol><ol start="1"><ol style="list-style-type: lower-alpha;"><li id="focusNode">Upper Level Item 3</li><li>Upper Level Item 4</li></ol><li>Item 2</li><li>Item 3</li></ol></div>'
        );
    });

    it('split deep level List 2', () => {
        // Arrange
        const originalContent =
            '<div><ol id="OL"><li>1</li><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li>1</li><li>2</li><li id="focusNode">3</li><li>4</li></ol></ol></ol></div>';

        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);
        const list = document.getElementById('OL');

        // Act
        if (safeInstanceOf(list, 'HTMLOListElement')) {
            splitList(editor, list, 1);
        }

        // Assert
        expect(editor.getContent()).toBe(
            '<div><ol id="OL"><li>1</li><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li>1</li><li>2</li></ol></ol></ol><ol start="1"><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li id="focusNode">3</li><li>4</li></ol></ol></ol></div>'
        );
    });
});
