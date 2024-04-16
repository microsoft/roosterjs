import * as React from 'react';
import { Callout } from '@fluentui/react/lib/Callout';
import { DOMInsertPoint } from 'roosterjs-content-model-types';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { ReactEditorPlugin, UIUtilities } from '../roosterjsReact/common';
import {
    PickerDirection,
    PickerHandler,
    PickerHelper,
    PickerPlugin,
    PickerSelectionChangMode,
    getDOMInsertPointRect,
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

export class SamplePickerPlugin extends PickerPlugin implements ReactEditorPlugin {
    private pickerHandler: SamplePickerHandler;

    constructor() {
        const pickerHandler = new SamplePickerHandler();
        super('@', pickerHandler);

        this.pickerHandler = pickerHandler;
    }

    setUIUtilities(uiUtilities: UIUtilities): void {
        this.pickerHandler.setUIUtilities(uiUtilities);
    }
}

class SamplePickerHandler implements PickerHandler {
    private uiUtilities: UIUtilities;
    private index = 0;
    private ref: IPickerMenu | null = null;
    private queryString: string;
    private items: IContextualMenuItem[] = [];
    private onClose: (() => void) | null = null;
    private helper: PickerHelper | null = null;

    onInitialize(helper: PickerHelper) {
        this.helper = helper;
    }

    onDispose() {
        this.helper = null;
    }

    setUIUtilities(uiUtilities: UIUtilities): void {
        this.uiUtilities = uiUtilities;
    }

    onTrigger(queryString: string, pos: DOMInsertPoint): PickerDirection | null {
        this.index = 0;
        this.queryString = queryString;
        this.items = buildItems(queryString, this.index);

        const rect = getDOMInsertPointRect(this.helper.editor.getDocument(), pos);

        if (rect) {
            this.onClose = this.uiUtilities.renderComponent(
                <PickerMenu
                    x={rect.left}
                    y={(rect.bottom + rect.top) / 2}
                    ref={ref => (this.ref = ref)}
                    items={this.items}
                />
            );
            return 'vertical';
        } else {
            return null;
        }
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
            const span = this.helper.editor.getDocument().createElement('span');
            span.textContent = '@' + text;
            span.style.textDecoration = 'underline';
            span.style.color = 'blue';

            const entity = createEntity(span, true /*isReadonly*/, {}, 'TEST_ENTITY');
            const paragraph = createParagraph();
            const doc = createContentModelDocument();

            paragraph.segments.push(entity);
            doc.blocks.push(paragraph);

            this.helper.replaceQueryString(
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
        this.helper.closePicker();
    }

    onQueryStringChanged(queryString: string): void {
        this.queryString = queryString;

        if (queryString.length > 100 || queryString.split(' ').length > 4) {
            // Querystring is too long, so close picker
            this.helper.closePicker();
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
            <Callout target={{ left: props.x, top: props.y }} isBeakVisible={false} gapSpace={10}>
                {items.map(item => (
                    <div className={itemStyle + (item.checked ? ' ' + selectedItemStyle : '')}>
                        {item.text}
                    </div>
                ))}
            </Callout>
        );
    }
);
