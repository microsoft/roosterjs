import ContentModelBeforeCutCopyEvent from './ContentModelBeforeCutCopyEvent';
import ContentModelBeforeDisposeEvent from './ContentModelBeforeDisposeEvent';
import ContentModelBeforeKeyboardEditingEvent from './ContentModelBeforeKeyboardEditingEvent';
import ContentModelBeforePasteEvent from './ContentModelBeforePasteEvent';
import ContentModelContentChangedEvent from './ContentModelContentChangedEvent';
import ContentModelEditImageEvent from './ContentModelEditImageEvent';
import ContentModelEditorReadyEvent from './ContentModelEditorReadyEvent';
import ContentModelEntityOperationEvent from './ContentModelEntityOperationEvent';
import ContentModelSelectionChangeEvent from './ContentModelSelectionChangeEvent';
import ContentModelZoomChangedEvent from './ContentModelZoomChangedEvent';
import {
    ContentModelPluginCompositionEvent,
    ContentModelPluginContextMenuEvent,
    ContentModelPluginInputEvent,
    ContentModelPluginKeyDownEvent,
    ContentModelPluginKeyUpEvent,
    ContentModelPluginMouseDownEvent,
    ContentModelPluginMouseUpEvent,
    ContentModelPluginScrollEvent,
} from './ContentModelPluginDomEvent';
import {
    ContentModelEnterShadowEditEvent,
    ContentModelLeaveShadowEditEvent,
} from './ContentModelShadowEditEvent';

/**
 * Editor plugin event interface
 */
export type ContentModelPluginEvent =
    | ContentModelBeforeCutCopyEvent
    | ContentModelBeforePasteEvent
    | ContentModelContentChangedEvent
    | ContentModelEntityOperationEvent
    | ContentModelPluginCompositionEvent
    | ContentModelPluginMouseDownEvent
    | ContentModelPluginMouseUpEvent
    | ContentModelPluginContextMenuEvent
    | ContentModelPluginKeyDownEvent
    | ContentModelPluginKeyUpEvent
    | ContentModelPluginInputEvent
    | ContentModelPluginScrollEvent
    | ContentModelEditorReadyEvent
    | ContentModelBeforeDisposeEvent
    | ContentModelEnterShadowEditEvent
    | ContentModelLeaveShadowEditEvent
    | ContentModelEditImageEvent
    | ContentModelZoomChangedEvent
    | ContentModelContentChangedEvent
    | ContentModelSelectionChangeEvent
    | ContentModelBeforeKeyboardEditingEvent;
