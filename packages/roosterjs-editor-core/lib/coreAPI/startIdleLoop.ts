import EditorCore from '../editor/EditorCore';
import triggerEvent from './triggerEvent';
import { PluginEventType } from 'roosterjs-editor-types';

/**
 * Start a loop to trigger Idle event
 * @param core EditorCore object
 * @param interval Interval of idle event
 */
export default function startIdleLoop(core: EditorCore, interval: number) {
    let win = core.contentDiv.ownerDocument.defaultView || window;
    core.idleLoopHandle = win.setInterval(() => {
        if (core.ignoreIdleEvent) {
            core.ignoreIdleEvent = false;
        } else {
            triggerEvent(
                core,
                {
                    eventType: PluginEventType.Idle,
                },
                true /*broadcast*/
            );
        }
    }, interval);
}
