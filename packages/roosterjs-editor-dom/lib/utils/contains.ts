// Test if a node contains another node
export default function contains(
    container: Node,
    contained: Node,
    treatSameNodeAsContain: boolean = false
): boolean {
    return !!(
        container &&
        (treatSameNodeAsContain || container != contained) &&
        container.contains(contained)
    );
}
