import fromHtml from './fromHtml';

// Wrap all the node with html and return the wrapped node
// All nodes should be under same parent
export default function wrapAll(nodes: Node[], htmlFragment: string = '<div></div>'): Node {
    if (!nodes || nodes.length == 0) {
        return null;
    }

    let parentNode = nodes[0].parentNode;
    let wrapper = parentNode;

    if (htmlFragment) {
        wrapper = fromHtml(htmlFragment, nodes[0].ownerDocument)[0];
        if (parentNode) {
            parentNode.insertBefore(wrapper, nodes[0]);
        }

        for (let i = 0; i < nodes.length; i++) {
            wrapper.appendChild(nodes[i]);
        }
    }

    return wrapper;
}
