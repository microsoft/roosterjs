import * as React from 'react';
import EmojiPane, { EmojiPaneMode, EmojiPaneProps } from './EmojiPane';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Emoji } from '../type/Emoji';
import { Strings } from '../type/Strings';
import { UIUtilities } from '../../common/index';

interface EmojiICallOutPorps {
    calloutClassName: string;
    emojiPaneProps: EmojiPaneProps;
    cursorRect: DOMRect;
    strings: Strings;
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void;
    refreshCalloutDebounced: () => void;
    onModeChanged: (newMode: EmojiPaneMode) => void;
    paneRef: (ref: EmojiPane) => void;
    onHideCallout: () => void;
}

function EmojiICallout(props: EmojiICallOutPorps) {
    const {
        calloutClassName,
        emojiPaneProps,
        cursorRect,
        strings,
        onSelectFromPane,
        refreshCalloutDebounced,
        onModeChanged,
        paneRef,
        onHideCallout,
    } = props;
    const [isCalloutVisible, toggleIsCalloutVisible] = React.useState(true);
    const point = {
        x: cursorRect.right,
        y: (cursorRect.top + cursorRect.bottom) / 2,
    };
    const gap = (cursorRect.bottom - cursorRect.top) / 2 + 5;
    if (!isCalloutVisible) {
        onHideCallout();
    }
    const toogleCallout = () => {
        toggleIsCalloutVisible(false);
    };

    return (
        <>
            {isCalloutVisible && (
                <Callout
                    className={calloutClassName}
                    target={point}
                    directionalHint={DirectionalHint.bottomAutoEdge}
                    isBeakVisible={false}
                    gapSpace={gap}
                    onDismiss={toogleCallout}>
                    <EmojiPane
                        {...emojiPaneProps}
                        ref={paneRef}
                        onSelect={onSelectFromPane}
                        strings={strings || {}}
                        onLayoutChanged={refreshCalloutDebounced}
                        onModeChanged={onModeChanged}
                        navBarProps={emojiPaneProps.navBarProps}
                        statusBarProps={emojiPaneProps.statusBarProps}
                        searchDisabled={!strings || emojiPaneProps.searchDisabled}
                        hideStatusBar={!strings}
                    />
                </Callout>
            )}
        </>
    );
}

export default function showEmojiCallout(
    uiUtilities: UIUtilities,
    calloutClassName: string,
    emojiPaneProps: EmojiPaneProps,
    cursorRect: DOMRect,
    strings: Strings,
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void,
    refreshCalloutDebounced: () => void,
    onModeChanged: (newMode: EmojiPaneMode) => void,
    paneRef: (ref: EmojiPane) => void,
    onHideCallout: () => void
) {
    uiUtilities.renderComponent(
        <EmojiICallout
            calloutClassName={calloutClassName}
            emojiPaneProps={emojiPaneProps}
            cursorRect={cursorRect}
            strings={strings}
            onSelectFromPane={onSelectFromPane}
            refreshCalloutDebounced={refreshCalloutDebounced}
            onModeChanged={onModeChanged}
            paneRef={paneRef}
            onHideCallout={onHideCallout}
        />
    );
}
