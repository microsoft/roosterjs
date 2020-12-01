import { ChangeSource, ContextMenuProvider, IEditor } from 'roosterjs-editor-types';
import { ContextMenuItem } from './ContextMenuProvider';
import { safeInstanceOf } from 'roosterjs-editor-dom';

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
            if (safeInstanceOf(list, 'HTMLOListElement') && list.start > 1) {
                items.push({
                    key: 'resetList',
                    name: 'Reset list number',
                    onClick: () => {
                        this.editor?.addUndoSnapshot(() => {
                            this.editor.focus();
                            list.start = 1;
                        }, ChangeSource.Format);
                    },
                });
            }
        }

        return items;
    }
}
