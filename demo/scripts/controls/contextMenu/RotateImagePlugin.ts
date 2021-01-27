import { ChangeSource, ContextMenuProvider, IEditor } from 'roosterjs-editor-types';
import { ContextMenuItem } from './ContextMenuProvider';
import { rotateElement } from 'roosterjs-editor-api';
import { safeInstanceOf } from 'roosterjs-editor-dom';

export default class RotateImagePlugin implements ContextMenuProvider<ContextMenuItem> {
    private editor: IEditor;

    getName() {
        return 'RotateImage';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getContextMenuItems(node: Node) {
        const items: ContextMenuItem[] = [];
        if (safeInstanceOf(node, 'HTMLImageElement')) {
            for (let i = 45; i < 360; i += 45) {
                items.push({
                    key: 'rotate' + i,
                    name: `Rotate ${i} degree`,
                    onClick: () => {
                        this.editor?.addUndoSnapshot(() => {
                            this.editor.focus();
                            rotateElement(this.editor, node, i);
                        }, ChangeSource.Format);
                    },
                });
            }
        }
        return items;
    }
}
