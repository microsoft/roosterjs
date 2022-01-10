/**
 * The state object for TableSelectionPlugin
 */
export default interface TableSelectionPluginState {
    lastTarget: Node;
    firstTarget: Node;
    startRange: number[];
    endRange: number[];
    vSelection: boolean;
    startedSelection: boolean;
}
