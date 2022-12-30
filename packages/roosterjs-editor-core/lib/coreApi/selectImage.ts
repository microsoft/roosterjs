import {
    addUniqueId,
    createRange,
    getUniqueId,
    getUniqueIdQuerySelector,
    Position,
    removeGlobalCssStyle,
    removeImportantStyleRule,
    setGlobalCssStyles,
} from 'roosterjs-editor-dom';
import {
    EditorCore,
    ImageSelectionRange,
    PositionType,
    SelectImage,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

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
export const selectImage: SelectImage = (core: EditorCore, image: HTMLImageElement | null) => {
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

const select = (core: EditorCore, image: HTMLImageElement) => {
    removeImportantStyleRule(image, ['border', 'margin']);
    const borderCSS = buildBorderCSS(core, image);
    const divId = getUniqueId(core.contentDiv);
    setGlobalCssStyles(core.contentDiv.ownerDocument, borderCSS, STYLE_ID + divId);
};

const buildBorderCSS = (core: EditorCore, image: HTMLImageElement): string => {
    const divId = getUniqueId(core.contentDiv);
    const color = core.imageSelectionBorderColor || DEFAULT_SELECTION_BORDER_COLOR;
    const imageId = getUniqueId(image);
    return `div${getUniqueIdQuerySelector(divId)} img${getUniqueIdQuerySelector(
        imageId
    )} {outline-style: auto!important;outline-color: ${color}!important;caret-color: transparent!important;}`;
};

const unselect = (core: EditorCore) => {
    const doc = core.contentDiv.ownerDocument;
    const divId = getUniqueId(core.contentDiv);
    removeGlobalCssStyle(doc, STYLE_ID + divId);
};
