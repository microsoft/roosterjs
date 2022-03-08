import * as React from 'react';
import getLocalizedString from '../../utils/getLocalizedString';
import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import RibbonProps from './RibbonProps';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { FormatState } from 'roosterjs-editor-types';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const ribbonClassName = mergeStyles({
    '& .ms-CommandBar': {
        padding: '0px',
    },
});

/**
 * The format ribbon component of roosterjs-react
 * @param props Properties of format ribbon component
 * @returns The format ribbon component
 */
export default function Ribbon<T extends string>(props: RibbonProps<T>) {
    const { plugin, buttons, strings, dir } = props;
    const [formatState, setFormatState] = React.useState<FormatState>(null);
    const isRtl = dir == 'rtl';

    const onClick = React.useCallback(
        (_, item: IContextualMenuItem) => {
            plugin?.onButtonClick(item.data as RibbonButton<T>, item.key, strings);
        },
        [plugin, strings]
    );

    const onHover = React.useCallback(
        (button: RibbonButton<T>, key: string) => {
            plugin.startLivePreview(button, key, strings);
        },
        [plugin, strings]
    );

    const onDismiss = React.useCallback(() => {
        plugin.stopLivePreview();
    }, [plugin]);

    const commandBarItems = React.useMemo((): ICommandBarItemProps[] => {
        return buttons.map(
            (button): ICommandBarItemProps => {
                const selectedItem = formatState && button.selectedItem?.(formatState);
                const dropDownItems = button.dropDownItems;

                const result: ICommandBarItemProps = {
                    key: button.key,
                    data: button,
                    iconProps: {
                        iconName:
                            isRtl && button.rtlIconName ? button.rtlIconName : button.iconName,
                    },
                    iconOnly: true,
                    text: getLocalizedString(strings, button.key, button.unlocalizedText),
                    canCheck: true,
                    checked: (formatState && button.checked?.(formatState)) || false,
                    disabled: (formatState && button.disabled?.(formatState)) || false,
                };

                if (dropDownItems) {
                    result.subMenuProps = {
                        className: button.dropDownClassName,
                        shouldFocusOnMount: true,
                        focusZoneProps: { direction: FocusZoneDirection.bidirectional },
                        onDismiss: onDismiss,
                        onItemClick: onClick,
                        onRenderContextualMenuItem: button.allowLivePreview
                            ? (props, defaultRenderer) => (
                                  <div onMouseOver={e => onHover(button, props.key)}>
                                      {defaultRenderer(props)}
                                  </div>
                              )
                            : undefined,
                        items: Object.keys(button.dropDownItems).map(key => ({
                            key: key,
                            text: getLocalizedString(strings, key, dropDownItems[key]),
                            data: button,
                            canCheck: !!button.selectedItem,
                            checked: selectedItem == key || false,
                            className: button.itemClassName,
                            onRender: button.dropDownItemRender
                                ? item => button.dropDownItemRender(item, onClick)
                                : undefined,
                        })),
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

    return (
        <CommandBar
            items={commandBarItems}
            {...props}
            className={ribbonClassName + ' ' + (props?.className || '')}
        />
    );
}
