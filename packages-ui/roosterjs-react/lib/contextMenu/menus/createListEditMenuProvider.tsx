import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import getLocalizedString from '../../common/utils/getLocalizedString';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import { EditorPlugin, IEditor, Keys } from 'roosterjs-editor-types';
import { ListNumberMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setOrderedListNumbering } from 'roosterjs-editor-api';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

const ListNumberResetMenuItem: ContextMenuItem<ListNumberMenuItemStringKey> = {
    key: 'menuNameListNumberReset',
    unlocalizedText: 'Restart at 1',
    onClick: (_, editor, node) => {
        const li = editor.getElementAtCursor('LI', node) as HTMLLIElement;
        setOrderedListNumbering(editor, li, 1);
    },
};

const ListNumberEditMenuItem: ContextMenuItem<ListNumberMenuItemStringKey> = {
    key: 'menuNameListNumberEdit',
    unlocalizedText: 'Set numbering value',
    onClick: (_, editor, node, strings) => {
        const listAndLi = getEditingList(editor, node);

        if (listAndLi) {
            const { list, li } = listAndLi;
            let startNumber = list.start;

            for (let child = list.firstChild; child; child = child.nextSibling) {
                if (child === li) {
                    break;
                } else if (safeInstanceOf(child, 'HTMLLIElement')) {
                    startNumber += 1;
                }
            }

            const doc = editor.getDocument();
            let div = doc.createElement('div');
            doc.body.appendChild(div);
            const onDismiss = () => {
                ReactDOM.unmountComponentAtNode(div);
                doc.body.removeChild(div);
                div = null;
            };

            ReactDOM.render(
                <SetListNumberDialog
                    editor={editor}
                    listItem={li}
                    onDismiss={onDismiss}
                    initValue={startNumber}
                    strings={strings}
                />,
                div
            );
        }
    },
};

function getEditingList(editor: IEditor, node: Node) {
    const li = editor.getElementAtCursor('LI', node) as HTMLLIElement;
    const list = li && (editor.getElementAtCursor('ol', li) as HTMLOListElement);

    return list?.isContentEditable ? { list, li } : null;
}

const classNames = mergeStyleSets({
    valueInput: {
        width: '100%',
        minWidth: '250px',
        height: '32px',
        margin: '5px 0',
        border: '1px solid black',
        borderRadius: '2px',
        padding: '0 0 0 5px',
    },
});

function SetListNumberDialog(props: {
    editor: IEditor;
    listItem: HTMLLIElement;
    initValue: number;
    onDismiss: () => void;
    strings: LocalizedStrings<ListNumberMenuItemStringKey>;
}) {
    const { editor, listItem, onDismiss, initValue, strings } = props;
    const [value, setValue] = React.useState(initValue + '');
    const valueInput = React.useRef<HTMLInputElement>();
    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: getLocalizedString(strings, 'menuNameListNumberEdit', 'Set numbering value'),
    };

    const onOk = React.useCallback(() => {
        onDismiss();
        editor.focus();

        const result = parseInt(value);

        if (result > 0 && result != initValue) {
            setOrderedListNumbering(editor, listItem, Math.floor(result));
        }
    }, [onDismiss, editor, listItem, value]);

    const onCancel = React.useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    const onValueChanged = React.useCallback(() => {
        setValue(valueInput.current.value);
    }, [valueInput.current, setValue]);

    const onKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.which == Keys.ENTER) {
                onOk();
            }
        },
        [onOk]
    );

    return (
        <WindowProvider window={editor.getDocument().defaultView}>
            <Dialog dialogContentProps={dialogContentProps} hidden={false} onDismiss={onCancel}>
                <div>
                    <label htmlFor="valueInput">
                        {getLocalizedString(strings, 'dialogTextSetListNumber', 'Set value to')}
                    </label>
                    <input
                        id="valueInput"
                        ref={valueInput}
                        role="textbox"
                        type="text"
                        className={classNames.valueInput}
                        value={value}
                        onChange={onValueChanged}
                        onKeyPress={onKeyPress}
                        autoFocus={true}
                    />
                </div>
                <DialogFooter>
                    <PrimaryButton
                        text={getLocalizedString(strings, 'buttonNameOK', 'OK')}
                        onClick={onOk}
                    />
                    <DefaultButton
                        text={getLocalizedString(strings, 'buttonNameCancel', 'Cancel')}
                        onClick={onCancel}
                    />
                </DialogFooter>
            </Dialog>
        </WindowProvider>
    );
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createListEditMenuProvider(
    strings?: LocalizedStrings<ListNumberMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'listEdit',
        [ListNumberResetMenuItem, ListNumberEditMenuItem],
        strings,
        (editor, node) => !!getEditingList(editor, node)
    );
}
