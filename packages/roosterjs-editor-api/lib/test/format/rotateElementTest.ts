import * as TestHelper from '../TestHelper';
import { Editor } from 'roosterjs-editor-core';
import { rotateElement } from 'roosterjs/lib';

describe('rotateElement()', () => {
    let testID = 'rotateElement';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('sets the rotation to 90 degrees of the element', () => {
        // Arrange
        const imageId = 'imageId';
        const imageContent = `<img id="${imageId}"/></img>`;
        editor.setContent(imageContent);
        const image = document.getElementById(imageId) as HTMLImageElement;

        // Act
        rotateElement(editor, image, 90);

        // Assert
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(editor.getContent()).toBe(
            `<img id="${imageId}" style="transform: rotate(90deg);">`
        );
    });

    it('skips setting the rotation if the element does not exist', () => {
        // Arrange
        const blankEditorContent = '<div></div>';
        editor.setContent(blankEditorContent);
        const element = document.getElementById('non-existentID') as HTMLImageElement;

        // Act
        rotateElement(editor, element, 90);

        // Assert
        expect(editor.addUndoSnapshot).not.toHaveBeenCalled();
        expect(editor.getContent()).toBe(blankEditorContent);
    });
});
