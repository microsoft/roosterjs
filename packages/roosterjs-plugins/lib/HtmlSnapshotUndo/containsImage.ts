// Check if the node contains image
export default function containsImage(node: Node): boolean {
    if (node) {
        let container = node as HTMLElement;
        if (container.querySelector) {
            let image = container.querySelector('img');
            if (image) {
                return true;
            }
        }
    }

    return false;
}
