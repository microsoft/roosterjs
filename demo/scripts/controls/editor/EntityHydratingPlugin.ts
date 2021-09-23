import { moveChildNodes, safeInstanceOf } from 'roosterjs-editor-dom';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import {
    EditorPlugin,
    PluginEvent,
    PluginEventType,
    EntityOperation,
    IEditor,
} from 'roosterjs-editor-types';

export default class EntityHydratingPlugin implements EditorPlugin {
    private editor: IEditor;

    getName() {
        return 'EntityHydrating';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.EntityOperation &&
            event.operation == EntityOperation.NewEntity &&
            event.contentForShadowEntity &&
            !event.contentForShadowEntity.firstChild
        ) {
            const child = event.entity.wrapper.firstChild;
            const hydratedHtml = safeInstanceOf(child, 'HTMLElement') && child.dataset.hydratedHtml;

            if (hydratedHtml) {
                const div = this.editor.getDocument().createElement('div');
                div.innerHTML = trustedHTMLHandler(hydratedHtml);
                moveChildNodes(event.contentForShadowEntity, div);
            }
        }
    }
}
