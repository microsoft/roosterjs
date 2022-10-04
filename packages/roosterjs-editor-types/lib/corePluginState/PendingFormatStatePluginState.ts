import NodePosition from '../interface/NodePosition';
import { PendableFormatState } from '../interface/FormatState';

/**
 * The state object for PendingFormatStatePlugin
 */
export default interface PendingFormatStatePluginState {
    /**
     * Current pending format state
     */
    pendableFormatState: PendableFormatState | null;

    /**
     * The position of last pendable format state changing
     */
    pendableFormatPosition: NodePosition | null;

    /**
     * A temporary SPAN element to hold pending format change. it will be inserted into content when user type something,
     * or discard if focus position is moved
     */
    pendableFormatSpan: HTMLElement | null;
}
