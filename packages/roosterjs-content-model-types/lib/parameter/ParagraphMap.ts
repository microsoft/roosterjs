import type {
    ContentModelParagraph,
    ReadonlyContentModelParagraph,
} from '../contentModel/block/ContentModelParagraph';

/**
 * ParagraphMap is used to map a paragraph marker to a paragraph in the model.
 */
export interface ParagraphMap {
    /**
     * When create content model from DOM, assign a marker to a paragraph in the model.
     * This marker is used to identify the paragraph in the model.
     * If the DOM element does not have a marker, a new marker will be generated and assigned to the paragraph and write back to DOM.
     * @param element The DOM element to assign marker to
     * @param paragraph The paragraph in the model to assign marker to
     */
    assignMarkerToModel(element: HTMLElement, paragraph: ContentModelParagraph): void;

    /**
     * When create DOM elements from content model, assign a marker to a paragraph in the DOM.
     * This marker is used to identify the paragraph in the model.
     * @param element The DOM element to assign marker to
     * @param paragraph The paragraph in the model to assign marker to
     */
    applyMarkerToDom(element: HTMLElement, paragraph: ContentModelParagraph): void;

    /**
     * Clear cached marker map
     */
    clear(): void;
}

/**
 * A helper class to help find paragraph from its marker
 */
export interface ParagraphIndexer {
    /**
     * Get paragraph using a previously marked paragraph
     * @param paragraphWithMarker The paragraph with marker to find
     */
    getParagraphFromMarker(
        paragraphWithMarker: ReadonlyContentModelParagraph
    ): ReadonlyContentModelParagraph | null;
}
