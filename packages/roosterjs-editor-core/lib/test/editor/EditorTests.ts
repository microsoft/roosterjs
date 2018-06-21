import Editor from '../../editor/Editor';
import * as TestHelper from '../TestHelper';
import { ContentPosition } from 'roosterjs-editor-types';
import * as getSelectionRange from '../../coreAPI/getSelectionRange';

let editor: Editor;
let testID = 'EditorTest';

describe('Editor getSelectionRange()', () => {
    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('getSelectionRange should invoke getSelectionRange in Selection if in foucs', () => {
        // Arrange
        editor.focus();

        // Act
        let range = editor.getSelectionRange();

        // Assert
        expect(range.startContainer).not.toBeNull();
    });

    it('getSelectionRange shold return null if not in focus', () => {
        // Arrange
        spyOn(getSelectionRange, 'default').and.callThrough();

        // Act
        let selectionRange = editor.getSelectionRange();

        // Assert
        expect(selectionRange).toBeNull();
    });
});

describe('Editor setContent()', () => {
    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('setContent with text', () => {
        // Act
        editor.setContent('hello roosterjs');

        // Assert
        expect(editor.getContent()).toBe('hello roosterjs');
    });

    it('setContent with HTML', () => {
        // Act
        editor.setContent('<div>hello roosterjs</div>');

        // Assert
        expect(editor.getContent()).toBe('<div>hello roosterjs</div>');
    });
});

describe('Editor insertContent()', () => {
    let originalContent = '<div id="text">text</div>';

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.setContent(originalContent);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('insert begin', () => {
        // Act
        editor.insertContent('hello', {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="text">hellotext</div>');
    });

    it('insert end', () => {
        // Act
        editor.insertContent('hello', {
            position: ContentPosition.End,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="text">texthello</div>');
    });

    it('insert selection, replace selection', () => {
        // Arrange
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        editor.insertContent('hello', {
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('hello');
    });

    it('insert selection, not replace selection', () => {
        // Arrange
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        editor.insertContent('hello', {
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: false,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('hello<div id="text">text</div>');
    });
});

describe('Editor insertNode()', () => {
    let originalContent = '<div id="text">text</div>';
    let node = TestHelper.createElementFromContent('testNode', 'abc');

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.setContent(originalContent);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('insert begin', () => {
        // Act
        editor.insertNode(node, {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="text"><div id="testNode">abc</div>text</div>');
    });

    it('insert end', () => {
        // Act
        editor.insertNode(node, {
            position: ContentPosition.End,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="text">text<div id="testNode">abc</div></div>');
    });

    it('insert selection, replace selection', () => {
        // Arrange
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        editor.insertNode(node, {
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="testNode">abc</div>');
    });

    it('insert selection, not replace selection', () => {
        // Arrange
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        editor.insertNode(node, {
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: false,
            insertOnNewLine: false,
        });

        // Assert
        expect(editor.getContent()).toBe('<div id="testNode">abc</div><div id="text">text</div>');
    });
});

describe('Editor deleteNode()', () => {
    let originalContent = '<p id="first">abc</p><p id="second">123</p>';

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.setContent(originalContent);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('delete first node', () => {
        // Arrange
        let node = document.getElementById('first');

        // Act
        editor.deleteNode(node);

        // Assert
        expect(editor.getContent()).toBe('<p id="second">123</p>');
    });

    it('delete second node', () => {
        // Arrange
        let node = document.getElementById('second');

        // Act
        editor.deleteNode(node);

        // Assert
        expect(editor.getContent()).toBe('<p id="first">abc</p>');
    });
});

describe('Editor replaceNode()', () => {
    let originalContent = '<p id="first">abc</p><p id="second">123</p>';
    let node = TestHelper.createElementFromContent('replace', 'hello');

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.setContent(originalContent);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('replace first node', () => {
        // Arrange
        let firstNode = document.getElementById('first');

        // Act
        editor.replaceNode(firstNode, node);

        // Assert
        expect(editor.getContent()).toBe('<div id="replace">hello</div><p id="second">123</p>');
    });

    it('replace second node', () => {
        // Arrange
        let secondNode = document.getElementById('second');

        // Act
        editor.replaceNode(secondNode, node);

        // Assert
        expect(editor.getContent()).toBe('<p id="first">abc</p><div id="replace">hello</div>');
    });
});

describe('Editor getInlineElementAtNode()', () => {
    let rootNode = TestHelper.createElementFromContent('testNode', '<p>abc</p><p>123</p>');

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.insertNode(rootNode, {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('inlineElement = abc', () => {
        // Act
        let inlineElement = editor.getInlineElementAtNode(rootNode.firstChild);

        // Assert
        expect(inlineElement.getTextContent()).toBe('abc');
    });

    it('inlineElement = 123', () => {
        // Act
        let inlineElement = editor.getInlineElementAtNode(rootNode.lastChild);

        // Assert
        expect(inlineElement.getTextContent()).toBe('123');
    });
});

describe('Editor updateSelection()', () => {
    let node = TestHelper.createElementFromContent('testNode', '<p>abc</p><p>123</p>');

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.insertNode(node, {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('SelectionRange should be updated', () => {
        // Arrange
        let selectionRange = TestHelper.createRangeWithDiv(node.firstChild as HTMLElement);

        // Act
        editor.updateSelection(selectionRange);

        // Assert
        expect(editor.getSelectionRange()).toBe(selectionRange);
    });
});

describe('Editor queryContent()', () => {
    let node = TestHelper.createElementFromContent(
        'testNode',
        '<p class="myClass">abc</p><p class="myClass">123</p><p class="otherClass">456</p>'
    );

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.insertNode(node, {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('select myClass', () => {
        // Act
        let nodeList = editor.queryContent('.myClass');

        // Assert
        expect(nodeList.length).toBe(2);
        expect(nodeList[0]).toBe(node.firstChild as HTMLElement);
        expect(nodeList[1]).toBe(node.firstChild.nextSibling as HTMLElement);
    });

    it('select otherClass', () => {
        // Act
        let nodeList = editor.queryContent('.otherClass');

        // Assert
        expect(nodeList.length).toBe(1);
        expect(nodeList[0]).toBe(node.lastChild as HTMLElement);
    });
});

describe('Editor contains()', () => {
    let rootNode = TestHelper.createElementFromContent('testNode', '<p>abc</p>');

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        editor.insertNode(rootNode, {
            position: ContentPosition.Begin,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        });
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('Editor contains node', () => {
        // Act
        let containsNode = editor.contains(rootNode);

        // Assert
        expect(containsNode).toBe(true);
    });

    it('Editor does not contain node', () => {
        // Arrange
        let otherNode = TestHelper.createElementFromContent('testNode', 'hello');

        // Act
        let containsNode = editor.contains(otherNode);

        // Assert
        expect(containsNode).toBe(false);
    });
});
