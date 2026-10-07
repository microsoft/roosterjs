import type { ContentModelBlock } from 'roosterjs-content-model-types';

/** Optional serializers, including for application-owned entities. */
export interface ModelToMarkdownOptions {
    /** Return Markdown for a block, or undefined to use the built-in serializer. */
    onBlock?: (block: ContentModelBlock) => string | undefined;
}
