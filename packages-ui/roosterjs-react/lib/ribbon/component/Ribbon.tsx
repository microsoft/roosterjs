import * as React from 'react';
import getLocalizedString from '../../common/utils/getLocalizedString';
import RibbonButton from '../type/RibbonButton';
import RibbonProps from '../type/RibbonProps';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { FormatState } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { IContextualMenuItem, IContextualMenuItemProps } from '@fluentui/react/lib/ContextualMenu';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { moreCommands } from './buttons/moreCommands';
import type { IRenderFunction } from '@fluentui/react/lib/Utilities';

const ribbonClassName = mergeStyles({
    '& .ms-CommandBar': {
        padding: '0px',
    },
});

const rtlIcon = mergeStyles({
    transform: 'scaleX(-1)',
});

/**
 * The format ribbon component of roosterjs-react
 * @param props Properties of format ribbon component
 * @returns The format ribbon component
 */
export default function Ribbon<T extends string>(props: RibbonProps<T>) {
    const { plugin, buttons, strings, dir } = props;
    const [formatState, setFormatState] = React.useState<FormatState | null>(null);
    const isRtl = dir == 'rtl';

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
        return buttons.map(
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
    }, [buttons, formatState, isRtl, strings, onClick, onDismiss, onHover]);

    React.useEffect(() => {
        const disposer = plugin?.registerFormatChangedCallback(setFormatState);

        return () => {
            disposer?.();
        };
    }, [plugin]);

    const moreCommandsBtn = moreCommands as RibbonButton<string>;

    return (
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
    );
}
