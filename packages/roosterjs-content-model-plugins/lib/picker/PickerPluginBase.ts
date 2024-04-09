import { ChangeSource, isPunctuation, mergeModel } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getDOMInsertPointRect } from '../pluginUtils/Rect/getDOMInsertPointRect';
import { splitTextSegment } from '../pluginUtils/splitTextSegment';
import type { PickerDirection, PickerSelectionChangMode } from './PickerHandler';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    DOMInsertPoint,
    EditorPlugin,
    FormatContentModelOptions,
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
export class PickerPluginBase implements EditorPlugin, PickerPluginBase {
    protected editor: IEditor | null = null;
    private isMac: boolean = false;
    private lastQueryString = '';
    private direction?: PickerDirection;

    constructor(private triggerCharacter: string) {}

    onTrigger?(
        x: number,
        y: number,
        buffer: number,
        queryString: string
    ): PickerDirection | undefined;
    onClosePicker?(): void;

    /**
     * Function called when the query string (text after the trigger symbol) is updated.
     */
    onQueryStringChanged?(queryString: string): void;

    /**
     * Function called when a keypress is issued that would "select" a currently highlighted option.
     */
    onSelect?(): void;

    /**
     * Function called when a keypress is issued that would move the highlight on any picker UX.
     */
    onSelectionChanged?(mode: PickerSelectionChangMode): void;

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
        this.editor = editor;
        this.isMac = !!this.editor.getEnvironment().isMac;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.direction = undefined;
    }

    commitChange(
        modelToMerge: ContentModelDocument,
        options?: FormatContentModelOptions,
        canUndoByBackspace?: boolean
    ) {
        const editor = this.editor;

        if (editor) {
            editor.focus();

            formatTextSegmentBeforeSelectionMarker(
                editor,
                (model, previousSegment, paragraph, _, context) => {
                    const potentialSegments: ContentModelText[] = [];
                    const queryString = this.internalGetQueryString(
                        paragraph,
                        previousSegment,
                        potentialSegments
                    );

                    if (queryString) {
                        potentialSegments.forEach(x => (x.isSelected = true));
                        mergeModel(model, modelToMerge, context);
                        context.canUndoByBackspace = canUndoByBackspace;
                        return true;
                    } else {
                        return false;
                    }
                },
                options
            );
        }
    }

    closePicker() {
        if (this.direction) {
            this.direction = undefined;
            this.onClosePicker?.();
        }
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
            !!this.direction &&
            (event.eventType == 'keyDown' ||
                event.eventType == 'keyUp' ||
                event.eventType == 'input')
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'contentChanged':
                if (event.source == ChangeSource.SetContent) {
                    this.closePicker();
                } else if (this.direction) {
                    this.onSuggestingInput(this.editor);
                }
                break;

            case 'keyDown':
                if (this.direction) {
                    this.onSuggestingKeyDown(this.editor, this.direction, event.rawEvent);
                }
                break;

            case 'input':
                if (this.direction) {
                    this.onSuggestingInput(this.editor);
                } else {
                    this.onInput(this.editor, event.rawEvent);
                }
                break;

            case 'mouseUp':
                if (this.direction) {
                    this.closePicker();
                }
                break;
        }
    }

    private onSuggestingKeyDown(editor: IEditor, direction: PickerDirection, event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                if (direction == 'horizontal' || direction == 'both') {
                    let isIncrement = event.key == 'ArrowRight';

                    if (editor.getDOMHelper().isRightToLeft()) {
                        isIncrement = !isIncrement;
                    }

                    this.onSelectionChanged?.(isIncrement ? 'next' : 'previous');
                }

                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                {
                    const isIncrement = event.key == 'ArrowDown';

                    if (direction != 'horizontal') {
                        this.onSelectionChanged?.(
                            direction == 'both'
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
                this.onSelectionChanged?.(event.key == 'PageDown' ? 'nextPage' : 'previousPage');

                event.preventDefault();
                break;
            case 'Home':
            case 'End':
                const hasCtrl = this.isMac ? event.metaKey : event.ctrlKey;
                this.onSelectionChanged?.(
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
                this.closePicker();
                event.preventDefault();
                break;

            case 'Enter':
            case 'Tab':
                this.onSelect?.();
                event.preventDefault();
                break;
        }
    }

    private onSuggestingInput(editor: IEditor) {
        formatTextSegmentBeforeSelectionMarker(editor, (_, segment, paragraph) => {
            const newQueryString = this.internalGetQueryString(paragraph, segment).replace(
                /[\u0020\u00A0]/g,
                ' '
            );
            const oldQueryString = this.lastQueryString;

            if (
                newQueryString &&
                ((newQueryString.length >= oldQueryString.length &&
                    newQueryString.indexOf(oldQueryString) == 0) ||
                    (newQueryString.length < oldQueryString.length &&
                        oldQueryString.indexOf(newQueryString) == 0))
            ) {
                this.lastQueryString = newQueryString;
                this.onQueryStringChanged?.(newQueryString);
            } else {
                this.closePicker();
            }

            return false;
        });
    }

    private onInput(editor: IEditor, event: InputEvent) {
        if (event.inputType == 'insertText' && event.data == this.triggerCharacter) {
            formatTextSegmentBeforeSelectionMarker(editor, (_, segment, paragraph) => {
                if (segment.text.endsWith(this.triggerCharacter)) {
                    const charBeforeTrigger = segment.text[segment.text.length - 2];

                    if (
                        !charBeforeTrigger ||
                        !charBeforeTrigger.trim() ||
                        isPunctuation(charBeforeTrigger)
                    ) {
                        const selection = editor.getDOMSelection();
                        const pos: DOMInsertPoint | null =
                            selection?.type == 'range' && selection.range.collapsed
                                ? {
                                      node: selection.range.startContainer,
                                      offset: selection.range.startOffset,
                                  }
                                : null;
                        const rect = pos && getDOMInsertPointRect(editor.getDocument(), pos);

                        if (rect) {
                            const x = rect.left;
                            const y = (rect.bottom + rect.top) / 2;
                            const buffer = (rect.bottom - rect.top) / 2;

                            this.lastQueryString = this.internalGetQueryString(paragraph, segment);
                            this.direction = this.onTrigger?.(x, y, buffer, this.lastQueryString);
                        }
                    }
                }

                return false;
            });
        }
    }

    private internalGetQueryString(
        paragraph: ContentModelParagraph,
        previousSegment: ContentModelText,
        splittedSegmentResult?: ContentModelText[]
    ): string {
        let result = '';

        for (let i = paragraph.segments.indexOf(previousSegment); i >= 0; i--) {
            const segment = paragraph.segments[i];

            if (segment.segmentType != 'Text') {
                result = '';
                break;
            }

            const index = segment.text.lastIndexOf(this.triggerCharacter);

            if (index >= 0) {
                result = segment.text.substring(index) + result;

                splittedSegmentResult?.push(
                    index > 0
                        ? splitTextSegment(segment, paragraph, index, segment.text.length)
                        : segment
                );

                break;
            } else {
                result = segment.text + result;

                splittedSegmentResult?.push(segment);
            }
        }

        return result;
    }
}
