import * as React from 'react';
import InputDialogItem from './InputDialogItem';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { getLocalizedString } from '../../common/index';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { Dialog, DialogFooter, DialogType, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import type { DialogItem } from '../type/DialogItem';
import type {
    CancelButtonStringKey,
    LocalizedStrings,
    OkButtonStringKey,
} from '../../common/index';

/**
 * @internal
 */
export interface InputDialogProps<Strings extends string, ItemNames extends string> {
    dialogTitleKey: Strings;
    unlocalizedTitle: string;
    items: Record<ItemNames, DialogItem<Strings>>;
    strings?: LocalizedStrings<Strings | OkButtonStringKey | CancelButtonStringKey>;
    onChange?: (
        changedItemName: ItemNames,
        newValue: string,
        currentValues: Record<ItemNames, string>
    ) => Record<ItemNames, string> | null;
    onOk: (values: Record<ItemNames, string>) => void;
    onCancel: () => void;
    rows?: number;
}

/**
 * @internal
 */
export default function InputDialog<Strings extends string, ItemNames extends string>(
    props: InputDialogProps<Strings, ItemNames>
) {
    const {
        items,
        strings,
        dialogTitleKey,
        unlocalizedTitle,
        onOk,
        onCancel,
        onChange,
        rows,
    } = props;
    const dialogContentProps: IDialogContentProps = React.useMemo(
        () => ({
            type: DialogType.normal,
            title: getLocalizedString(strings, dialogTitleKey, unlocalizedTitle),
            styles: {
                innerContent: {
                    height: rows ? '200px' : undefined,
                },
            },
        }),
        [strings, dialogTitleKey, unlocalizedTitle]
    );
    const [currentValues, setCurrentValues] = React.useState<Record<ItemNames, string>>(
        getObjectKeys(items).reduce((result: Record<ItemNames, string>, key) => {
            result[key] = items[key].initValue;
            return result;
        }, {} as Record<ItemNames, string>)
    );

    const onSubmit = React.useCallback(() => {
        onOk?.(currentValues);
    }, [onOk, currentValues]);
    const onItemChanged = React.useCallback(
        (itemName: ItemNames, newValue: string) => {
            if (itemName in items) {
                const newValues = onChange?.(itemName, newValue, {
                    ...currentValues,
                }) || {
                    ...currentValues,
                    [itemName]: newValue,
                };

                setCurrentValues(newValues);
            }
        },
        [setCurrentValues, currentValues, items]
    );

    return (
        <Dialog dialogContentProps={dialogContentProps} hidden={false} onDismiss={onCancel}>
            <div>
                {getObjectKeys(items).map(key => (
                    <InputDialogItem
                        key={key}
                        itemName={key}
                        items={items}
                        strings={strings}
                        currentValues={currentValues}
                        onEnterKey={onSubmit}
                        onChanged={onItemChanged}
                        rows={rows}
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
