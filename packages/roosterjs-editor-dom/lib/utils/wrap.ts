import fromHtml from './fromHtml';

// Wrap the node with html and return the wrapped node
export default function wrap(node: Node, htmlFragment: string): Node {
    if (!node) {
        return null;
    }

    let wrapper = node;

    if (htmlFragment) {
        wrapper = fromHtml(htmlFragment, node.ownerDocument)[0];
        if (node.parentNode) {
            node.parentNode.insertBefore(wrapper, node);
            node.parentNode.removeChild(node);
        }
        wrapper.appendChild(node);
    }

    return wrapper;
}
