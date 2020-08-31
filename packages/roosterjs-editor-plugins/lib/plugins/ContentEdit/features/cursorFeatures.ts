import { Browser, getComputedStyle, Position } from 'roosterjs-editor-dom';
import { ContentEditFeature, CursorFeatureSettings, Keys } from 'roosterjs-editor-types';

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

        let rtl = getComputedStyle(position.element, 'direction') == 'rtl';
        let rawEvent = event.rawEvent;

        return (!rtl && rawEvent.which == Keys.LEFT) || (rtl && rawEvent.which == Keys.RIGHT);
    },
    handleEvent: event => {
        event.rawEvent.preventDefault();
    },
    defaultDisabled: !Browser.isChrome,
};

/**
 * @internal
 */
export const CursorFeatures: Record<keyof CursorFeatureSettings, ContentEditFeature> = {
    noCycleCursorMove: NoCycleCursorMove,
};
