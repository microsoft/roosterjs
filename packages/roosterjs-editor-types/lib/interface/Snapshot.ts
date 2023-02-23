import ModeIndependentColor from './ModeIndependentColor';
import { ContentMetadata } from './ContentMetadata';

/**
 * A serializable snapshot of editor content, including the html content and metadata
 */
export default interface Snapshot {
    /**
     * HTML content string
     */
    html: string;

    /**
     * Metadata of the editor content state
     */
    metadata: ContentMetadata | null;

    /**
     * Known colors for dark mode
     */
    knownColors: Readonly<ModeIndependentColor>[];
}
