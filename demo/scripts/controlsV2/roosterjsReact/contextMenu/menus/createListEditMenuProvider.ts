import { createContextMenuProvider } from '../utils/createContextMenuProvider';
import { EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import { setListStartNumber } from 'roosterjs-content-model-api';
import { showInputDialog } from '../../inputDialog/utils/showInputDialog';
import type { ContextMenuItem } from '../types/ContextMenuItem';
import type { ListNumberMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';

const ListNumberResetMenuItem: ContextMenuItem<ListNumberMenuItemStringKey> = {
    key: 'menuNameListNumberReset',
    unlocalizedText: 'Restart at 1',
    onClick: (_, editor, node) => {
        setListStartNumber(editor, 1);
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
                } else if (isNodeOfType(child, 'ELEMENT_NODE') && isElementOfType(child, 'li')) {
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
                        setListStartNumber(editor, Math.floor(result));
                    }
                }
            });
        }
    },
};

function getEditingList(editor: IEditor, node: Node) {
    const domHelper = editor.getDOMHelper();
    const li = domHelper.findClosestElementAncestor(node, 'LI');
    const list = li && (domHelper.findClosestElementAncestor(li, 'ol') as HTMLOListElement | null);

    return list?.isContentEditable ? { list, li } : null;
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export function createListEditMenuProvider(
    strings?: LocalizedStrings<ListNumberMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'listEdit',
        [ListNumberResetMenuItem, ListNumberEditMenuItem],
        strings,
        (editor, node) => !!getEditingList(editor, node)
    );
}
