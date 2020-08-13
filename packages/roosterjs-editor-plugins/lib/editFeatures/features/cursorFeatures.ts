import { Browser, isRtl, Position } from 'roosterjs-editor-dom';
import { ContentEditFeature, Keys } from 'roosterjs-editor-core';

const NoCycleCursorMove: ContentEditFeature = {
    keys: [Keys.LEFT, Keys.RIGHT],
    allowFunctionKeys: true,
    shouldHandleEvent: (event, editor, ctrlOrMeta) => {
        let range: Range;
        let position: Position;

        if (
            !ctrlOrMeta ||
            !(range = editor.getSelectionRange()) ||
            !range.collapsed ||
            !(position = Position.getStart(range)) ||
            !editor.isPositionAtBeginning(position)
        ) {
            return false;
        }

        let rtl = isRtl(position.element);
        let rawEvent = event.rawEvent;

        return (!rtl && rawEvent.which == Keys.LEFT) || (rtl && rawEvent.which == Keys.RIGHT);
    },
    handleEvent: event => {
        event.rawEvent.preventDefault();
    },
    defaultDisabled: !Browser.isChrome,
};

/**
 * Settings for cursor features
 */
export default interface CursorFeatureSettings {
    /**
     * Chrome may make the cursor move the then end of document if press Ctrl+Left at the beginning of document
     * Let's disable this behaivor
     * @default true
     */
    noCycleCursorMove: boolean;
}

/**
 * @internal
 */
export const CursorFeatures: Record<keyof CursorFeatureSettings, ContentEditFeature> = {
    noCycleCursorMove: NoCycleCursorMove,
};
