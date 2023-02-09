import { changeImage } from 'roosterjs-content-model';
import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';
import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';

const FileInput: CreateElementData = {
    tag: 'input',
    attributes: {
        type: 'file',
        accept: 'image/*',
        display: 'none',
    },
};

/**
 * @internal
 * "Change Image" button on the format ribbon
 */
export const changeImageButton: RibbonButton<'buttonNameChangeImage'> = {
    key: 'buttonNameChangeImage',
    unlocalizedText: 'Change Image',
    iconName: 'ImageSearch',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            const document = editor.getDocument();
            const fileInput = createElement(FileInput, document) as HTMLInputElement;
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', () => {
                if (fileInput.files) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        changeImage(editor, fileInput.files[i]);
                    }
                }
            });

            try {
                fileInput.click();
            } finally {
                document.body.removeChild(fileInput);
            }
        }
    },
};
