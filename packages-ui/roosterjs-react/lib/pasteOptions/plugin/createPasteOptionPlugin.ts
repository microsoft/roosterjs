import * as React from 'react';
import showPasteOptionPane, { PasteOptionPane } from '../component/showPasteOptionPane';
import { ButtonKeys, Buttons } from '../utils/buttons';
import { ClipboardData, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { LocalizedStrings, ReactEditorPlugin, UIUtilities } from '../../common/index';
import { PasteOptionButtonKeys, PasteOptionStringKeys } from '../type/PasteOptionStringKeys';

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
        if (event.eventType == PluginEventType.Scroll) {
            if (this.pasteOptionRef.current) {
                this.showPasteOptionPane();
            }
        } else if (this.pasteOptionRef.current) {
            this.handlePasteOptionPaneEvent(event);
        } else if (event.eventType == PluginEventType.ContentChanged) {
            if (event.source == 'Paste') {
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
        if (event.eventType == PluginEventType.KeyDown && this.pasteOptionRef.current) {
            const selectedKey = this.pasteOptionRef.current.getSelectedKey();

            if (!selectedKey) {
                switch (event.rawEvent.which) {
                    case Keys.CTRL_LEFT:
                        this.pasteOptionRef.current.setSelectedKey(ButtonKeys[0]);
                        cancelEvent(event.rawEvent);
                        break;

                    case Keys.ESCAPE:
                        this.pasteOptionRef.current.dismiss();
                        cancelEvent(event.rawEvent);
                        break;

                    default:
                        this.pasteOptionRef.current.dismiss();
                        break;
                }
            } else {
                const keyboardEvent = event.rawEvent;

                if (keyboardEvent.which != Keys.CTRL_LEFT && keyboardEvent.ctrlKey) {
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

                switch (keyboardEvent.which) {
                    case Keys.ESCAPE:
                        this.pasteOptionRef.current.dismiss();
                        break;
                    case Keys.LEFT:
                    case Keys.RIGHT:
                        const buttonCount = ButtonKeys.length;
                        const diff =
                            (keyboardEvent.which == Keys.RIGHT) == this.uiUtilities?.isRightToLeft()
                                ? -1
                                : 1;
                        this.pasteOptionRef.current.setSelectedKey(
                            ButtonKeys[
                                (ButtonKeys.indexOf(selectedKey) + diff + buttonCount) % buttonCount
                            ]
                        );
                        break;
                    case Keys.ENTER:
                        this.onPaste(selectedKey);
                        break;
                    case Keys.CTRL_LEFT:
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
                    this.editor.paste(this.clipboardData);
                    break;

                case 'pasteOptionPasteText':
                    this.editor.paste(this.clipboardData, true /*pasteAsText*/);
                    break;

                case 'pasteOptionMergeFormat':
                    this.editor.paste(
                        this.clipboardData,
                        false /*pasteAsText*/,
                        true /*applyCurrentFormat*/
                    );
                    break;
                case 'pasteOptionPasteAsImage':
                    this.editor.paste(
                        this.clipboardData,
                        false /*pasteAsText*/,
                        false /*applyCurrentFormat*/,
                        true /** pasteAsImage **/
                    );
            }

            this.pasteOptionRef.current?.setSelectedKey(key);
        }
    };

    private showPasteOptionPane() {
        this.pasteOptionRef.current?.dismiss();

        const focusedPosition = this.editor?.getFocusedPosition();

        if (focusedPosition && this.uiUtilities) {
            showPasteOptionPane(
                this.uiUtilities,
                focusedPosition,
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
export default function createPasteOptionPlugin(
    strings?: LocalizedStrings<PasteOptionStringKeys>
): ReactEditorPlugin {
    return new PasteOptionPlugin(strings);
}
