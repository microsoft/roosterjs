import wrap from '../utils/wrap';

/**
 * @deprecated Use wrap() instead
 */
export default function wrapAll(nodes: Node[], htmlFragment: string = '<div></div>'): Node {
    return wrap(nodes, htmlFragment);
}
