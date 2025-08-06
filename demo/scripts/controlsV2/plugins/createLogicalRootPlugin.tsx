import { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';

export function createLogicalRootPlugin(): EditorPlugin {
    return new LogicalRootPlugin();
}

/**
 * Plugin just for demo purpose of Logical root feature.
 */
class LogicalRootPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private lastTarget: HTMLElement | null = null;

    getName: () => string = () => 'LogicalRootPlugin';

    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.attachDomEvent({
            mousedown: {
                capture: true,
                beforeDispatch: (event: MouseEvent) => {
                    if (this.editor && this.editor.isDisposed()) {
                        return;
                    }
                    const target = event.target as HTMLElement;
                    const closestEntity = target.closest('._Entity._EType_LogicalRoot');
                    if (closestEntity) {
                        this.editor.setLogicalRoot(closestEntity as HTMLDivElement);

                        if (isElementOfType(target, 'img')) {
                            this.editor.setDOMSelection({
                                type: 'image',
                                image: target,
                            });
                        }
                    } else {
                        this.editor.setLogicalRoot(null);
                    }
                },
            },
        });
    }

    dispose() {
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (event.eventType === 'logicalRootChanged') {
            // Handle logical root change if needed
            event.logicalRoot.focus();
            if (
                isElementOfType(this.lastTarget, 'img') &&
                event.logicalRoot.contains(this.lastTarget)
            ) {
                this.editor?.setDOMSelection({
                    type: 'image',
                    image: this.lastTarget,
                });
            }
        }
        if (
            event.eventType === 'mouseUp' &&
            isNodeOfType(event.rawEvent.target as Node, 'ELEMENT_NODE')
        ) {
            this.lastTarget = event.rawEvent.target as HTMLElement;
        }
    }
}
