import addUniqueId from './utils/addUniqueId';
import {
    createRange,
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
/**
 * @internal
 * Select a image and save data of the selected range
 * @param image Image to select
 * @returns Selected image information
 */
export const selectImage: SelectImage = (core: EditorCore, image: HTMLImageElement | null) => {
    unselect(core);
    if (image) {
        const range = createRange(image);

        addUniqueId(image, IMAGE_ID);
        addUniqueId(core.contentDiv, CONTENT_DIV_ID);

        select(core, image);
        return {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            image: image,
            areAllCollapsed: range.collapsed,
        };
    }

    return null;
};

const select = (core: EditorCore, image: HTMLImageElement) => {
    const borderCSS = buildBorderCSS(core, image.id);
    setGlobalCssStyles(core.contentDiv.ownerDocument, borderCSS, STYLE_ID + core.contentDiv.id);
};

const buildBorderCSS = (core: EditorCore, imageId: string): string => {
    const borderColor = core.imageSelectionBorderColor || '#DB626C';
    return (
        '#' +
        core.contentDiv.id +
        ' #' +
        imageId +
        ' { margin: -2px; border: 2px solid' +
        borderColor +
        ' !important; }'
    );
};

const unselect = (core: EditorCore) => {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, STYLE_ID + core.contentDiv.id);
};
