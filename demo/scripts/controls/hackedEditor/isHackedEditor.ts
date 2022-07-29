import HackedEditor from './HackedEditor';
import { IEditor } from 'roosterjs-editor-types';

export function isHackedEditor(editor: IEditor | null): editor is HackedEditor {
    return editor && !!(<HackedEditor>editor).getContentModel;
}
