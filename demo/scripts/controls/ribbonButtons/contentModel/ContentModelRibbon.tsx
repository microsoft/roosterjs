import * as React from 'react';
import ContentModelRibbonButton from './ContentModelRibbonButton';
import RibbonPlugin from './RibbonPlugin';
import { alignCenterButton } from './alignCenterButton';
import { alignLeftButton } from './alignLeftButton';
import { alignRightButton } from './alignRightButton';
import { backgroundColorButton } from './backgroundColorButton';
import { blockQuoteButton } from './blockQuoteButton';
import { boldButton } from './boldButton';
import { bulletedListButton } from './bulletedListButton';
import { changeImageButton } from './changeImageButton';
import { clearFormatButton } from './clearFormatButton';
import { codeButton } from './codeButton';
import { CommandBar, ICommandBarItemProps, ICommandBarProps } from '@fluentui/react/lib/CommandBar';
import { darkMode } from './darkMode';
import { decreaseFontSizeButton } from './decreaseFontSizeButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { exportContent } from './export';
import { FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { fontButton } from './fontButton';
import { fontSizeButton } from './fontSizeButton';
import { formatPainterButton } from './formatPainterButton';
import { FormatState } from 'roosterjs-editor-types';
import { formatTableButton } from './formatTableButton';
import { getLocalizedString, LocalizedStrings } from 'roosterjs-react';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { IContextualMenuItem, IContextualMenuItemProps } from '@fluentui/react/lib/ContextualMenu';
import { imageBorderColorButton } from './imageBorderColorButton';
import { imageBorderRemoveButton } from './imageBorderRemoveButton';
import { imageBorderStyleButton } from './imageBorderStyleButton';
import { imageBorderWidthButton } from './imageBorderWidthButton';
import { imageBoxShadowButton } from './imageBoxShadowButton';
import { increaseFontSizeButton } from './increaseFontSizeButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertImageButton } from './insertImageButton';
import { insertLinkButton } from './insertLinkButton';
import { insertTableButton } from './insertTableButton';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { italicButton } from './italicButton';
import { listStartNumberButton } from './listStartNumberButton';
import { ltrButton } from './ltrButton';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { moreCommands } from './moreCommands';
import { numberedListButton } from './numberedListButton';
import { pasteButton } from './pasteButton';
import { popout } from './popout';
import { redoButton } from './redoButton';
import { removeLinkButton } from './removeLinkButton';
import { rtlButton } from './rtlButton';
import { setBulletedListStyleButton } from './setBulletedListStyleButton';
import { setHeadingLevelButton } from './setHeadingLevelButton';
import { setNumberedListStyleButton } from './setNumberedListStyleButton';
import { setTableCellShadeButton } from './setTableCellShadeButton';
import { setTableHeaderButton } from './setTableHeaderButton';
import { spaceAfterButton, spaceBeforeButton } from './spaceBeforeAfterButtons';
import { spacingButton } from './spacingButton';
import { strikethroughButton } from './strikethroughButton';
import { subscriptButton } from './subscriptButton';
import { superscriptButton } from './superscriptButton';
import { tableBorderApplyButton } from './tableBorderApplyButton';
import { tableBorderColorButton } from './tableBorderColorButton';
import { tableBorderStyleButton } from './tableBorderStyleButton';
import { tableBorderWidthButton } from './tableBorderWidthButton';
import { textColorButton } from './textColorButton';
import { underlineButton } from './underlineButton';
import { undoButton } from './undoButton';
import { zoom } from './zoom';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from './tableEditButtons';

const buttons: ContentModelRibbonButton<any>[] = [
    formatPainterButton,
    boldButton,
    italicButton,
    underlineButton,
    fontButton,
    fontSizeButton,
    increaseFontSizeButton,
    decreaseFontSizeButton,
    textColorButton,
    backgroundColorButton,
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    blockQuoteButton,
    alignLeftButton,
    alignCenterButton,
    alignRightButton,
    insertLinkButton,
    removeLinkButton,
    insertTableButton,
    insertImageButton,
    superscriptButton,
    subscriptButton,
    strikethroughButton,
    setHeadingLevelButton,
    codeButton,
    ltrButton,
    rtlButton,
    undoButton,
    redoButton,
    clearFormatButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    formatTableButton,
    setTableCellShadeButton,
    setTableHeaderButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
    tableBorderApplyButton,
    tableBorderColorButton,
    tableBorderWidthButton,
    tableBorderStyleButton,
    imageBorderColorButton,
    imageBorderWidthButton,
    imageBorderStyleButton,
    imageBorderRemoveButton,
    changeImageButton,
    imageBoxShadowButton,
    spacingButton,
    spaceBeforeButton,
    spaceAfterButton,
    pasteButton,
];

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
    buttons: ContentModelRibbonButton<T>[];

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
function Ribbon<T extends string>(props: RibbonProps<T>) {
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
        (button: ContentModelRibbonButton<T>, key: string) => {
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

    const moreCommandsBtn = moreCommands as ContentModelRibbonButton<string>;

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

export default function ContentModelRibbon(props: {
    ribbonPlugin: RibbonPlugin;
    isRtl: boolean;
    isInPopout: boolean;
}) {
    const { ribbonPlugin, isRtl, isInPopout } = props;
    const ribbonButtons = React.useMemo(() => {
        const result: ContentModelRibbonButton<any>[] = [...buttons, darkMode, zoom, exportContent];

        if (!isInPopout) {
            result.push(popout);
        }

        return result;
    }, [isInPopout]);

    return <Ribbon buttons={ribbonButtons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
