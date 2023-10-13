import type { IContentModelEditor } from '../publicTypes/IContentModelEditor';
import type { IEditor } from 'roosterjs-editor-types';

/**
 * Check if the given editor object is Content Model editor
 * @param editor The editor to check
 * @returns True if the given editor is Content Model editor, otherwise false
 */
export default function isContentModelEditor(editor: IEditor): editor is IContentModelEditor {
    const contentModelEditor = editor as IContentModelEditor;

    return !!contentModelEditor.createContentModel;
}
