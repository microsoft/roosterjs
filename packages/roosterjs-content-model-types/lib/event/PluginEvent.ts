import type { BeforeCutCopyEvent } from './BeforeCutCopyEvent';
import type { BeforeDisposeEvent } from './BeforeDisposeEvent';
import type { BeforeKeyboardEditingEvent } from './BeforeKeyboardEditingEvent';
import type { BeforePasteEvent } from './BeforePasteEvent';
import type { BeforeSetContentEvent } from './BeforeSetContentEvent';
import type { ContentChangedEvent } from './ContentChangedEvent';
import type { ContextMenuEvent } from './ContextMenuEvent';
import type { EditImageEvent } from './EditImageEvent';
import type { EditorInputEvent } from './EditorInputEvent';
import type { EditorReadyEvent } from './EditorReadyEvent';
import type { EntityOperationEvent } from './EntityOperationEvent';
import type { ExtractContentWithDomEvent } from './ExtractContentWithDomEvent';
import type { CompositionEndEvent, KeyDownEvent, KeyPressEvent, KeyUpEvent } from './KeyboardEvent';
import type { MouseDownEvent, MouseUpEvent } from './MouseEvent';
import type { ScrollEvent } from './ScrollEvent';
import type { SelectionChangedEvent } from './SelectionChangedEvent';
import type { EnterShadowEditEvent, LeaveShadowEditEvent } from './ShadowEditEvent';
import type { SnapshotLogicalRootEvent } from './SnapshotLogicalRootEvent';
import type { ZoomChangedEvent } from './ZoomChangedEvent';

/**
 * Editor plugin event interface
 */
export type PluginEvent =
    | BeforeCutCopyEvent
    | BeforeDisposeEvent
    | BeforeKeyboardEditingEvent
    | BeforePasteEvent
    | BeforeSetContentEvent
    | CompositionEndEvent
    | ContentChangedEvent
    | ContextMenuEvent
    | EditImageEvent
    | EditorReadyEvent
    | EnterShadowEditEvent
    | EntityOperationEvent
    | ExtractContentWithDomEvent
    | EditorInputEvent
    | KeyDownEvent
    | KeyPressEvent
    | KeyUpEvent
    | LeaveShadowEditEvent
    | MouseDownEvent
    | MouseUpEvent
    | ScrollEvent
    | SelectionChangedEvent
    | SnapshotLogicalRootEvent
    | ZoomChangedEvent;
