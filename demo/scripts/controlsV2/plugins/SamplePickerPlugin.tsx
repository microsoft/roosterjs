import * as React from 'react';
import { Callout } from '@fluentui/react/lib/Callout';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { ReactEditorPlugin, UIUtilities } from '../roosterjsReact/common';
import {
    PickerDirection,
    PickerPluginBase,
    PickerSelectionChangMode,
} from 'roosterjs-content-model-plugins';
import {
    createContentModelDocument,
    createEntity,
    createParagraph,
} from 'roosterjs-content-model-dom';

const itemStyle = mergeStyles({
    height: '20px',
    margin: '4px',
    padding: '4px',
    minWidth: '200px',
});

const selectedItemStyle = mergeStyles({
    backgroundColor: 'blue',
    color: 'white',
    fontWeight: 'bold',
});

export class SamplePickerPlugin extends PickerPluginBase implements ReactEditorPlugin {
    private index = 0;
    private uiUtilities: UIUtilities;
    private ref: IPickerMenu | null = null;
    private queryString: string;
    private items: IContextualMenuItem[] = [];
    private onClose: (() => void) | null = null;

    constructor() {
        super('@');
    }

    setUIUtilities(uiUtilities: UIUtilities): void {
        this.uiUtilities = uiUtilities;
    }

    onTrigger(x: number, y: number, buffer: number, queryString: string): PickerDirection {
        this.queryString = queryString;
        this.items = buildItems(queryString, this.index);

        this.onClose = this.uiUtilities.renderComponent(
            <PickerMenu x={x} y={y} ref={ref => (this.ref = ref)} items={this.items} />
        );

        return 'vertical';
    }

    onClosePicker() {
        this.onClose?.();
        this.onClose = null;
    }

    onSelectionChanged(mode: PickerSelectionChangMode): void {
        switch (mode) {
            case 'first':
            case 'firstInRow':
            case 'previousPage':
                this.index = 0;
                break;

            case 'last':
            case 'lastInRow':
            case 'nextPage':
                this.index = 4;
                break;

            case 'previous':
                this.index = this.index - 1;

                if (this.index < 0) {
                    this.index = 4;
                }

                break;

            case 'next':
                this.index = (this.index + 1) % 5;
                break;
        }

        this.items = buildItems(this.queryString, this.index);
        this.ref?.setMenuItems(this.items);
    }

    onSelect(): void {
        const text = this.items[this.index]?.text;

        if (text) {
            const span = this.editor.getDocument().createElement('span');
            span.textContent = '@' + text;
            span.style.textDecoration = 'underline';
            span.style.color = 'blue';

            const entity = createEntity(span, true /*isReadonly*/, {}, 'TEST_ENTITY');
            const paragraph = createParagraph();
            const doc = createContentModelDocument();

            paragraph.segments.push(entity);
            doc.blocks.push(paragraph);

            this.commitChange(
                doc,
                {
                    changeSource: 'SamplePicker',
                },
                true /*canUndoByBackspace*/
            );
        }

        this.onClose?.();
        this.onClose = null;
        this.ref = null;
        this.closePicker();
    }

    onQueryStringChanged(queryString: string): void {
        this.queryString = queryString;

        if (queryString.split(' ').length > 4) {
            this.closePicker(); // too long
        } else {
            this.items = buildItems(this.queryString, this.index);
            this.ref?.setMenuItems(this.items);
        }
    }
}

function buildItems(queryString: string, index: number): IContextualMenuItem[] {
    return [1, 2, 3, 4, 5].map((x, i) => ({
        key: 'item' + i,
        text: queryString.substring(1) + ' item ' + x,
        checked: i == index,
    }));
}

interface IPickerMenu {
    setMenuItems: (items: IContextualMenuItem[]) => void;
}

const PickerMenu = React.forwardRef(
    (
        props: { x: number; y: number; items: IContextualMenuItem[] },
        ref: React.Ref<IPickerMenu>
    ) => {
        const [items, setItems] = React.useState<IContextualMenuItem[]>(props.items);

        React.useImperativeHandle(ref, () => ({
            setMenuItems: setItems,
        }));

        return (
            <Callout target={{ left: props.x, top: props.y }} gapSpace={10}>
                {items.map(item => (
                    <div className={itemStyle + (item.checked ? ' ' + selectedItemStyle : '')}>
                        {item.text}
                    </div>
                ))}
            </Callout>
        );
    }
);
