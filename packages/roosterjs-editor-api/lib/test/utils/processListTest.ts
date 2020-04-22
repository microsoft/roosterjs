import * as TestHelper from '../TestHelper';
import processList from '../../utils/processList';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

describe('processList()', () => {
    const testID = 'processList';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('properly outdents, preserving the span', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li><li><span style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"><img id="focus helper" /><br></span></li></ul></div>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li></ul><span style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"><br></span></div>'
        );
    });

    it('properly outdents from the middle, preserving the span.', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li><li><span style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"><img id="focus helper" /><br></span></li><li>test</li></ul></div>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li></ul><span style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"><br></span><ul><li>test</li></ul></div>'
        );
    });

    it('properly outdents when default format is applied', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li><li>test</li><li><img id="focus helper" /><br></li></ul></div>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li><li>test</li></ul><br></div>'
        );
    });

    it('properly outdents from the middle when default format is applied', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li><li><img id="focus helper" /><br></li><li>test</li></ul></div>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div><div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><ul><li>test</li></ul><br><ul><li>test</li></ul></div>'
        );
    });
});
