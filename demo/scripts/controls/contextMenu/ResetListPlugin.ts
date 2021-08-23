import { ContextMenuItem } from './ContextMenuProvider';
import { ContextMenuProvider, IEditor } from 'roosterjs-editor-types';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    setListIndent,
    setListNumberPosition,
    setOrderedListNumbering,
} from 'roosterjs-editor-api';

export default class ResetListPlugin implements ContextMenuProvider<ContextMenuItem> {
    private editor: IEditor;

    getName() {
        return 'ResetList';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getContextMenuItems(node: Node) {
        const items: ContextMenuItem[] = [];

        if (safeInstanceOf(node, 'HTMLLIElement')) {
            const list = this.editor.getElementAtCursor('ol,ul', node);
            if (safeInstanceOf(list, 'HTMLOListElement')) {
                items.push(
                    {
                        key: 'resetList',
                        name: 'Reset list number',
                        onClick: () => {
                            setOrderedListNumbering(this.editor, node, 1);
                        },
                    },
                    {
                        key: 'setNumberingValue',
                        name: 'Set Numbering Value',
                        onClick: () => {
                            let value = parseInt(prompt('Set Value to...', '1'));
                            setOrderedListNumbering(this.editor, node, value);
                        },
                    },
                    {
                        key: 'adjustListIndents',
                        name: 'Adjust List Indents',
                        dropDownItems: [
                            {
                                key: 'numberPosition',
                                name: 'Number Position',
                                onClick: () => {
                                    let value = parseInt(prompt('Set Value to...', '1'));
                                    setListNumberPosition(this.editor, list, value);
                                },
                            },
                            {
                                key: 'textIndent',
                                name: 'Text Indent',
                                onClick: () => {
                                    let value = parseInt(prompt('Set Value to...', '1'));
                                    setListIndent(this.editor, list, value);
                                },
                            },
                        ],
                        onClick: () => {},
                    }
                );
            }
        }

        return items;
    }
}
