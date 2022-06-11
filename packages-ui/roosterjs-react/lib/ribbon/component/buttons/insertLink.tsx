import * as React from 'react';
import getLocalizedString from '../../../common/utils/getLocalizedString';
import RibbonButton from '../../type/RibbonButton';
import { createLink } from 'roosterjs-editor-api';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { IEditor, Keys, QueryScope } from 'roosterjs-editor-types';
import { InsertLinkButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { LocalizedStrings } from '../../../common/type/LocalizedStrings';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

/**
 * @internal
 * "Insert link" button on the format ribbon
 */
export const insertLink: RibbonButton<InsertLinkButtonStringKey> = {
    key: 'buttonNameInsertLink',
    unlocalizedText: 'Insert link',
    iconName: 'Link',
    onClick: (editor, _, strings, uiUtilities) => {
        let disposer: null | (() => void) = null;
        const onDismiss = () => {
            disposer?.();
        };
        const existingLink = editor.queryElements<HTMLAnchorElement>(
            'a[href]',
            QueryScope.OnSelection
        )[0];
        const url = existingLink?.href || '';
        const displayText =
            existingLink?.textContent || editor.getSelectionRange()?.toString() || '';

        disposer = uiUtilities.renderComponent(
            <InsertLinkDialog
                editor={editor}
                onDismiss={onDismiss}
                initUrl={url}
                initDisplayText={displayText}
                strings={strings}
            />
        );
    },
};

const classNames = mergeStyleSets({
    linkInput: {
        width: '100%',
        minWidth: '250px',
        height: '32px',
        margin: '5px 0',
        border: '1px solid black',
        borderRadius: '2px',
        padding: '0 0 0 5px',
    },
});

function InsertLinkDialog(props: {
    editor: IEditor;
    initDisplayText: string;
    initUrl: string;
    onDismiss: (url?: string, displayText?: string) => void;
    strings: LocalizedStrings<InsertLinkButtonStringKey>;
}) {
    const { editor, onDismiss, initUrl, initDisplayText, strings } = props;
    const [url, setUrl] = React.useState(initUrl);
    const [displayText, setDisplayText] = React.useState(initDisplayText);
    const [isChanged, setIsChanged] = React.useState(false);
    const urlInput = React.useRef<HTMLInputElement>();
    const displayTextInput = React.useRef<HTMLInputElement>();
    const dialogContentProps = {
        type: DialogType.normal,
        title: getLocalizedString(strings, 'insertLinkTitle', 'Insert link'),
    };

    const onOk = React.useCallback(() => {
        onDismiss();
        editor.focus();

        if (isChanged && url && displayText) {
            createLink(editor, url, url, displayText);
        }
    }, [onDismiss, url, displayText, isChanged]);

    const onCancel = React.useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    const onDisplayTextChanged = React.useCallback(() => {
        setDisplayText(displayTextInput.current.value);
        setIsChanged(true);
    }, [displayTextInput, setIsChanged]);

    const onUrlChanged = React.useCallback(() => {
        if (url == displayText) {
            setDisplayText(urlInput.current.value);
        }
        setUrl(urlInput.current.value);
        setIsChanged(true);
    }, [setUrl, url, displayText, setDisplayText, setIsChanged]);

    const onKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.which == Keys.ENTER) {
                onOk();
            }
        },
        [onOk]
    );

    return (
        <Dialog dialogContentProps={dialogContentProps} hidden={false} onDismiss={onCancel}>
            <div>
                <div>
                    <label htmlFor="linkInput">Web address (URL)</label>
                    <input
                        id="linkInput"
                        ref={urlInput}
                        role="textbox"
                        type="text"
                        className={classNames.linkInput}
                        value={url}
                        onChange={onUrlChanged}
                        onKeyPress={onKeyPress}
                        autoFocus={true}
                    />
                </div>
                <div>
                    <label htmlFor="displayTextInput">Display as</label>
                    <input
                        id="displayTextInput"
                        ref={displayTextInput}
                        role="textbox"
                        type="text"
                        className={classNames.linkInput}
                        value={displayText}
                        onChange={onDisplayTextChanged}
                        onKeyPress={onKeyPress}
                    />
                </div>
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
    );
}
