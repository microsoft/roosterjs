import type {
    AnnounceData,
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelSegment,
    TableSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * Represents a Announce feature used in Announce Plugin.
 * If the Should Handle Callback returns announce data, it will be announced by using a aria-live region.
 */
export interface AnnounceFeature {
    /**
     * Whether to handle this feature, if returns Announce Data, will be announced, otherwise will do nothing.
     */
    tryGetAnnounceData: (
        path: ContentModelBlockGroup[],
        tableContext?: TableSelectionContext,
        block?: ContentModelBlock,
        segments?: ContentModelSegment[]
    ) => AnnounceData | null;

    /**
     * Keys handled in the current event
     */
    keys: string[];
}
