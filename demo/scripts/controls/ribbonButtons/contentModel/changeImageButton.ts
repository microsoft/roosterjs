import ContentModelRibbonButton from './ContentModelRibbonButton';
import { changeImage } from 'roosterjs-content-model-editor';
import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';

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
export const changeImageButton: ContentModelRibbonButton<'buttonNameChangeImage'> = {
    key: 'buttonNameChangeImage',
    unlocalizedText: 'Change Image',
    iconName: 'ImageSearch',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
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
    },
};
