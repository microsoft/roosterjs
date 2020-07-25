import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Browser, Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    PluginEventType,
    NodePosition,
    PendableFormatState,
    PluginEvent,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * DOMEventPlugin handles customized DOM events, including:
 * 1. IME state management
 * 2. Selection management
 * 3. Cut and Drop management
 * 4. Pending format state management
 * 5. Scroll container and scroll event management
 */
export default class DOMEventPlugin implements EditorPlugin {
    private editor: Editor;
    private disposer: () => void;

    constructor(
        private readonly isInImeWrapper: Wrapper<boolean>,
        private readonly pendableFormatStateWrapper: Wrapper<PendableFormatState>,
        private readonly pendableFormatPositionWrapper: Wrapper<NodePosition>
    ) {}

    getName() {
        return 'DOMEvent';
    }

    initialize(editor: Editor) {
        this.editor = editor;

        this.disposer = editor.addDomEventHandler({
            // 1. IME state management
            compositionstart: () => (this.isInImeWrapper.value = true),
            compositionend: (rawEvent: CompositionEvent) => {
                this.isInImeWrapper.value = false;
                editor.triggerPluginEvent(PluginEventType.CompositionEnd, {
                    rawEvent,
                });
            },

            // 2. Cut and drop management
            drop: this.onNativeEvent,
            cut: this.onNativeEvent,

            // 3. Selection mangement
            focus: this.onFocus,
            [Browser.isIEOrEdge ? 'beforedeactivate' : 'blur']: this.onBlur,
        });

        this.editor.getScrollContainer().addEventListener('scroll', this.onScroll);
    }

    dispose() {
        this.editor.getScrollContainer().removeEventListener('scroll', this.onScroll);

        this.disposer();
        this.disposer = null;
        this.editor = null;
        this.clear();
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.PendingFormatStateChanged:
                // Got PendingFormatStateChagned event, cache current position and pending format
                this.pendableFormatPositionWrapper.value = this.getCurrentPosition();
                this.pendableFormatStateWrapper.value = event.formatState;
                break;
            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
            case PluginEventType.ContentChanged:
                // If content or position is changed (by keyboard, mouse, or code),
                // check if current position is still the same with the cached one (if exist),
                // and clear cached format if position is changed since it is out-of-date now
                if (
                    this.pendableFormatPositionWrapper.value &&
                    !this.pendableFormatPositionWrapper.value.equalTo(this.getCurrentPosition())
                ) {
                    this.clear();
                }
                break;
        }
    }

    private onNativeEvent = (e: UIEvent) => {
        this.editor.runAsync(() => {
            this.editor.addUndoSnapshot(
                () => {},
                e.type == 'cut' ? ChangeSource.Cut : ChangeSource.Drop
            );
        });
    };

    private onFocus = () => {
        this.editor.restoreSavedRange();
    };

    private onBlur = () => {
        this.editor.saveSelectionRange();
    };

    private onScroll = (e: UIEvent) => {
        this.editor.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.editor.getScrollContainer(),
        });
    };

    private clear() {
        this.pendableFormatPositionWrapper.value = null;
        this.pendableFormatStateWrapper.value = null;
    }

    private getCurrentPosition() {
        let range = this.editor.getSelectionRange();
        return range && Position.getStart(range).normalize();
    }
}
