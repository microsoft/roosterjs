import { changeImage } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../roosterjsReact/ribbon';

function createInput(doc: Document): HTMLInputElement {
    const input = doc.createElement('input');

    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('display', 'none');

    return input;
}

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
        const document = editor.getDocument();
        const fileInput = createInput(document) as HTMLInputElement;
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
