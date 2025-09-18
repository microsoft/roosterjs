import {
    getParagraphMarker,
    ParagraphMapBase,
    setParagraphMarker,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelParagraph,
    ParagraphIndexer,
    ParagraphMap,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal, used by test code only
 */
export interface ParagraphMapReset {
    _reset(): void;
    _getMap(): { [key: string]: ReadonlyContentModelParagraph };
}

const idPrefix = 'paragraph';

class ParagraphMapImpl extends ParagraphMapBase
    implements ParagraphMap, ParagraphIndexer, ParagraphMapReset {
    private static lastPrefixNum = 0;
    private prefix: string;
    private nextId = 0;

    constructor(idPrefix?: string | null) {
        super();

        this.prefix = idPrefix || (ParagraphMapImpl.lastPrefixNum++).toString();
    }

    assignMarkerToModel(element: HTMLElement, paragraph: ContentModelParagraph): void {
        const marker = getParagraphMarker(element);

        if (marker) {
            this.setMarkerToParagraph(paragraph, marker);

            this.paragraphMap[marker] = paragraph;
        } else {
            this.setMarkerToParagraph(paragraph, this.generateId());
            this.applyMarkerToDom(element, paragraph);
        }
    }

    applyMarkerToDom(element: HTMLElement, paragraph: ContentModelParagraph): void {
        if (!this.getMarkerFromParagraph(paragraph)) {
            this.setMarkerToParagraph(paragraph, this.generateId());
        }

        const marker = this.getMarkerFromParagraph(paragraph);

        if (marker) {
            setParagraphMarker(element, marker);

            this.paragraphMap[marker] = paragraph;
        }
    }

    clear() {
        this.paragraphMap = {};
    }

    //#region For test code only
    _reset() {
        ParagraphMapImpl.lastPrefixNum = 0;
        this.nextId = 0;
    }

    _getMap() {
        return this.paragraphMap;
    }
    //#endregion

    private generateId() {
        return `${idPrefix}_${this.prefix}_${this.nextId++}`;
    }
}

/**
 * @internal
 */
export function createParagraphMap(idPrefix?: string | null): ParagraphMap & ParagraphIndexer {
    return new ParagraphMapImpl(idPrefix);
}
