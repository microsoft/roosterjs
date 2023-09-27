import createContextMenuProvider from '../utils/createContextMenuProvider';
import showInputDialog from '../../inputDialog/utils/showInputDialog';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setOrderedListNumbering } from 'roosterjs-editor-api';
import type ContextMenuItem from '../types/ContextMenuItem';
import type { EditorPlugin, IEditor } from 'roosterjs-editor-types';
import type { ListNumberMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';

const ListNumberResetMenuItem: ContextMenuItem<ListNumberMenuItemStringKey> = {
    key: 'menuNameListNumberReset',
    unlocalizedText: 'Restart at 1',
    onClick: (_, editor, node) => {
        const li = editor.getElementAtCursor('LI', node) as HTMLLIElement;
        setOrderedListNumbering(editor, li, 1);
    },
};

const ListNumberEditMenuItem: ContextMenuItem<ListNumberMenuItemStringKey> = {
    key: 'menuNameListNumberEdit',
    unlocalizedText: 'Set numbering value',
    onClick: (_, editor, node, strings, uiUtilities) => {
        const listAndLi = getEditingList(editor, node);

        if (listAndLi) {
            const { list, li } = listAndLi;
            let startNumber = list.start;

            for (let child = list.firstChild; child; child = child.nextSibling) {
                if (child === li) {
                    break;
                } else if (safeInstanceOf(child, 'HTMLLIElement')) {
                    startNumber += 1;
                }
            }

            showInputDialog(
                uiUtilities,
                'menuNameListNumberEdit',
                'Set numbering value',
                {
                    value: {
                        labelKey: 'dialogTextSetListNumber',
                        unlocalizedLabel: 'Set value to',
                        initValue: startNumber.toString(),
                    },
                },
                strings
            ).then(values => {
                editor.focus();

                if (values) {
                    const result = parseInt(values.value);

                    if (result > 0 && result != startNumber) {
                        setOrderedListNumbering(editor, li, Math.floor(result));
                    }
                }
            });
        }
    },
};

function getEditingList(editor: IEditor, node: Node) {
    const li = editor.getElementAtCursor('LI', node) as HTMLLIElement;
    const list = li && (editor.getElementAtCursor('ol', li) as HTMLOListElement);

    return list?.isContentEditable ? { list, li } : null;
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createListEditMenuProvider(
    strings?: LocalizedStrings<ListNumberMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'listEdit',
        [ListNumberResetMenuItem, ListNumberEditMenuItem],
        strings,
        (editor, node) => !!getEditingList(editor, node)
    );
}
