export interface SidePaneElementProps {
    updateHash: (pluginName?: string, path?: string[]) => void;
}

export interface SidePaneElement {
    setHashPath?: (path: string[]) => void;
}
