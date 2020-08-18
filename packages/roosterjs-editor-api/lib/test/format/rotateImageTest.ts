import * as TestHelper from '../TestHelper';
import { Editor } from 'roosterjs-editor-core';
import { rotateImage } from 'roosterjs/lib';

describe('rotateImage()', () => {
    let testID = 'rotateImage';
    let editor: Editor;
    const imageId = 'imageId';

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('sets the rotation to 90 degrees', () => {
        // Arrange
        const imageContent = `<img id="${imageId}"/></img>`;
        editor.setContent(imageContent);
        const image = document.getElementById(imageId) as HTMLImageElement;

        // Act
        rotateImage(editor, image, 90);

        // Assert
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(editor.getContent()).toBe(
            `<img id="${imageId}" style="transform: rotate(90deg);">`
        );
    });

    it('skips setting the rotation if the image does not exist', () => {
        // Arrange
        const blankEditorContent = '<div></div>';
        editor.setContent(blankEditorContent);
        const image = document.getElementById(imageId) as HTMLImageElement;

        // Act
        rotateImage(editor, image, 90);

        // Assert
        expect(editor.addUndoSnapshot).not.toHaveBeenCalled();
        expect(editor.getContent()).toBe(blankEditorContent);
    });
});
