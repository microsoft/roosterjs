import * as React from 'react';
import DialogItem from '../type/DialogItem';
import InputDialog from '../component/InputDialog';
import UIUtilities from '../type/UIUtilities';
import {
    CancelButtonStringKey,
    LocalizedStrings,
    OkButtonStringKey,
} from '../type/LocalizedStrings';

/**
 * @internal
 */
export default function showInputDialog<Strings extends string, ItemNames extends string>(
    uiUtilities: UIUtilities,
    dialogTitleKey: Strings,
    unlocalizedTitle: string,
    items: Record<ItemNames, DialogItem<Strings>>,
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
