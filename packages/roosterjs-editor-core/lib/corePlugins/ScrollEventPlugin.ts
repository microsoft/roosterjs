import Editor from '../editor/Editor';
import PluginWithState from '../interfaces/PluginWithState';
import { PluginEventType, Wrapper } from 'roosterjs-editor-types';

/**
 * ScrollEventPlugin handles customized onScroll event of scroll container of editor
 */
export default class ScrollEventPlugin implements PluginWithState<HTMLElement> {
    private editor: Editor;

    constructor(public readonly state: Wrapper<HTMLElement>) {}

    getName() {
        return 'ScrollEvent';
    }

    initialize(editor: Editor) {
        this.editor = editor;
        this.state.value.addEventListener('scroll', this.onScroll);
    }

    dispose() {
        this.state.value.removeEventListener('scroll', this.onScroll);
        this.editor = null;
    }

    private onScroll = (e: UIEvent) => {
        this.editor.triggerPluginEvent(PluginEventType.Scroll, {
            rawEvent: e,
            scrollContainer: this.state.value,
        });
    };
}
