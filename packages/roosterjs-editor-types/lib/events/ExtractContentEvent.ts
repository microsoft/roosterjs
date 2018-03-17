import PluginEvent from './PluginEvent'

/**
 * Represents a custom PluginEvent for extracting content
 */
interface ExtractContentEvent extends PluginEvent {
    /**
     * Current content string
     * Plugin can change this string to clean up the markups it added before
     */
    content: string;
}

export default ExtractContentEvent;
