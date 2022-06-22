import * as React from 'react';
import EmojiPane, { EmojiPaneMode } from './EmojiPane';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Emoji } from '../type/Emoji';
import { EmojiStyle } from '../type/EmojiStyle';
import { Strings } from '../type/Strings';
import { UIUtilities } from '../../common/index';

/**
 * @internal
 * Emoji callout data
 */
interface EmojiICallOutPorps {
    calloutClassName: string;
    emojiStyle?: EmojiStyle;
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
        emojiStyle,
        cursorRect,
        strings,
        onSelectFromPane,
        paneRef,
        onHideCallout,
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
                        ref={paneRef}
                        onSelect={onSelectFromPane}
                        strings={strings || {}}
                        emojiStyle={emojiStyle}
                        hideStatusBar={!strings}
                        searchDisabled={!strings}
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
    calloutClassName: string,

    cursorRect: DOMRect,
    strings: Strings,
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void,
    refreshCalloutDebounced: () => void,
    onModeChanged: (newMode: EmojiPaneMode) => void,
    paneRef: (ref: EmojiPane) => void,
    onHideCallout: () => void,
    emojiStyle?: EmojiStyle
) {
    uiUtilities.renderComponent(
        <EmojiICallout
            calloutClassName={calloutClassName}
            emojiStyle={emojiStyle}
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
