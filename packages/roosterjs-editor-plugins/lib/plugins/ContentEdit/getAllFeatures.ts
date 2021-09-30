import { AutoLinkFeatures } from './features/autoLinkFeatures';
import { CursorFeatures } from './features/cursorFeatures';
import { EntityFeatures } from './features/entityFeatures';
import { ListFeatures } from './features/listFeatures';
import { MarkdownFeatures } from './features/markdownFeatures';
import { QuoteFeatures } from './features/quoteFeatures';
import { ShortcutFeatures } from './features/shortcutFeatures';
import { StructuredNodeFeatures } from './features/structuredNodeFeatures';
import { TableFeatures } from './features/tableFeatures';
import {
    BuildInEditFeature,
    ContentEditFeatureSettings,
    PluginEvent,
} from 'roosterjs-editor-types';

const allFeatures = {
    ...ListFeatures,
    ...QuoteFeatures,
    ...TableFeatures,
    ...StructuredNodeFeatures,
    ...AutoLinkFeatures,
    ...ShortcutFeatures,
    ...CursorFeatures,
    ...MarkdownFeatures,
    ...EntityFeatures,
};

/**
 * Get all content edit features provided by roosterjs
 */
export default function getAllFeatures(): Record<
    keyof ContentEditFeatureSettings,
    BuildInEditFeature<PluginEvent>
> {
    return allFeatures;
}
