import * as React from 'react';
import getLocalizedString from '../utils/getLocalizedString';
import UIUtilities from '../type/UIUtilities';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { Keys } from 'roosterjs-editor-types';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import {
    CancelButtonStringKey,
    LocalizedStrings,
    OkButtonStringKey,
} from '../type/LocalizedStrings';

interface ItemProps<Strings extends string, ItemNames extends string> {
    itemName: ItemNames;
    strings: LocalizedStrings<Strings>;
    items: Record<ItemNames, InputDialogItem<Strings>>;
    currentValues: Record<ItemNames, string>;
    onEnterKey: () => void;
    onChanged: (itemName: string, newValue: string) => void;
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

function DialogItem<Strings extends string, ItemNames extends string>(
    props: ItemProps<Strings, ItemNames>
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

interface InputDialogProps<Strings extends string, ItemNames extends string> {
    dialogTitleKey: Strings;
    unlocalizedTitle: string;
    items: Record<ItemNames, InputDialogItem<Strings>>;
    strings: LocalizedStrings<Strings | OkButtonStringKey | CancelButtonStringKey>;
    onChange?: (
        changedItemName: ItemNames,
        newValue: string,
        currentValues: Record<ItemNames, string>
    ) => Record<ItemNames, string> | null;
    onOk: (values: Record<ItemNames, string>) => void;
    onCancel: () => void;
}

function InputDialog<Strings extends string, ItemNames extends string>(
    props: InputDialogProps<Strings, ItemNames>
) {
    const { items, strings, dialogTitleKey, unlocalizedTitle, onOk, onCancel, onChange } = props;
    const dialogContentProps = React.useMemo(
        () => ({
            type: DialogType.normal,
            title: getLocalizedString(strings, dialogTitleKey, unlocalizedTitle),
        }),
        [strings, dialogTitleKey, unlocalizedTitle]
    );
    const [currentValues, setCurrentValues] = React.useState<Record<ItemNames, string>>(
        Object.keys(items).reduce((result: Record<ItemNames, string>, key: keyof typeof items) => {
            result[key] = items[key].initValue;
            return result;
        }, {} as Record<ItemNames, string>)
    );

    const onSubmit = React.useCallback(() => {
        onOk?.(currentValues);
    }, [onOk, currentValues]);
    const onItemChanged = React.useCallback(
        (itemName: ItemNames, newValue: string) => {
            const newValues = onChange?.(itemName, newValue, { ...currentValues }) || {
                ...currentValues,
                [itemName]: newValue,
            };

            setCurrentValues(newValues);
        },
        [setCurrentValues, currentValues]
    );

    return (
        <Dialog dialogContentProps={dialogContentProps} hidden={false} onDismiss={onCancel}>
            <div>
                {Object.keys(items).map((key: keyof typeof items) => (
                    <DialogItem
                        key={key}
                        itemName={key}
                        items={items}
                        strings={strings}
                        currentValues={currentValues}
                        onEnterKey={onSubmit}
                        onChanged={onItemChanged}
                    />
                ))}
            </div>
            <DialogFooter>
                <PrimaryButton
                    text={getLocalizedString(strings, 'buttonNameOK', 'OK')}
                    onClick={onSubmit}
                />
                <DefaultButton
                    text={getLocalizedString(strings, 'buttonNameCancel', 'Cancel')}
                    onClick={onCancel}
                />
            </DialogFooter>
        </Dialog>
    );
}

/**
 * @internal
 */
export interface InputDialogItem<Strings extends string> {
    labelKey: Strings | null;
    unlocalizedLabel: string;
    initValue: string;
    autoFocus?: boolean;
}

/**
 * @internal
 */
export default function showInputDialog<Strings extends string, ItemNames extends string>(
    uiUtilities: UIUtilities,
    dialogTitleKey: Strings,
    unlocalizedTitle: string,
    items: Record<ItemNames, InputDialogItem<Strings>>,
    strings: LocalizedStrings<Strings | OkButtonStringKey | CancelButtonStringKey>,
    onChange?: (
        changedItemName: ItemNames,
        newValue: string,
        currentValues: Record<ItemNames, string>
    ) => Record<ItemNames, string> | null
): Promise<Record<ItemNames, string> | null> {
    return new Promise<Record<ItemNames, string> | null>(resolve => {
        let disposer: null | (() => void) = null;
        const onOk = (result: Record<ItemNames, string>) => {
            disposer?.();
            resolve(result);
        };
        const onCancel = () => {
            disposer?.();
            resolve(null);
        };
        const component = (
            <InputDialog
                dialogTitleKey={dialogTitleKey}
                unlocalizedTitle={unlocalizedTitle}
                items={items}
                strings={strings}
                onOk={onOk}
                onCancel={onCancel}
                onChange={onChange}
            />
        );

        disposer = uiUtilities.renderComponent(component);
    });
}
