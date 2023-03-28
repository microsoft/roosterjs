import { DocumentCommand } from 'roosterjs-editor-types';
import { RibbonButton } from 'roosterjs-react';

export type CopyButtonStringKey = 'buttonNameClipboard';

export const clipboard: RibbonButton<CopyButtonStringKey> = {
    key: 'buttonNameClipboard',
    unlocalizedText: 'Perform copy action',
    iconName: 'Clipboard',
    dropDownMenu: {
        items: {
            copy: 'Copy',
            cut: 'Cut',
            paste: 'Paste',
        },
    },
    onClick: (editor, key) => {
        const doc = editor.getDocument();
        let command: DocumentCommand;
        if (!doc) {
            return;
        }
        switch (<string>key) {
            case 'copy':
                command = DocumentCommand.Copy;
                break;
            case 'cut':
                command = DocumentCommand.Cut;
                break;
            case 'paste':
                command = DocumentCommand.Paste;
                break;
        }
        doc.execCommand(command);
    },
};
