import * as React from 'react';
import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import RibbonProps from './RibbonProps';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { FormatState } from 'roosterjs-editor-types';
import {
    IContextualMenuItem,
    IContextualMenuItemProps,
    IContextualMenuItemRenderFunctions,
} from '@fluentui/react/lib/ContextualMenu';

/**
 * The format ribbon component of roosterjs-react
 * @param props Properties of format ribbon component
 * @returns The format ribbon component
 */
export default function Ribbon(props: RibbonProps) {
    const { plugin, buttons, strings, dir } = props;
    const isRtl = dir == 'rtl';
    const [formatState, setFormatState] = React.useState<FormatState>(null);

    const onClick = React.useCallback(
        (_, item: IContextualMenuItem) => {
            plugin?.onButtonClick(item.data as RibbonButton, item.key);
        },
        [plugin]
    );

    const onHover = React.useCallback(
        (button: RibbonButton, key: string) => {
            plugin.startLivePreview(button, key);
        },
        [plugin]
    );

    const onDismiss = React.useCallback(() => {
        plugin.stopLivePreview();
    }, [plugin]);

    const commandBarItems = React.useMemo((): ICommandBarItemProps[] => {
        return buttons.map(button => ({
            key: button.key,
            data: button,
            iconProps: {
                iconName: isRtl && button.rtlIconName ? button.rtlIconName : button.iconName,
            },
            iconOnly: true,
            text: getButtonText(button.key, button.unlocalizedText, strings),
            checked: (formatState && button.checked?.(formatState)) || false,
            disabled: (formatState && button.disabled?.(formatState)) || false,
            subMenuProps: button.dropDownItems
                ? {
                      onDismiss: onDismiss,
                      onItemClick: onClick,
                      items: Object.keys(button.dropDownItems).map(key => ({
                          key: key,
                          text: getButtonText(key, button.dropDownItems[key], strings),
                          data: button,
                          onRenderContent: button.allowLivePreview
                              ? (menuItemProps, defaultRenderers) => (
                                    <LivePreviewItem
                                        menuItemProps={menuItemProps}
                                        defaultRenderers={defaultRenderers}
                                        onHover={onHover}
                                    />
                                )
                              : undefined,
                      })),
                  }
                : undefined,
            onClick: button.dropDownItems ? undefined : onClick,
        }));
    }, [buttons, formatState, isRtl, strings, onClick, onDismiss, onHover]);

    React.useEffect(() => {
        const disposer = plugin?.registerFormatChangedCallback(setFormatState);

        return () => {
            disposer?.();
        };
    }, [plugin]);

    return <CommandBar items={commandBarItems} {...props} />;
}

function LivePreviewItem(props: {
    menuItemProps: IContextualMenuItemProps;
    defaultRenderers: IContextualMenuItemRenderFunctions;
    onHover: (button: RibbonButton, key: string) => void;
}) {
    const { menuItemProps, defaultRenderers, onHover } = props;
    return (
        <div
            onMouseOver={() => {
                onHover(menuItemProps.item.data as RibbonButton, menuItemProps.item.key);
            }}
            style={{
                width: '100%',
                height: '36px',
                overflow: 'hidden',
            }}>
            {defaultRenderers.renderItemName(menuItemProps)}
        </div>
    );
}

function getButtonText(
    key: string,
    unlocalizedText: string,
    strings?: Record<string, string | (() => string)>
) {
    const str = strings?.[key];

    if (typeof str == 'function') {
        return str();
    } else if (typeof str == 'string') {
        return str;
    } else {
        return unlocalizedText;
    }
}
