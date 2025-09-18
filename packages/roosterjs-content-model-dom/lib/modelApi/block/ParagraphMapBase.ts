import { queryContentModelBlocks } from 'roosterjs-content-model-api/lib';
import type {
    ContentModelParagraph,
    ContentModelParagraphCommon,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

interface ParagraphWithMarker extends ContentModelParagraphCommon {
    _marker?: string;
}

/**
 * A base version of ParagraphMap that can store and retrieve paragraphs by their markers
 */
export class ParagraphMapBase {
    protected paragraphMap: { [key: string]: ReadonlyContentModelParagraph } = {};

    scanParagraphs(group: ReadonlyContentModelBlockGroup) {
        queryContentModelBlocks<ReadonlyContentModelParagraph>(group, 'Paragraph').forEach(
            paragraph => {
                const paragraphWithMarker = paragraph as ParagraphWithMarker;
                const marker = paragraphWithMarker._marker;

                if (marker) {
                    this.paragraphMap[marker] = paragraph;
                }
            }
        );
    }

    /**
     * Get paragraph using a previously marked paragraph
     * @param markedParagraph The previously marked paragraph to get
     */
    getParagraphFromMarker<T extends ReadonlyContentModelParagraph | ContentModelParagraph>(
        markerParagraph: T
    ): T | null {
        const marker = (markerParagraph as ParagraphWithMarker)._marker;

        return marker ? (this.paragraphMap[marker] as T) || null : null;
    }

    copyParagraphMarker(
        targetParagraph: ContentModelParagraph,
        sourceParagraph: ReadonlyContentModelParagraph
    ) {
        const sourceWithMarker = sourceParagraph as ParagraphWithMarker;
        const targetWithMarker = targetParagraph as ParagraphWithMarker;

        targetWithMarker._marker = sourceWithMarker._marker;
    }

    /**
     * Get the marker from a paragraph
     * @param paragraph The paragraph to get marker from
     * @returns The marker of the paragraph or undefined if not found
     */
    protected getMarkerFromParagraph(paragraph: ReadonlyContentModelParagraph): string | undefined {
        return (paragraph as ParagraphWithMarker)._marker;
    }

    /**
     * Set the marker to a paragraph
     * @param paragraph The paragraph to set marker to
     * @param marker The marker to set
     */
    protected setMarkerToParagraph(paragraph: ContentModelParagraph, marker: string) {
        (paragraph as ParagraphWithMarker)._marker = marker;
    }
}
