import NodePosition from '../interface/NodePosition';
import { PendableFormatState } from '../interface/FormatState';

/**
 * The state object for PendingFormatStatePlugin
 */
export default interface PendingFormatStatePluginState {
    /**
     * Current pending format state
     */
    pendableFormatState: PendableFormatState;

    /**
     * The position of last pendable format state changing
     */
    pendableFormatPosition: NodePosition;
}
