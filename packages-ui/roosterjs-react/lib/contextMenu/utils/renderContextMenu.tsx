import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextualMenu, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

/**
 * @internal
 */
export default function renderContextMenu(
    container: HTMLElement,
    items: (IContextualMenuItem | null)[],
    onDismiss: () => void
) {
    let dividerKey = 0;
    const allItems: IContextualMenuItem[] = items.map(
        item =>
            item || {
                name: '-',
                key: 'divider_' + (dividerKey++).toString(),
            }
    );
    const targetWindow = container?.ownerDocument?.defaultView || window;

    if (allItems.length > 0) {
        ReactDOM.render(
            <WindowProvider window={targetWindow}>
                <ContextualMenu target={container} onDismiss={onDismiss} items={allItems} />
            </WindowProvider>,
            container
        );
    }
}
