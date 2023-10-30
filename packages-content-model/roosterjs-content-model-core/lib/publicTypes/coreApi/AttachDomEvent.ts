import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type { DOMEventHandler } from '../editor/DomEventHandler';

/**
 * @internal
 * Attach a DOM event to the editor content DIV
 * @param core The CoreEditorCore object
 * @param eventMap A map from event name to its handler
 */
export type AttachDomEvent = (
    core: CoreEditorCore,
    eventMap: Record<string, DOMEventHandler>
) => () => void;
