import addUniqueId from './utils/addUniqueId';
import { PositionType, SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    createRange,
    Position,
    removeGlobalCssStyle,
    removeImportantStyleRule,
    setGlobalCssStyles,
} from 'roosterjs-editor-dom';
import type { ImageSelectionRange } from 'roosterjs-editor-types';
import type { SelectImage, StandaloneEditorCore } from 'roosterjs-content-model-types';

const IMAGE_ID = 'imageSelected';
const CONTENT_DIV_ID = 'contentDiv_';
const STYLE_ID = 'imageStyle';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';

/**
 * @internal
 * Select a image and save data of the selected range
 * @param image Image to select
 * @returns Selected image information
 */
export const selectImage: SelectImage = (core, image: HTMLImageElement | null) => {
    unselect(core);

    let selection: ImageSelectionRange | null = null;

    if (image) {
        const range = createRange(image);

        addUniqueId(image, IMAGE_ID);
        addUniqueId(core.contentDiv, CONTENT_DIV_ID);

        core.api.selectRange(core, createRange(new Position(image, PositionType.After)));

        select(core, image);

        selection = {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            image: image,
            areAllCollapsed: range.collapsed,
        };
    }

    return selection;
};

const select = (core: StandaloneEditorCore, image: HTMLImageElement) => {
    removeImportantStyleRule(image, ['border', 'margin']);
    const borderCSS = buildBorderCSS(core, image.id);
    setGlobalCssStyles(core.contentDiv.ownerDocument, borderCSS, STYLE_ID + core.contentDiv.id);
};

const buildBorderCSS = (core: StandaloneEditorCore, imageId: string): string => {
    const divId = core.contentDiv.id;
    const color = core.selection.imageSelectionBorderColor || DEFAULT_SELECTION_BORDER_COLOR;

    return `#${divId} #${imageId} {outline-style: auto!important;outline-color: ${color}!important;caret-color: transparent!important;}`;
};

const unselect = (core: StandaloneEditorCore) => {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, STYLE_ID + core.contentDiv.id);
};
