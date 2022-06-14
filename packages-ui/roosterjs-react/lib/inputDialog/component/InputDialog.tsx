import * as React from 'react';
import DialogItem from '../type/DialogItem';
import InputDialogItem from './InputDialogItem';
import {
    CancelButtonStringKey,
    getLocalizedString,
    LocalizedStrings,
    OkButtonStringKey,
} from '../../common/index';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';

/**
 * @internal
 */
export interface InputDialogProps<Strings extends string, ItemNames extends string> {
    dialogTitleKey: Strings;
    unlocalizedTitle: string;
    items: Record<ItemNames, DialogItem<Strings>>;
    strings: LocalizedStrings<Strings | OkButtonStringKey | CancelButtonStringKey>;
    onChange?: (
        changedItemName: ItemNames,
        newValue: string,
        currentValues: Record<ItemNames, string>
    ) => Record<ItemNames, string> | null;
    onOk: (values: Record<ItemNames, string>) => void;
    onCancel: () => void;
}

/**
 * @internal
 */
export default function InputDialog<Strings extends string, ItemNames extends string>(
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
                    <InputDialogItem
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
