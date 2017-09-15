import DefaultInlineElementResolver from './DefaultInlineElementResolver';
import InlineElementResolver from './InlineElementResolver';
import NodeInlineElement from './NodeInlineElement';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';

// This factory holds all resolvers and provide function to resolve DOM node to inline element
class InlineElementFactory {
    private defaultResolver: DefaultInlineElementResolver;

    constructor(private customResolvers?: InlineElementResolver[]) {
        // Initialize default resolver and custom resolver array
        this.defaultResolver = new DefaultInlineElementResolver();
    }

    // Resolve an inline element by a leaf node
    public resolve(node: Node, rootNode: Node, parentBlock: BlockElement): InlineElement {
        let inlineElement: InlineElement;

        // First, prepare the node chain starting from current node up to block (not including the parent block node)
        let nodeChain = [node];
        let parentNode = node.parentNode;
        while (parentNode && parentBlock.contains(parentNode)) {
            // Use the unshift to push the node to very front
            nodeChain.unshift(parentNode);
            parentNode = parentNode.parentNode;
        }

        // Now loop through the node chain from top down, and ask through each custom resolver
        // till anyone resolves to an inline element
        // We give custom resolver a high pri, and fall back to default resolver when none of custom resolver
        // can resolve the inline element
        if (this.customResolvers && this.customResolvers.length > 0) {
            for (let i = 0; i < nodeChain.length; i++) {
                for (let resolver of this.customResolvers) {
                    inlineElement = resolver.resolve(nodeChain[i], rootNode, parentBlock, this);
                    if (inlineElement) {
                        break;
                    }
                }

                // If at this point we already have an inline element, exit the loop
                if (inlineElement) {
                    break;
                }
            }
        }

        // Still no inline element, resolve through the default resolver
        // The reason this default resolver is put as last is we want to give third-party a high pri
        // i.e. for html like <a><span>#hashtag</span></a>, default resolver resolves against <a>
        // if default resolver is in same pri as custom, we will get an LinkInlineElement, instead of hashtag inline`
        if (!inlineElement) {
            for (let i = 0; i < nodeChain.length; i++) {
                inlineElement = this.defaultResolver.resolve(
                    nodeChain[i],
                    rootNode,
                    parentBlock,
                    this
                );
                if (inlineElement) {
                    break;
                }
            }
        }

        // Last fallback, resolve it as a simple NodeInlineElement
        if (!inlineElement) {
            inlineElement = new NodeInlineElement(node, rootNode, parentBlock, this);
        }

        return inlineElement;
    }
}

export default InlineElementFactory;
