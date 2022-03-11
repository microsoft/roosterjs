import RibbonButton from '../../type/RibbonButton';
import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';
import { insertImage as insertImageApi } from 'roosterjs-editor-api';

const FileInput: CreateElementData = {
    tag: 'input',
    attributes: {
        type: 'file',
        accept: 'image/*',
        display: 'none',
    },
};

/**
 * Key of localized strings of Insert image button
 */
export type InsertImageButtonStringKey = 'buttonNameInsertImage';

/**
 * "Insert image" button on the format ribbon
 */
export const insertImage: RibbonButton<InsertImageButtonStringKey> = {
    key: 'buttonNameInsertImage',
    unlocalizedText: 'Insert image',
    iconName: 'Photo2',
    onClick: editor => {
        const document = editor.getDocument();
        const fileInput = createElement(FileInput, document) as HTMLInputElement;
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', () => {
            for (let i = 0; i < fileInput.files.length; i++) {
                insertImageApi(editor, fileInput.files[i]);
            }
        });

        try {
            fileInput.click();
        } finally {
            document.body.removeChild(fileInput);
        }
    },
};
