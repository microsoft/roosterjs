import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';
import { insertImage } from 'roosterjs-content-model';
import { InsertImageButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';

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
 * "Insert image" button on the format ribbon
 */
export const insertImageButton: RibbonButton<InsertImageButtonStringKey> = {
    key: 'buttonNameInsertImage',
    unlocalizedText: 'Insert image',
    iconName: 'Photo2',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            const document = editor.getDocument();
            const fileInput = createElement(FileInput, document) as HTMLInputElement;
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', () => {
                if (fileInput.files) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        insertImage(editor, fileInput.files[i]);
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
