import * as React from 'react';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Emoji } from '../type/Emoji';
import { EmojiPane, showEmojiPane } from './EmojiPane';
import { EmojiStringKeys } from '../type/EmojiStringKeys';
import { LocalizedStrings, UIUtilities } from '../../common/index';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';

/**
 * @internal
 * Emoji callout data
 */
interface EmojiICallOutProps {
    cursorRect: DOMRect;
    strings: Record<string, string>;
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void;
    paneRef: (ref: EmojiPane) => void;
    onHideCallout: () => void;
    searchBoxString?: LocalizedStrings<EmojiStringKeys>;
    dismiss: () => void;
    baseId: number;
}

const EmojiICallout = React.forwardRef(function EmojiCalloutFunc(
    props: EmojiICallOutProps,
    ref: React.Ref<EmojiICallout>
) {
    const {
        cursorRect,
        strings,
        onSelectFromPane,
        onHideCallout,
        searchBoxString,
        dismiss,
        paneRef,
        baseId,
    } = props;
    const [isCalloutVisible, toggleIsCalloutVisible] = React.useState(true);

    React.useImperativeHandle(
        ref,
        () => ({
            dismiss,
        }),
        [dismiss]
    );

    const point = {
        x: cursorRect.left,
        y: (cursorRect.top + cursorRect.bottom) / 2,
    };
    const gap = (cursorRect.bottom - cursorRect.top) / 2 + 5;
    if (!isCalloutVisible) {
        onHideCallout();
    }
    const toogleCallout = React.useCallback(() => {
        toggleIsCalloutVisible(false);
        dismiss();
    }, [dismiss]);
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
                    {showEmojiPane(
                        onSelectFromPane,
                        strings,
                        classNames,
                        paneRef,
                        baseId,
                        searchBoxString
                    )}
                </Callout>
            )}
        </>
    );
});

/**
 * @internal
 */
export interface EmojiICallout {
    dismiss: () => void;
}

/**
 * @internal
 * Enable emoji callout
 */
export default function showEmojiCallout(
    uiUtilities: UIUtilities,
    cursorRect: DOMRect,
    strings: Record<string, string>,
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void,
    paneRef: (ref: EmojiPane) => void,
    emojiCalloutRef: (ref: EmojiICallout) => void,
    dismiss: () => void,
    onHideCallout: () => void,
    baseId: number,
    searchBoxString?: LocalizedStrings<EmojiStringKeys>
) {
    let disposer: (() => void) | null = null;
    const onDismiss = () => {
        disposer?.();
        disposer = null;
        dismiss();
    };

    disposer = uiUtilities.renderComponent(
        <EmojiICallout
            ref={emojiCalloutRef}
            cursorRect={cursorRect}
            strings={strings}
            onSelectFromPane={onSelectFromPane}
            paneRef={paneRef}
            onHideCallout={onHideCallout}
            searchBoxString={searchBoxString}
            baseId={baseId}
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
