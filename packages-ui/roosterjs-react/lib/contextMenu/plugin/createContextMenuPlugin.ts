import dismissContextMenu from '../utils/dismissContextMenu';
import renderContextMenu from '../utils/renderContextMenu';
import { ContextMenu } from 'roosterjs-editor-plugins/lib/ContextMenu';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';

/**
 * Create a new instance of ContextMenu plugin with context menu implementation based on FluentUI.
 */
export default function createContextMenuPlugin(): ContextMenu<IContextualMenuItem> {
    return new ContextMenu({
        render: renderContextMenu,
        dismiss: dismissContextMenu,
    });
}
