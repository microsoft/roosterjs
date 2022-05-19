import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import getLocalizedString from '../../common/utils/getLocalizedString';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { resetImage, resizeByPercentage } from 'roosterjs-editor-plugins/lib/ImageEdit';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setImageAltText } from 'roosterjs-editor-api';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import {
    ExperimentalFeatures,
    IEditor,
    ImageEditOperation,
    EditorPlugin,
    Keys,
} from 'roosterjs-editor-types';
import {
    canRegenerateImage,
    setEditingImage,
    hasImageEditPlugin,
} from 'roosterjs-editor-plugins/lib/ImageEdit';

const ImageAltTextMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageAltText',
    unlocalizedText: 'Add alternate text',
    onClick: (_, editor, node, strings) => {
        const doc = editor.getDocument();
        let div = doc.createElement('div');
        doc.body.appendChild(div);
        const onDismiss = () => {
            ReactDOM.unmountComponentAtNode(div);
            doc.body.removeChild(div);
            div = null;
        };

        ReactDOM.render(
            <SetAltTextDialog
                editor={editor}
                image={node as HTMLImageElement}
                onDismiss={onDismiss}
                strings={strings}
            />,
            div
        );
    },
};

const ImageResizeMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageResize',
    unlocalizedText: 'Size',
    subItems: {
        menuNameImageSizeBestFit: 'Best fit',
        menuNameImageSizeSmall: 'Small',
        menuNameImageSizeMedium: 'Medium',
        menuNameImageSizeOriginal: 'Original',
    },
    onClick: (key, editor, node) => {
        editor.addUndoSnapshot(() => {
            let percentage = 0;
            switch (key) {
                case 'menuNameImageSizeSmall':
                    percentage = 0.25;
                    break;
                case 'menuNameImageSizeMedium':
                    percentage = 0.5;
                    break;
                case 'menuNameImageSizeOriginal':
                    percentage = 1;
                    break;
            }

            if (percentage > 0) {
                resizeByPercentage(
                    editor,
                    node as HTMLImageElement,
                    percentage,
                    10 /*minWidth*/,
                    10 /*minHeight*/
                );
            } else {
                resetImage(editor, node as HTMLImageElement);
            }
        });
    },
};

const ImageCropMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCrop',
    unlocalizedText: 'Crop image',
    shouldShow: (editor, node) => {
        return (
            editor.isFeatureEnabled(ExperimentalFeatures.ImageCrop) &&
            canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (_, editor, node) => {
        setEditingImage(editor, node as HTMLImageElement, ImageEditOperation.Crop);
    },
};

const ImageRemoveMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageRemove',
    unlocalizedText: 'Remove image',
    onClick: (_, editor, node) => {
        if (editor.contains(node)) {
            editor.addUndoSnapshot(() => {
                editor.deleteNode(node);
                setEditingImage(editor, null /*editingImage*/);
            }, 'DeleteImage');
        }
    },
};

const classNames = mergeStyleSets({
    valueInput: {
        width: '100%',
        minWidth: '250px',
        height: '32px',
        margin: '5px 0',
        border: '1px solid black',
        borderRadius: '2px',
        padding: '0 0 0 5px',
    },
});

function SetAltTextDialog(props: {
    editor: IEditor;
    image: HTMLImageElement;
    onDismiss: () => void;
    strings: LocalizedStrings<ImageEditMenuItemStringKey>;
}) {
    const { editor, image, onDismiss, strings } = props;
    const [value, setValue] = React.useState(image.alt || '');
    const valueInput = React.useRef<HTMLInputElement>();
    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: getLocalizedString(strings, 'menuNameImageAltText', 'Set numbering value'),
    };

    const onOk = React.useCallback(() => {
        onDismiss();
        editor.focus();
        editor.select(image);

        setImageAltText(editor, value);
    }, [onDismiss, editor, image, value]);

    const onCancel = React.useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    const onValueChanged = React.useCallback(() => {
        setValue(valueInput.current.value);
    }, [valueInput.current, setValue]);

    const onKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.which == Keys.ENTER) {
                onOk();
            }
        },
        [onOk]
    );

    return (
        <WindowProvider window={editor.getDocument().defaultView}>
            <Dialog dialogContentProps={dialogContentProps} hidden={false} onDismiss={onCancel}>
                <div>
                    <input
                        id="valueInput"
                        ref={valueInput}
                        role="textbox"
                        type="text"
                        className={classNames.valueInput}
                        value={value}
                        onChange={onValueChanged}
                        onKeyPress={onKeyPress}
                        autoFocus={true}
                    />
                </div>
                <DialogFooter>
                    <PrimaryButton
                        text={getLocalizedString(strings, 'buttonNameOK', 'OK')}
                        onClick={onOk}
                    />
                    <DefaultButton
                        text={getLocalizedString(strings, 'buttonNameCancel', 'Cancel')}
                        onClick={onCancel}
                    />
                </DialogFooter>
            </Dialog>
        </WindowProvider>
    );
}

function shouldShowImageEditItems(editor: IEditor, node: Node) {
    return (
        safeInstanceOf(node, 'HTMLImageElement') &&
        node.isContentEditable &&
        hasImageEditPlugin(editor)
    );
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createListEditMenuProvider(
    strings?: LocalizedStrings<ImageEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'imageEdit',
        [ImageAltTextMenuItem, ImageResizeMenuItem, ImageCropMenuItem, ImageRemoveMenuItem],
        strings,
        shouldShowImageEditItems
    );
}
