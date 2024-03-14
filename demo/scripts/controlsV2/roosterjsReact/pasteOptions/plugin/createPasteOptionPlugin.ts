import * as React from 'react';
import { ButtonKeys, Buttons } from '../utils/buttons';
import { ChangeSource, paste } from 'roosterjs-content-model-core';
import { ClipboardData, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { showPasteOptionPane } from '../component/showPasteOptionPane';
import type { PasteOptionPane } from '../component/showPasteOptionPane';
import type { LocalizedStrings, ReactEditorPlugin, UIUtilities } from '../../common/index';
import type { PasteOptionButtonKeys, PasteOptionStringKeys } from '../type/PasteOptionStringKeys';

class PasteOptionPlugin implements ReactEditorPlugin {
    private clipboardData: ClipboardData | null = null;
    private editor: IEditor | null = null;
    private uiUtilities: UIUtilities | null = null;
    private pasteOptionRef = React.createRef<PasteOptionPane>();

    constructor(private strings?: LocalizedStrings<PasteOptionStringKeys>) {}

    getName() {
        return 'PasteOption';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.pasteOptionRef.current?.dismiss();
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (event.eventType == 'scroll') {
            if (this.pasteOptionRef.current) {
                this.showPasteOptionPane();
            }
        } else if (this.pasteOptionRef.current) {
            this.handlePasteOptionPaneEvent(event);
        } else if (event.eventType == 'contentChanged') {
            if (event.source == ChangeSource.Paste) {
                const clipboardData = event.data as ClipboardData;

                // Only show paste option when we pasted HTML with some format
                if (clipboardData?.text && clipboardData.types?.indexOf('text/html') >= 0) {
                    this.clipboardData = clipboardData;
                    this.showPasteOptionPane();
                }
            }
        }
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }

    private handlePasteOptionPaneEvent(event: PluginEvent) {
        if (event.eventType == 'keyDown' && this.pasteOptionRef.current) {
            const selectedKey = this.pasteOptionRef.current.getSelectedKey();

            if (!selectedKey) {
                switch (event.rawEvent.key) {
                    case 'Control':
                        this.pasteOptionRef.current.setSelectedKey(ButtonKeys[0]);
                        cancelEvent(event.rawEvent);
                        break;

                    case 'Escape':
                        this.pasteOptionRef.current.dismiss();
                        cancelEvent(event.rawEvent);
                        break;

                    default:
                        this.pasteOptionRef.current.dismiss();
                        break;
                }
            } else {
                const keyboardEvent = event.rawEvent;

                if (keyboardEvent.key != 'Control' && keyboardEvent.ctrlKey) {
                    // Dismiss the paste option when pressing hotkey CTRL+<any key>
                    this.pasteOptionRef.current.dismiss();
                    return;
                }

                for (let i = 0; i < ButtonKeys.length; i++) {
                    const key = ButtonKeys[i];
                    const button = Buttons[key];
                    if (button.shortcut == String.fromCharCode(keyboardEvent.which)) {
                        this.onPaste(key);
                        cancelEvent(keyboardEvent);
                        return;
                    }
                }

                switch (keyboardEvent.key) {
                    case 'Escape':
                        this.pasteOptionRef.current.dismiss();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        const buttonCount = ButtonKeys.length;
                        const diff =
                            (keyboardEvent.key == 'ArrowRight') == this.uiUtilities?.isRightToLeft()
                                ? -1
                                : 1;
                        this.pasteOptionRef.current.setSelectedKey(
                            ButtonKeys[
                                (ButtonKeys.indexOf(selectedKey) + diff + buttonCount) % buttonCount
                            ]
                        );
                        break;
                    case 'Enter':
                        this.onPaste(selectedKey);
                        break;
                    case 'Control':
                        // Noop
                        break;
                    default:
                        this.pasteOptionRef.current.dismiss();
                        return;
                }

                cancelEvent(keyboardEvent);
            }
        }
    }

    private onPaste = (key: PasteOptionButtonKeys) => {
        if (this.clipboardData && this.editor) {
            this.editor.focus();

            switch (key) {
                case 'pasteOptionPasteAsIs':
                    paste(this.editor, this.clipboardData);
                    break;

                case 'pasteOptionPasteText':
                    paste(this.editor, this.clipboardData, 'asPlainText');
                    break;

                case 'pasteOptionMergeFormat':
                    paste(this.editor, this.clipboardData, 'mergeFormat');
                    break;

                case 'pasteOptionPasteAsTextAndLinks':
                    paste(this.editor, this.clipboardData, 'asPlainTextWithClickableLinks');
                    break;

                case 'pasteOptionPasteAsImage':
                    paste(this.editor, this.clipboardData, 'asImage');
            }

            this.pasteOptionRef.current?.setSelectedKey(key);
        }
    };

    private showPasteOptionPane() {
        this.pasteOptionRef.current?.dismiss();

        const selection = this.editor.getDOMSelection();

        if (selection?.type == 'range' && this.uiUtilities) {
            showPasteOptionPane(
                this.uiUtilities,
                selection.range.startContainer,
                selection.range.startOffset,
                this.onPaste,
                this.pasteOptionRef,
                this.strings
            );
        }
    }
}

function cancelEvent(event: UIEvent) {
    event.preventDefault();
    event.stopPropagation();
}

/**
 * Create a new instance of PasteOption plugin to show an option pane when paste, so that user can choose
 * an option to change the paste result, including:
 * - Paste as is
 * - Paste as text
 * - Paste and merge format
 * @param strings Localized string for this plugin
 * @returns A paste option plugin
 */
export function createPasteOptionPlugin(
    strings?: LocalizedStrings<PasteOptionStringKeys>
): ReactEditorPlugin {
    return new PasteOptionPlugin(strings);
}
