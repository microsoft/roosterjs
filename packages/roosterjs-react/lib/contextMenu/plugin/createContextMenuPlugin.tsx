import * as React from 'react';
import { ContextMenuPluginBase } from 'roosterjs-content-model-plugins';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { renderReactComponent } from '../../common/utils/renderReactComponent';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import type { ReactEditorPlugin, UIUtilities } from '../../common/index';

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

class ContextMenuPlugin extends ContextMenuPluginBase<IContextualMenuItem>
    implements ReactEditorPlugin {
    private uiUtilities: UIUtilities | null = null;
    private disposer: (() => void) | null = null;

    constructor() {
        super({
            render: (container, items, onDismiss) => {
                const normalizedItems = normalizeItems(items);

                if (normalizedItems.length > 0) {
                    this.disposer = renderReactComponent(
                        this.uiUtilities,
                        <ContextualMenu
                            target={container}
                            onDismiss={onDismiss}
                            items={normalizedItems}
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
export function createContextMenuPlugin(): ContextMenuPluginBase<IContextualMenuItem> {
    return new ContextMenuPlugin();
}
