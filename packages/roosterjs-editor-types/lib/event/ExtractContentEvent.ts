import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * @deprecated Use ExtractContentWithDomEvent instead
 * Represents a custom BasePluginEvent for extracting content
 */
export default interface ExtractContentEvent
    extends BasePluginEvent<PluginEventType.ExtractContent> {
    /**
     * Current content string
     * Plugin can change this string to clean up the markups it added before
     */
    content: string;
}
