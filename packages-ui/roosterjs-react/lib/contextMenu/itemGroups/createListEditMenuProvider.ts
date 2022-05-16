import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import { EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { setOrderedListNumbering } from 'roosterjs-editor-api';
import {
    ListNumberEditMenuItemStringKey,
    ListNumberResetMenuItemStringKey,
} from '../types/ContextMenuItemStringKeys';

const ListNumberResetMenuItem: ContextMenuItem<ListNumberResetMenuItemStringKey> = {
    key: 'menuNameListNumberReset',
    unlocalizedText: 'Restart at 1',
    onClick: (editor, node) => {
        const li = editor.getElementAtCursor('LI', node) as HTMLLIElement;
        setOrderedListNumbering(editor, li, 1);
    },
};

const ListNumberEditMenuItem: ContextMenuItem<ListNumberEditMenuItemStringKey> = {
    key: 'menuNameListNumberEdit',
    unlocalizedText: 'Set numbering value',
    onClick: () => {},
};

function shouldShowListEditItems(editor: IEditor, node: Node) {
    const li = editor.getElementAtCursor('LI', node);
    const list = li && editor.getElementAtCursor('ol', li);

    return list?.isContentEditable;
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createListEditMenuProvider(
    strings?: LocalizedStrings<ListNumberResetMenuItemStringKey | ListNumberEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'listEdit',
        [ListNumberResetMenuItem, ListNumberEditMenuItem],
        strings,
        shouldShowListEditItems
    );
}
