import Editor from '../editor/Editor';
import { EntitySelector } from './EntityConstants';

export default function getEntityElement(editor: Editor, node: Node): HTMLElement {
    return node && editor.getElementAtCursor(EntitySelector, node);
}
