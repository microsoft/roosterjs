import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextMenuOptions } from 'roosterjs-editor-plugins/lib/ContextMenu';

const styles = require('./ContextMenuProvider.scss');

export interface ContextMenuItem {
    key: string;
    name: string;
    onClick: () => void;
}

export const CONTEXT_MENU_DATA_PROVIDER: ContextMenuOptions<ContextMenuItem> = {
    render: (container: HTMLElement, items: ContextMenuItem[], onDismiss: () => void) => {
        ReactDOM.render(<ContextMenu items={items} onDismiss={onDismiss} />, container);
    },
    dismiss: (container: HTMLElement) => {
        ReactDOM.unmountComponentAtNode(container);
    },
};

function ContextMenu(props: { items: ContextMenuItem[]; onDismiss: () => void }) {
    const div = React.useRef<HTMLDivElement>();
    const { items, onDismiss } = props;

    React.useEffect(() => {
        const doc = div.current.ownerDocument;
        doc.addEventListener('click', onDismiss);
        doc.addEventListener('keydown', onDismiss);
        return () => {
            doc.removeEventListener('click', onDismiss);
            doc.removeEventListener('keydown', onDismiss);
        };
    }, []);
    return (
        <div className={styles.menu} ref={div}>
            {items.map(
                item =>
                    item && (
                        <div
                            className={styles.menuItem}
                            key={item.key}
                            onClick={() => item.onClick()}>
                            {item.name}
                        </div>
                    )
            )}
        </div>
    );
}
