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
                    }
                );
            }
            if (
                safeInstanceOf(list, 'HTMLOListElement') ||
                safeInstanceOf(list, 'HTMLUListElement')
            ) {
                items.push({
                    key: 'adjustListIndents',
                    name: 'Adjust List Indents',
                    dropDownItems: [
                        {
                            key: 'numberPosition',
                            name: 'Number Position',
                            onClick: () => {
                                let value = parseInt(prompt('Set Value to...', '1'));
                                setListNumberPosition(this.editor, list, value, 'px');
                            },
                        },
                        {
                            key: 'textIndent',
                            name: 'Text Indent',
                            onClick: () => {
                                let value = parseInt(prompt('Set Value to...', '1'));
                                setListIndent(this.editor, list, {
                                    textIdent: value,
                                    unit: 'px',
                                });
                            },
                        },
                        {
                            key: 'textIndent',
                            name: 'Text Indent With Global Property',
                            onClick: () => {
                                let input = prompt(
                                    "Set Global Value to... ('inherit' | 'initial' | 'revert' | 'unset')",
                                    '1'
                                );

                                let value: 'inherit' | 'initial' | 'revert' | 'unset';

                                switch (input) {
                                    case 'inherit':
                                        value = 'inherit';
                                        break;
                                    case 'initial':
                                        value = 'initial';
                                        break;
                                    case 'revert':
                                        value = 'revert';
                                        break;
                                    case 'unset':
                                        value = 'unset';
                                        break;
                                    default:
                                        return;
                                }
                                setListIndent(this.editor, list, {
                                    globalValue: value,
                                });
                            },
                        },
                    ],
                    onClick: () => {},
                });
            }
        }

        return items;
    }
}
