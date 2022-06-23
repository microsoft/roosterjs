import * as React from 'react';
import EmojiPane, { EmojiPaneMode } from './EmojiPane';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Emoji } from '../type/Emoji';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Strings } from '../type/Strings';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';
import { UIUtilities } from '../../common/index';

/**
 * @internal
 * Emoji callout data
 */
interface EmojiICallOutPorps {
    cursorRect: DOMRect;
    strings: Strings;
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void;
    refreshCalloutDebounced: () => void;
    onModeChanged: (newMode: EmojiPaneMode) => void;
    paneRef: (ref: EmojiPane) => void;
    onHideCallout: () => void;
    searchPlaceholder?: string;
    searchInputAriaLabel?: string;
    dismiss: () => void;
}

function EmojiICallout(props: EmojiICallOutPorps) {
    const {
        cursorRect,
        strings,
        onSelectFromPane,
        onModeChanged,
        paneRef,
        onHideCallout,
        searchInputAriaLabel,
        searchPlaceholder,
        dismiss,
    } = props;
    const [isCalloutVisible, toggleIsCalloutVisible] = React.useState(true);
    const point = {
        x: cursorRect.left,
        y: (cursorRect.top + cursorRect.bottom) / 2,
    };
    const gap = (cursorRect.bottom - cursorRect.top) / 2 + 5;
    if (!isCalloutVisible) {
        onHideCallout();
    }
    const toogleCallout = () => {
        toggleIsCalloutVisible(false);
        dismiss();
    };
    const theme = useTheme();
    const classNames = getEmojiPaneClassName(theme);
    return (
        <>
            {isCalloutVisible && (
                <Callout
                    target={point}
                    directionalHint={DirectionalHint.bottomAutoEdge}
                    isBeakVisible={false}
                    gapSpace={gap}
                    onDismiss={toogleCallout}>
                    <EmojiPane
                        ref={paneRef}
                        classNames={classNames}
                        onSelect={onSelectFromPane}
                        onModeChanged={onModeChanged}
                        strings={strings || {}}
                        hideStatusBar={!strings}
                        searchDisabled={!strings}
                        searchInputAriaLabel={searchInputAriaLabel}
                        searchPlaceholder={searchPlaceholder}
                    />
                </Callout>
            )}
        </>
    );
}

/**
 * @internal
 * Enable emoji callout
 */

export default function showEmojiCallout(
    uiUtilities: UIUtilities,
    cursorRect: DOMRect,
    strings: Strings,
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void,
    refreshCalloutDebounced: () => void,
    onModeChanged: (newMode: EmojiPaneMode) => void,
    paneRef: (ref: EmojiPane) => void,
    onHideCallout: () => void,
    searchPlaceholder?: string,
    searchInputAriaLabel?: string
) {
    let disposer: (() => void) | null = null;
    const onDismiss = () => {
        disposer?.();
        disposer = null;
    };
    disposer = uiUtilities.renderComponent(
        <EmojiICallout
            cursorRect={cursorRect}
            strings={strings}
            onSelectFromPane={onSelectFromPane}
            refreshCalloutDebounced={refreshCalloutDebounced}
            onModeChanged={onModeChanged}
            paneRef={paneRef}
            onHideCallout={onHideCallout}
            searchPlaceholder={searchPlaceholder}
            searchInputAriaLabel={searchInputAriaLabel}
            dismiss={onDismiss}
        />
    );
}

const calcMaxHeight = () => {
    const buttonHeight = 40;
    const rowsOfIcons = 6; // including family bar if shown
    const bottomPaddingForContent = 5;
    const maxHeightForContent = rowsOfIcons * buttonHeight + bottomPaddingForContent;
    return maxHeightForContent.toString() + 'px';
};

const calcPaneWidth = () => {
    const buttonWidth = 40;
    const pivotItemCount = 7;
    const paneHorizontalPadding = 1;
    const paneWidth = buttonWidth * pivotItemCount + 2 * paneHorizontalPadding;
    return paneWidth.toString() + 'px';
};

const getEmojiPaneClassName = memoizeFunction((theme: Theme) => {
    const pallete = theme.palette;
    return mergeStyleSets({
        quickPicker: {
            overflowY: 'hidden',
            '.rooster-emoji-selected::after': {
                content: '',
                position: 'absolute',
                left: '0px',
                top: '0px',
                bottom: '0px',
                right: '0px',
                zIndex: 1,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(255, 255, 255)',
                borderImage: 'initial',
                outline: 'rgb(102, 102, 102) solid 1px',
            },
        },

        tooltip: {
            padding: '8px',
        },

        emojiTextInput: {
            padding: '6px',
        },

        partialList: {
            maxHeight: calcMaxHeight(),
            overflow: 'hidden',
            overflowY: 'scroll',
        },

        fullListContent: {
            width: calcPaneWidth(),
        },

        fullListBody: {
            maxHeight: calcMaxHeight(),
            overflow: 'hidden',
            overflowY: 'scroll',
            height: calcMaxHeight(),
        },

        fullList: {
            position: 'relative',
        },

        roosterEmojiPane: {
            padding: '1px',
            background: pallete.themeLight,
        },
    });
});
