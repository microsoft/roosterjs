import * as React from 'react';
import { ContextMenu } from 'roosterjs-editor-plugins';
import { ContextualMenu, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { ReactEditorPlugin, UIUtilities } from '../../common/index';
import { renderReactComponent } from '../../common/utils/renderReactComponent';

function normalizeItems(items: (IContextualMenuItem | null)[]) {
    let dividerKey = 0;
    return items.map(
        item =>
            item || {
                name: '-',
                key: 'divider_' + (dividerKey++).toString(),
            }
    );
}

class ContextMenuPlugin extends ContextMenu<IContextualMenuItem> implements ReactEditorPlugin {
    private uiUtilities: UIUtilities | null = null;
    private disposer: (() => void) | null = null;

    constructor() {
        super({
            render: (container, items, onDismiss) => {
                const normalizedITems = normalizeItems(items);

                if (normalizedITems.length > 0) {
                    this.disposer = renderReactComponent(
                        this.uiUtilities,
                        <ContextualMenu
                            target={container}
                            onDismiss={onDismiss}
                            items={normalizedITems}
                        />
                    );
                }
            },
            dismiss: _ => {
                this.disposer?.();
                this.disposer = null;
            },
        });
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }
}

/**
 * Create a new instance of ContextMenu plugin with context menu implementation based on FluentUI.
 */
export default function createContextMenuPlugin(): ContextMenu<IContextualMenuItem> {
    return new ContextMenuPlugin();
}
