import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';
import { setImageBoxShadow } from 'roosterjs-content-model';

const STYLES_NAMES: Record<string, string> = {
    noShadow: 'noShadow',
    bottomRight: 'bottomRight',
    bottom: 'bottom',
    bottomLeft: 'bottomLeft',
    right: 'right',
    center: 'center',
    left: 'left',
    topRight: 'topRight',
    top: 'top',
    topLeft: 'topLeft',
};

const STYLES: Record<string, string> = {
    noShadow: '',
    bottomRight: '4px 4px 3px #aaaaaa',
    bottom: '0px 4px  3px 0px #aaaaaa',
    bottomLeft: '-4px 4px 3px 3px #aaaaaa',
    right: '4px 0px 3px 0px #aaaaaa',
    center: '0px 0px 3px 3px #aaaaaa',
    left: '-4px 0px 3px 0px #aaaaaa',
    topRight: '4px -4px 3px 3px #aaaaaa',
    top: '0px -4px 3px 0px #aaaaaa',
    topLeft: '-4px -4px 3px 0px #aaaaaa',
};

/**
 * @internal
 * "Image Shadow" button on the format ribbon
 */
export const imageBoxShadowButton: RibbonButton<'buttonNameImageBoxSHadow'> = {
    key: 'buttonNameImageBoxSHadow',
    unlocalizedText: 'Image Shadow',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: STYLES_NAMES,
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        if (isContentModelEditor(editor)) {
            setImageBoxShadow(editor, STYLES[size], STYLES[size].length ? '4px' : null);
        }
        return true;
    },
};
