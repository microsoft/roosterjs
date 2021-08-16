import { ChangeSource, ContextMenuProvider, IEditor } from 'roosterjs-editor-types';
import { ContextMenuItem } from './ContextMenuProvider';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setOrderedListNumbering } from 'roosterjs-editor-api';

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
                            this.editor?.addUndoSnapshot(() => {
                                this.editor.focus();
                                setOrderedListNumbering(this.editor, list, 1);
                            }, ChangeSource.Format);
                        },
                    },
                    {
                        key: 'setNumberingValue',
                        name: 'Set Numbering Value',
                        onClick: () => {
                            this.editor?.addUndoSnapshot(() => {
                                this.editor.focus();

                                try {
                                    let value = parseInt(prompt('Set Value to...', '1'));
                                    setOrderedListNumbering(this.editor, list, value);
                                } catch (error) {
                                    setOrderedListNumbering(this.editor, list, 1);
                                }
                            }, ChangeSource.Format);
                        },
                    }
                );
            }
        }

        return items;
    }
}
