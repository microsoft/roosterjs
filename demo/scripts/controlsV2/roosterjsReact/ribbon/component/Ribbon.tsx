import * as React from 'react';
import { CommandBar, ICommandBarItemProps, ICommandBarProps } from '@fluentui/react/lib/CommandBar';
import { FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { getLocalizedString, LocalizedStrings } from 'roosterjs-react';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { IContextualMenuItem, IContextualMenuItemProps } from '@fluentui/react/lib/ContextualMenu';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { moreCommands } from '../buttons/moreCommands';
import { RibbonPlugin } from '../type/RibbonPlugin';
import type { RibbonButton } from '../type/RibbonButton';
import type { ContentModelFormatState } from 'roosterjs-content-model-types';

const ribbonClassName = mergeStyles({
    '& .ms-CommandBar': {
        padding: '0px',
    },
});

const rtlIcon = mergeStyles({
    transform: 'scaleX(-1)',
});

interface RibbonProps<T extends string> extends Partial<ICommandBarProps> {
    /**
     * The ribbon plugin used for connect editor and the ribbon
     */
    plugin: RibbonPlugin;

    /**
     * Buttons in this ribbon
     */
    buttons: RibbonButton<T>[];

    /**
     * A dictionary of localized strings for all buttons.
     * Key of the dictionary is the key of each button, value will be the string or a function to return the string
     */
    strings?: LocalizedStrings<T>;
}

/**
 * The format ribbon component of roosterjs-react
 * @param props Properties of format ribbon component
 * @returns The format ribbon component
 */
export function Ribbon<T extends string>(props: RibbonProps<T>) {
    const { plugin, buttons, strings, dir } = props;
    const [formatState, setFormatState] = React.useState<ContentModelFormatState | null>(null);
    const [currentTab, setCurrentTab] = React.useState<'format' | 'list'>('format');
    const isRtl = dir == 'rtl';

    const switchToFormatTab = React.useCallback(() => {
        setCurrentTab('format');
    }, []);

    const switchToListTab = React.useCallback(() => {
        setCurrentTab('list');
    }, []);

    const ribbonTabs = React.useMemo((): ICommandBarItemProps[] => {
        const result: ICommandBarItemProps[] = [
            {
                text: 'Format',
                key: 'format',
                checked: currentTab == 'format',
                onClick: switchToFormatTab,
            },
        ];

        if (formatState?.isBullet || formatState?.isNumbering) {
            result.push({
                text: 'List',
                key: 'list',
                checked: currentTab == 'list',
                onClick: switchToListTab,
            });
        }
        return result;
    }, [currentTab, formatState]);

    const onClick = React.useCallback(
        (_, item?: IContextualMenuItem) => {
            if (item) {
                plugin?.onButtonClick<string>(item.data, item.key, strings);
            }
        },
        [plugin, strings]
    );

    const onHover = React.useCallback(
        (button: RibbonButton<T>, key: string) => {
            plugin.startLivePreview<T>(button, key as T, strings);
        },
        [plugin, strings]
    );

    const onDismiss = React.useCallback(() => {
        plugin.stopLivePreview();
    }, [plugin]);

    const flipIcon = React.useCallback(
        (
            props?: IContextualMenuItemProps,
            defaultRender?: (props?: IContextualMenuItemProps) => JSX.Element | null
        ): JSX.Element | null => {
            if (!defaultRender) {
                return null;
            }
            return <span className={rtlIcon}>{defaultRender(props)}</span>;
        },
        []
    );

    const commandBarItems = React.useMemo((): ICommandBarItemProps[] => {
        return buttons
            .filter(button => button.category == currentTab)
            .map(
                (button): ICommandBarItemProps => {
                    const selectedItem =
                        formatState && button.dropDownMenu?.getSelectedItemKey?.(formatState);
                    const dropDownMenu = button.dropDownMenu;

                    const result: ICommandBarItemProps = {
                        key: button.key,
                        data: button,
                        iconProps: {
                            iconName: button.iconName,
                        },
                        onRenderIcon: isRtl && button.flipWhenRtl ? flipIcon : undefined,
                        iconOnly: true,
                        text: getLocalizedString(strings, button.key, button.unlocalizedText),
                        ariaLabel: getLocalizedString(strings, button.key, button.unlocalizedText),
                        canCheck: true,
                        checked: (formatState && button.isChecked?.(formatState)) || false,
                        disabled: (formatState && button.isDisabled?.(formatState)) || false,
                        ...(button.commandBarProperties || {}),
                    };

                    const contextMenuItemRenderer: IRenderFunction<IContextualMenuItem> = (
                        props,
                        defaultRenderer
                    ) =>
                        props && defaultRenderer ? (
                            <div onMouseOver={e => onHover(button, props.key)}>
                                {defaultRenderer(props)}
                            </div>
                        ) : null;

                    if (dropDownMenu) {
                        result.subMenuProps = {
                            shouldFocusOnMount: true,
                            focusZoneProps: { direction: FocusZoneDirection.bidirectional },
                            onMenuDismissed: onDismiss,
                            onItemClick: onClick,
                            onRenderContextualMenuItem: dropDownMenu.allowLivePreview
                                ? contextMenuItemRenderer
                                : undefined,
                            items: getObjectKeys(dropDownMenu.items).map(key => ({
                                key: key,
                                text: getLocalizedString<string, string>(
                                    strings,
                                    key,
                                    dropDownMenu.items[key]
                                ),
                                data: button,
                                canCheck: !!dropDownMenu.getSelectedItemKey,
                                checked: selectedItem == key || false,
                                className: dropDownMenu.itemClassName,
                                onRender: dropDownMenu.itemRender
                                    ? item => dropDownMenu.itemRender!(item, onClick)
                                    : undefined,
                            })),
                            ...(dropDownMenu.commandBarSubMenuProperties || {}),
                        };
                    } else {
                        result.onClick = onClick;
                    }

                    return result;
                }
            );
    }, [buttons, formatState, isRtl, strings, onClick, onDismiss, onHover, currentTab]);

    React.useEffect(() => {
        const disposer = plugin?.registerFormatChangedCallback(setFormatState);

        return () => {
            disposer?.();
        };
    }, [plugin]);

    const moreCommandsBtn = moreCommands as RibbonButton<string>;

    return (
        <>
            <CommandBar items={ribbonTabs}></CommandBar>
            <CommandBar
                items={commandBarItems}
                {...props}
                className={ribbonClassName + ' ' + (props?.className || '')}
                overflowButtonProps={{
                    ariaLabel: getLocalizedString<string, string>(
                        strings,
                        moreCommandsBtn.key,
                        moreCommandsBtn.unlocalizedText
                    ),
                    ...props?.overflowButtonProps,
                }}
            />
        </>
    );
}
