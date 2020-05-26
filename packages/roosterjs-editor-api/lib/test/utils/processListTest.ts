import * as TestHelper from '../TestHelper';
import processList from '../../utils/processList';
import { DocumentCommand, PositionType } from 'roosterjs-editor-types';
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
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
            '<ul><li>test</li><li><span id="focusNode" style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"></span></li></ul>' +
            '</div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
                '<ul><li>test</li></ul>' +
                '<div><span id="focusNode" style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"></span></div>' +
                '</div>'
        );
    });

    it('properly outdents from the middle, preserving the span.', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
            '<ul><li>test</li><li><span id="focusNode" style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"></span></li><li>test</li></ul>' +
            '</div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
                '<ul><li>test</li></ul>' +
                '<div><span id="focusNode" style="font-family: &quot;Courier New&quot;; font-size: 20pt; color: rgb(208, 92, 18);"></span></div><ul><li>test</li></ul>' +
                '</div>'
        );
    });

    it('properly outdents when default format is applied', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
            '<ul><li>test</li><li>test</li><li id="focusNode"><br></li></ul>' +
            '</div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
                '<ul><li>test</li><li>test</li></ul>' +
                '<div><br></div>' +
                '</div>'
        );
    });

    it('properly outdents from the middle when default format is applied', () => {
        // Arrange
        const originalContent =
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
            '<ul><li>test</li><li id="focusNode"><br></li><li>test</li></ul>' +
            '</div>';
        editor.setContent(originalContent);
        editor.focus();
        editor.select(document.getElementById('focusNode'), PositionType.Begin);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">default format</div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);"><br></div>' +
                '<div style="font-family: Arial; font-size: 16pt; color: rgb(0, 111, 201);">' +
                '<ul><li>test</li></ul>' +
                '<div><br></div>' +
                '<ul><li>test</li></ul>' +
                '</div>'
        );
    });
});
