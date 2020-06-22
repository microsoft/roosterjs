import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * Extract Content with a DOM tree event
 * This event is triggered when getContent() is called with triggerExtractContentEvent = true
 * Plugin can handle this event to remove the UI only markups to return clean HTML
 * by operating on a cloned DOM tree
 */
export default interface ExtractContentWithDomEvent
    extends BasePluginEvent<PluginEventType.ExtractContentWithDom> {
    /**
     * Cloned root element of editor
     * Plugin can change this DOM tree to clean up the markups it added before
     */
    clonedRoot: HTMLElement;
}
