import { getParagraphMarker, setParagraphMarker } from 'roosterjs-content-model-dom';
import type {
    ContentModelParagraph,
    ContentModelParagraphCommon,
    ParagraphIndexer,
    ParagraphMap,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

interface ParagraphWithMarker extends ContentModelParagraphCommon {
    _marker?: string;
}

/**
 * @internal, used by test code only
 */
export interface ParagraphMapReset {
    _reset(): void;
    _getMap(): { [key: string]: ReadonlyContentModelParagraph };
}

const idPrefix = 'paragraph';

class ParagraphMapImpl implements ParagraphMap, ParagraphIndexer, ParagraphMapReset {
    private static prefixNum = 0;
    private nextId = 0;
    private paragraphMap: { [key: string]: ReadonlyContentModelParagraph } = {};

    constructor() {
        ParagraphMapImpl.prefixNum++;
    }

    assignMarkerToModel(element: HTMLElement, paragraph: ContentModelParagraph): void {
        const marker = getParagraphMarker(element);
        const paragraphWithMarker = paragraph as ParagraphWithMarker;

        if (marker) {
            paragraphWithMarker._marker = marker;

            this.paragraphMap[marker] = paragraph;
        } else {
            paragraphWithMarker._marker = this.generateId();

            this.applyMarkerToDom(element, paragraph);
        }
    }

    applyMarkerToDom(element: HTMLElement, paragraph: ContentModelParagraph): void {
        const paragraphWithMarker = paragraph as ParagraphWithMarker;

        if (!paragraphWithMarker._marker) {
            paragraphWithMarker._marker = this.generateId();
        }

        const marker = paragraphWithMarker._marker;

        if (marker) {
            setParagraphMarker(element, marker);

            this.paragraphMap[marker] = paragraph;
        }
    }

    /**
     * Get paragraph using a previously marked paragraph
     * @param markedParagraph The previously marked paragraph to get
     */
    getParagraphFromMarker(
        markerParagraph: ReadonlyContentModelParagraph
    ): ReadonlyContentModelParagraph | null {
        const marker = (markerParagraph as ParagraphWithMarker)._marker;

        return marker ? this.paragraphMap[marker] || null : null;
    }

    clear() {
        this.paragraphMap = {};
    }

    //#region For test code only
    _reset() {
        ParagraphMapImpl.prefixNum = 0;
        this.nextId = 0;
    }

    _getMap() {
        return this.paragraphMap;
    }
    //#endregion

    private generateId() {
        return `${idPrefix}_${ParagraphMapImpl.prefixNum}_${this.nextId++}`;
    }
}

/**
 * @internal
 */
export function createParagraphMap(): ParagraphMap & ParagraphIndexer {
    return new ParagraphMapImpl();
}
