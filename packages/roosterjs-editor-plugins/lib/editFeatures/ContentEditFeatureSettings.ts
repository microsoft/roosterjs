import AutoLinkFeatureSettings from './features/autoLinkFeatures';
import CursorFeatureSettings from './features/cursorFeatures';
import EntityFeatureSettings from './features/entityFeatures';
import ListFeatureSettings from './features/listFeatures';
import MarkdownFeatureSettings from './features/markdownFeatures';
import QuoteFeatureSettings from './features/quoteFeatures';
import ShortcutFeatureSettings from './features/shortcutFeatures';
import StructuredNodeFeatureSettings from './features/structuredNodeFeatures';
import TableFeatureSettings from './features/tableFeatures';

/**
 * A list to specify whether each of the listed content edit features is enabled
 */
export default interface ContentEditFeatureSettings
    extends ListFeatureSettings,
        QuoteFeatureSettings,
        TableFeatureSettings,
        StructuredNodeFeatureSettings,
        AutoLinkFeatureSettings,
        ShortcutFeatureSettings,
        CursorFeatureSettings,
        MarkdownFeatureSettings,
        EntityFeatureSettings {}
