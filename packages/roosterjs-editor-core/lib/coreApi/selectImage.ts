import addSelectionStyle from './utils/addSelectionStyle';
import addUniqueId from './utils/addUniqueId';
import { createRange, Position, removeImportantStyleRule } from 'roosterjs-editor-dom';
import {
    EditorCore,
    ImageSelectionRange,
    PluginEventType,
    PositionType,
    SelectImage,
    SelectionRangeEx,
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

        core.api.selectRange(core, createRange(new Position(image, PositionType.After)));

        select(core, image);

        const selection: ImageSelectionRange = {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            image: image,
            areAllCollapsed: range.collapsed,
        };

        core.domEvent.imageSelectionRange = selection;

        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: selection as SelectionRangeEx,
            },
            true /** broadcast */
        );
    }

    return null;
};

const select = (core: EditorCore, image: HTMLImageElement) => {
    removeImportantStyleRule(image, ['border', 'margin']);
    const borderCSS = buildBorderCSS(core, image.id);
    addSelectionStyle(core, borderCSS, STYLE_ID);
};

const buildBorderCSS = (core: EditorCore, imageId: string): string => {
    const borderColor = core.imageSelectionBorderColor || '#DB626C';
    return (
        '#' +
        core.contentDiv.id +
        ' #' +
        imageId +
        ' { margin: -2px !important; border: 2px solid' +
        borderColor +
        ' !important; }'
    );
};

const unselect = (core: EditorCore) => {
    const doc = core.contentDiv.ownerDocument;
    let styleTag = doc.getElementById(STYLE_ID + core.contentDiv.id) as HTMLStyleElement;
    if (styleTag) {
        doc.head.removeChild(styleTag);
    }
};
