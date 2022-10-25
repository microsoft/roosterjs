import * as React from 'react';
import { ButtonKeys, Buttons } from '../utils/buttons';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { getLocalizedString, LocalizedStrings, UIUtilities } from '../../common/index';
import { getObjectKeys, getPositionRect } from 'roosterjs-editor-dom';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { renderReactComponent } from '../../common/utils/renderReactComponent';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';
import type { PasteOptionButtonKeys, PasteOptionStringKeys } from '../type/PasteOptionStringKeys';
import type { NodePosition } from 'roosterjs-editor-types';

const getPasteOptionClassNames = memoizeFunction((theme: Theme) => {
    const palette = theme.palette;

    return mergeStyleSets({
        pastePane: {
            paddingLeft: '4px',
            minWidth: '72px',
        },
        optionPane: {
            textAlign: 'center',
            padding: '4px',
        },
        icon: {
            fontSize: '14px',
        },
        buttonsContainer: {
            justifyContent: 'center',
            display: 'flex',
        },
        button: {
            width: '32px',
            height: '32px',
            margin: '0 4px 4px 0',
            borderRadius: '2px',
            flex: '0 0 auto',
            '&:hover': {
                backgroundColor: palette.themeLighter,
            },
        },
        isChecked: {
            backgroundColor: palette.themeLight,
            '&:hover': {
                backgroundColor: palette.themeLighter,
            },
        },
    });
});

interface PasteOptionButtonProps {
    buttonName: PasteOptionButtonKeys;
    className: string;
    paste: (key: PasteOptionButtonKeys) => void;
    strings?: LocalizedStrings<PasteOptionStringKeys>;
}

function PasteOptionButton(props: PasteOptionButtonProps) {
    const { buttonName, paste, strings, className } = props;
    const button = Buttons[buttonName];
    const onClick = React.useCallback(() => {
        paste(buttonName);
    }, [paste, buttonName]);

    return (
        <IconButton
            className={className}
            onClick={onClick}
            title={
                getLocalizedString(strings, buttonName, button.unlocalizedText) +
                (button.shortcut ? ` (${button.shortcut})` : '')
            }
            iconProps={{ iconName: button.icon }}
        />
    );
}

interface PasteOptionProps {
    strings?: LocalizedStrings<PasteOptionStringKeys>;
    position: NodePosition;
    isRtl: boolean;
    paste: (key: PasteOptionButtonKeys) => void;
    dismiss: () => void;
}

/**
 * @internal
 */
export interface PasteOptionPane {
    getSelectedKey: () => PasteOptionButtonKeys | null;
    setSelectedKey: (index: PasteOptionButtonKeys) => void;
    dismiss: () => void;
}

const PasteOptionComponent = React.forwardRef(function PasteOptionFunc(
    props: PasteOptionProps,
    ref: React.Ref<PasteOptionPane>
) {
    const { strings, position, paste, dismiss, isRtl } = props;
    const theme = useTheme();
    const classNames = getPasteOptionClassNames(theme);
    const [selectedKey, setSelectedKey] = React.useState<PasteOptionButtonKeys | null>(null);

    const rect = position && getPositionRect(position);
    const target = rect && { x: props.isRtl ? rect.left : rect.right, y: rect.bottom };

    React.useImperativeHandle(
        ref,
        () => ({
            dismiss,
            setSelectedKey,
            getSelectedKey: () => selectedKey,
        }),
        [dismiss, paste, isRtl, selectedKey, setSelectedKey]
    );

    const buttonPane = React.useRef<HTMLDivElement>(null);
    const onDismiss = React.useCallback(
        (evt?: Event | React.MouseEvent | React.KeyboardEvent) => {
            const target =
                evt instanceof FocusEvent && evt.relatedTarget instanceof Node
                    ? evt.relatedTarget
                    : null;
            const clickOnButtonPane =
                target &&
                buttonPane.current &&
                (buttonPane.current == target || buttonPane.current.contains(target));
            if (!clickOnButtonPane) {
                dismiss();
            }
        },
        [dismiss]
    );

    const onClickShowSubMenu = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            setSelectedKey(ButtonKeys[0]);
            event.preventDefault();
            event.stopPropagation();
        },
        [setSelectedKey]
    );

    return (
        <Callout
            gapSpace={10}
            isBeakVisible={false}
            target={target}
            directionalHint={
                isRtl ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge
            }
            directionalHintForRTL={DirectionalHint.bottomRightEdge}
            preventDismissOnScroll={true}
            onDismiss={onDismiss}>
            <div ref={buttonPane} className={classNames.pastePane}>
                <div onClick={onClickShowSubMenu} className={classNames.optionPane}>
                    <Icon iconName={'Paste'} className={classNames.icon} />
                    {getLocalizedString(strings, 'pasteOptionPaneText', '(Ctrl)')}
                </div>
                {selectedKey && (
                    <div className={classNames.buttonsContainer}>
                        {getObjectKeys(Buttons).map(key => (
                            <PasteOptionButton
                                key={key}
                                strings={strings}
                                paste={paste}
                                buttonName={key}
                                className={
                                    classNames.button +
                                    ' ' +
                                    (selectedKey == key ? classNames.isChecked : '')
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </Callout>
    );
});

/**
 * @internal Show paste open pane component
 * @param uiUtilities The UI utilities object to help render component
 * @param position Target position
 * @param strings Localize string for this component
 * @param onPaste A callback to be called when user click on a paste button
 * @param ref Reference object for this component
 */
export default function showPasteOptionPane(
    uiUtilities: UIUtilities,
    position: NodePosition,
    onPaste: (key: PasteOptionButtonKeys) => void,
    ref: React.RefObject<PasteOptionPane>,
    strings?: LocalizedStrings<PasteOptionStringKeys>
) {
    let disposer: (() => void) | null = null;
    const onDismiss = () => {
        disposer?.();
        disposer = null;
    };

    disposer = renderReactComponent(
        uiUtilities,
        <PasteOptionComponent
            ref={ref}
            position={position}
            strings={strings}
            isRtl={uiUtilities.isRightToLeft()}
            dismiss={onDismiss}
            paste={onPaste}
        />
    );
}
