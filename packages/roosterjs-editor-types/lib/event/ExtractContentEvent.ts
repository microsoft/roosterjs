import BasePluginEvent from './BasePluginEvent';
import PluginEventType from './PluginEventType';

/**
 * Represents a custom BasePluginEvent for extracting content
 */
interface ExtractContentEvent extends BasePluginEvent<PluginEventType.ExtractContent> {
    /**
     * Current content string
     * Plugin can change this string to clean up the markups it added before
     */
    content: string;
}

export default ExtractContentEvent;
