import { ChangeSource, isCursorMovingKey, isPunctuation } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getQueryString } from './getQueryString';
import { PickerHelperImpl } from './PickerHelperImpl';
import type { PickerHandler } from './PickerHandler';
import type {
    DOMInsertPoint,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * PickerPlugin represents a plugin of editor which can handle picker related behaviors, including
 * - Show picker when special trigger key is pressed
 * - Hide picker
 * - Change selection in picker by Up/Down/Left/Right
 * - Apply selected item in picker
 *
 * PickerPlugin doesn't provide any UI, it just wraps related DOM events and invoke callback functions.
 */
export class PickerPlugin implements EditorPlugin {
    private isMac: boolean = false;
    private lastQueryString = '';
    private helper: PickerHelperImpl | null = null;

    /**
     * Construct a new instance of PickerPlugin class
     * @param triggerCharacter The character to trigger a picker to be shown
     * @param handler Picker handler for receiving picker state change events
     */
    constructor(private triggerCharacter: string, private readonly handler: PickerHandler) {}

    /**
     * Get a friendly name
     */
    getName() {
        return 'Picker';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.isMac = !!editor.getEnvironment().isMac;
        this.helper = new PickerHelperImpl(editor, this.handler, this.triggerCharacter);
        this.handler.onInitialize(this.helper);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.handler.onDispose();
        this.helper = null;
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        return (
            !!this.helper?.direction &&
            event.eventType == 'keyDown' &&
            (isCursorMovingKey(event.rawEvent) ||
                event.rawEvent.key == 'Enter' ||
                event.rawEvent.key == 'Tab' ||
                event.rawEvent.key == 'Escape')
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.helper) {
            return;
        }

        switch (event.eventType) {
            case 'contentChanged':
                if (this.helper.direction) {
                    if (event.source == ChangeSource.SetContent) {
                        this.helper.closePicker();
                    } else {
                        this.onSuggestingInput(this.helper);
                    }
                }
                break;

            case 'keyDown':
                if (this.helper.direction) {
                    this.onSuggestingKeyDown(this.helper, event.rawEvent);
                }
                break;

            case 'input':
                if (this.helper.direction) {
                    this.onSuggestingInput(this.helper);
                } else {
                    this.onInput(this.helper, event.rawEvent);
                }
                break;

            case 'mouseUp':
                if (this.helper.direction) {
                    this.helper.closePicker();
                }
                break;
        }
    }

    private onSuggestingKeyDown(helper: PickerHelperImpl, event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                if (helper.direction == 'horizontal' || helper.direction == 'both') {
                    let isIncrement = event.key == 'ArrowRight';

                    if (helper.editor.getDOMHelper().isRightToLeft()) {
                        isIncrement = !isIncrement;
                    }

                    this.handler.onSelectionChanged?.(isIncrement ? 'next' : 'previous');
                }

                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                {
                    const isIncrement = event.key == 'ArrowDown';

                    if (helper.direction != 'horizontal') {
                        this.handler.onSelectionChanged?.(
                            helper.direction == 'both'
                                ? isIncrement
                                    ? 'nextRow'
                                    : 'previousRow'
                                : isIncrement
                                ? 'next'
                                : 'previous'
                        );
                    }
                }

                event.preventDefault();
                break;
            case 'PageUp':
            case 'PageDown':
                this.handler.onSelectionChanged?.(
                    event.key == 'PageDown' ? 'nextPage' : 'previousPage'
                );

                event.preventDefault();
                break;
            case 'Home':
            case 'End':
                const hasCtrl = this.isMac ? event.metaKey : event.ctrlKey;
                this.handler.onSelectionChanged?.(
                    event.key == 'Home'
                        ? hasCtrl
                            ? 'first'
                            : 'firstInRow'
                        : hasCtrl
                        ? 'last'
                        : 'lastInRow'
                );

                event.preventDefault();
                break;
            case 'Escape':
                helper.closePicker();
                event.preventDefault();
                break;

            case 'Enter':
            case 'Tab':
                this.handler.onSelect?.();
                event.preventDefault();
                break;
        }
    }

    private onSuggestingInput(helper: PickerHelperImpl) {
        if (
            !formatTextSegmentBeforeSelectionMarker(helper.editor, (_, segment, paragraph) => {
                const newQueryString = getQueryString(
                    this.triggerCharacter,
                    paragraph,
                    segment
                ).replace(/[\u0020\u00A0]/g, ' ');
                const oldQueryString = this.lastQueryString;

                if (
                    newQueryString &&
                    ((newQueryString.length >= oldQueryString.length &&
                        newQueryString.indexOf(oldQueryString) == 0) ||
                        (newQueryString.length < oldQueryString.length &&
                            oldQueryString.indexOf(newQueryString) == 0))
                ) {
                    this.lastQueryString = newQueryString;
                    this.handler.onQueryStringChanged?.(newQueryString);
                } else {
                    helper.closePicker();
                }

                return false;
            })
        ) {
            helper.closePicker();
        }
    }

    private onInput(helper: PickerHelperImpl, event: InputEvent) {
        if (event.inputType == 'insertText' && event.data == this.triggerCharacter) {
            formatTextSegmentBeforeSelectionMarker(helper.editor, (_, segment) => {
                if (segment.text.endsWith(this.triggerCharacter)) {
                    const charBeforeTrigger = segment.text[segment.text.length - 2];

                    if (
                        !charBeforeTrigger ||
                        !charBeforeTrigger.trim() ||
                        isPunctuation(charBeforeTrigger)
                    ) {
                        const selection = helper.editor.getDOMSelection();
                        const pos: DOMInsertPoint | null =
                            selection?.type == 'range' && selection.range.collapsed
                                ? {
                                      node: selection.range.startContainer,
                                      offset: selection.range.startOffset,
                                  }
                                : null;

                        if (pos) {
                            this.lastQueryString = this.triggerCharacter;
                            helper.direction = this.handler.onTrigger(this.lastQueryString, pos);
                        }
                    }
                }

                return false;
            });
        }
    }
}
