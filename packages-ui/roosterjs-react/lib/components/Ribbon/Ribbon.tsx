import * as React from 'react';
import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import RibbonProps from './RibbonProps';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { FormatState } from 'roosterjs-editor-types';

/**
 * The format ribbon component of roosterjs-react
 * @param props Properties of format ribbon component
 * @returns The format ribbon component
 */
export default function Ribbon(props: RibbonProps) {
    const { plugin, buttons, strings, isRtl } = props;
    const [formatState, setFormatState] = React.useState<FormatState>(null);

    const onClick = React.useCallback(
        (item: RibbonButton) => {
            plugin?.onButtonClick(item);
        },
        [plugin]
    );

    const commandBarItems = React.useMemo(
        () =>
            buttons.map(
                (button): ICommandBarItemProps => {
                    return {
                        key: button.key,
                        iconProps: {
                            iconName:
                                isRtl && button.rtlIconName ? button.rtlIconName : button.iconName,
                        },
                        iconOnly: true,
                        text: getButtonText(button, strings),
                        checked: (formatState && button.checked?.(formatState)) || false,
                        disabled: (formatState && button.disabled?.(formatState)) || false,
                        onClick: () => onClick(button),
                        onRender: button.onRender,
                    };
                }
            ),
        [buttons, formatState, isRtl]
    );

    React.useEffect(() => {
        const disposer = plugin?.registerFormatChangedCallback(setFormatState);

        return () => {
            disposer?.();
        };
    }, [plugin]);

    return <CommandBar items={commandBarItems} dir={isRtl ? 'rtl' : 'ltr'} />;
}

function getButtonText(button: RibbonButton, strings?: Record<string, string | (() => string)>) {
    const str = strings?.[button.key];

    if (typeof str == 'function') {
        return str();
    } else if (typeof str == 'string') {
        return str;
    } else {
        return button.unlocalizedText;
    }
}
