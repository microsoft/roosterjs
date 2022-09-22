import * as React from 'react';
import DialogItem from '../type/DialogItem';
import { getLocalizedString, LocalizedStrings } from '../../common/index';
import { Keys } from 'roosterjs-editor-types';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';

/**
 * @internal
 */
export interface InputDialogItemProps<Strings extends string, ItemNames extends string> {
    itemName: ItemNames;
    strings: LocalizedStrings<Strings> | undefined;
    items: Record<ItemNames, DialogItem<Strings>>;
    currentValues: Record<ItemNames, string>;
    onEnterKey: () => void;
    onChanged: (itemName: ItemNames, newValue: string) => void;
}

const classNames = mergeStyleSets({
    inputBox: {
        width: '100%',
        minWidth: '250px',
        height: '32px',
        margin: '5px 0 16px',
        borderRadius: '2px',
    },
});

/**
 * @internal
 */
export default function InputDialogItem<Strings extends string, ItemNames extends string>(
    props: InputDialogItemProps<Strings, ItemNames>
) {
    const { itemName, strings, items, currentValues, onChanged, onEnterKey } = props;
    const { labelKey, unlocalizedLabel, autoFocus } = items[itemName];
    const value = currentValues[itemName];
    const onValueChange = React.useCallback(
        (_, newValue) => {
            onChanged(itemName, newValue);
        },
        [itemName, onChanged]
    );

    const onKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.which == Keys.ENTER) {
                onEnterKey();
            }
        },
        [onEnterKey]
    );

    return (
        <div>
            {labelKey ? <div>{getLocalizedString(strings, labelKey, unlocalizedLabel)}</div> : null}
            <div>
                <TextField
                    role="textbox"
                    type="text"
                    className={classNames.inputBox}
                    value={value}
                    onChange={onValueChange}
                    onKeyPress={onKeyPress}
                    autoFocus={autoFocus}
                />
            </div>
        </div>
    );
}
