/**
 * A set of  UI Utilities to help render additional UI element from a plugin
 */
export default interface UIUtilities {
    /**
     * Render additional react component from a plugin, with correlated theme and window context of Rooster
     * @param element The UI element (JSX object) to render
     * @returns A disposer function to help unmount this element
     */
    renderComponent(element: JSX.Element): () => void;
}
