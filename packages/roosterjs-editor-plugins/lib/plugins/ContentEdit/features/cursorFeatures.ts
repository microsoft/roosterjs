import { Browser, getComputedStyle, Position } from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    CursorFeatureSettings,
    Keys,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';

const NoCycleCursorMove: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.LEFT, Keys.RIGHT],
    allowFunctionKeys: true,
    shouldHandleEvent: (event, editor, ctrlOrMeta) => {
        let range: Range | null = null;
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
export const CursorFeatures: Record<
    keyof CursorFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    noCycleCursorMove: NoCycleCursorMove,
};
