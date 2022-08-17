import * as React from 'react';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Emoji } from '../type/Emoji';
import { EmojiPane, showEmojiPane } from './EmojiPane';
import { EmojiStringKeys } from '../type/EmojiStringKeys';
import { LocalizedStrings, UIUtilities } from '../../common/index';
import { renderReactComponent } from '../../common/utils/renderReactComponent';

/**
 * @internal
 * Emoji callout data
 */
interface EmojiICallOutProps {
    cursorRect: DOMRect;
    strings: Record<string, string>;
    onSelectFromPane: (emoji: Emoji, wordBeforeCursor: string) => void;
    paneRef: React.RefObject<EmojiPane>;
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

    return (
        <>
            {isCalloutVisible && (
                <Callout
                    target={point}
                    directionalHint={DirectionalHint.bottomAutoEdge}
                    isBeakVisible={false}
                    gapSpace={gap}
                    onDismiss={toogleCallout}>
                    {showEmojiPane(onSelectFromPane, strings, paneRef, baseId, searchBoxString)}
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
    paneRef: React.RefObject<EmojiPane>,
    emojiCalloutRef: React.RefObject<EmojiICallout>,
    onHideCallout: () => void,
    baseId: number,
    searchBoxString?: LocalizedStrings<EmojiStringKeys>
) {
    let disposer: (() => void) | null = null;
    const onDismiss = () => {
        disposer?.();
        disposer = null;
    };

    disposer = renderReactComponent(
        uiUtilities,
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
