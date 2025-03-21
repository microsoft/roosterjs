import type {
    ContentModelParagraph,
    ContentModelParagraphCommon,
    IdGenerator,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
    ReadonlyTableSelectionContext,
} from 'roosterjs-content-model-types';

interface ElementWithMarker extends HTMLElement {
    __roosterjsParagraphMarker?: string;
}

interface ParagraphWithMarker extends ContentModelParagraphCommon {
    _marker?: string;
}

export function readOrCreateMarkerFromElement(
    element: HTMLElement,
    paragraph: ContentModelParagraph,
    idGenerator?: IdGenerator
) {
    const elementWithMarker = element as ElementWithMarker;
    const paragraphWithMarker = paragraph as ParagraphWithMarker;
    const marker = elementWithMarker.__roosterjsParagraphMarker;

    if (marker) {
        paragraphWithMarker._marker = marker;
    } else if (idGenerator) {
        paragraphWithMarker._marker = idGenerator.generate();

        writeMarkerToElement(element, paragraph);
    }
}

export function writeMarkerToElement(
    element: HTMLElement,
    paragraph: ContentModelParagraph,
    idGenerator?: IdGenerator
) {
    const elementWithMarker = element as ElementWithMarker;
    const paragraphWithMarker = paragraph as ParagraphWithMarker;

    if (!paragraphWithMarker._marker && idGenerator) {
        paragraphWithMarker._marker = idGenerator.generate();
    }

    const marker = paragraphWithMarker._marker;

    if (marker) {
        elementWithMarker.__roosterjsParagraphMarker = marker;
    }
}

export function findMarkedParagraphInModel(
    model: ReadonlyContentModelBlockGroup,
    paragraph: ReadonlyContentModelParagraph
):
    | [
          ReadonlyContentModelParagraph,
          ReadonlyContentModelBlockGroup[],
          ReadonlyTableSelectionContext | null
      ]
    | null {
    const marker = (paragraph as ParagraphWithMarker)._marker;

    return marker ? internalFindMarkedParagraph(model, marker, [model], null) : null;
}

function internalFindMarkedParagraph(
    group: ReadonlyContentModelBlockGroup,
    id: string,
    path: ReadonlyContentModelBlockGroup[],
    tableContext: ReadonlyTableSelectionContext | null
):
    | [
          ReadonlyContentModelParagraph,
          ReadonlyContentModelBlockGroup[],
          ReadonlyTableSelectionContext | null
      ]
    | null {
    for (let block of group.blocks) {
        switch (block.blockType) {
            case 'Paragraph':
                if ((block as ParagraphWithMarker)._marker == id) {
                    return [block as ReadonlyContentModelParagraph, path, tableContext];
                }
                break;

            case 'BlockGroup':
                path.unshift(block);

                const result = internalFindMarkedParagraph(block, id, path, tableContext);

                if (result) {
                    return result;
                }

                path.shift();
                break;

            case 'Table':
                for (let rowIndex = 0; rowIndex < block.rows.length; rowIndex++) {
                    const row = block.rows[rowIndex];

                    for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
                        const cell = row.cells[colIndex];
                        const result = internalFindMarkedParagraph(cell, id, path, {
                            colIndex,
                            rowIndex,
                            table: block,
                            isWholeTableSelected: false,
                        });

                        if (result) {
                            return result;
                        }
                    }
                }
                break;
        }
    }

    return null;
}
