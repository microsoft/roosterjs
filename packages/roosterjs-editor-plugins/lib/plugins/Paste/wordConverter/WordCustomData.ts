import { NodeType } from 'roosterjs-editor-types';

/** NodeId attribute */
const NODE_ID_ATTRIBUTE_NAME = 'NodeId';

/**
 * @internal
 * Custom data for dom elements
 */
export default interface WordCustomData {
    /** The dict storing custom data, key is element Id, value is dictionary */
    dict: { [key: string]: { [key: string]: number } };

    /** Next node Id to use */
    nextNodeId: number;
}

/**
 * @internal
 * Create an empty WordCustomData
 */
export function createCustomData(): WordCustomData {
    return {
        dict: {},
        nextNodeId: 1,
    };
}

/**
 * @internal
 * Sets the specified object data
 */
export function setObject(wordCustomData: WordCustomData, element: Node, key: string, value: any) {
    // Get the id for the element
    if (element.nodeType == NodeType.Element) {
        const id = getAndSetNodeId(wordCustomData, element as HTMLElement);
        if (id != '') {
            // Get the values for the element
            if (!wordCustomData.dict[id]) {
                // First time dictionary creation
                wordCustomData.dict[id] = {};
            }
            wordCustomData.dict[id][key] = value;
        }
    }
}

/**
 * @internal
 * Reads the specified object data
 */
export function getObject(wordCustomData: WordCustomData, element: Node, key: string): any {
    if (element.nodeType == NodeType.Element) {
        const id = getAndSetNodeId(wordCustomData, element as HTMLElement);
        if (id != '') {
            return wordCustomData.dict[id] && wordCustomData.dict[id][key];
        }
    }

    return null;
}

/**
 * Get the unique id for the specified node...
 */
function getAndSetNodeId(wordCustomData: WordCustomData, element: HTMLElement): string {
    let id = element.getAttribute(NODE_ID_ATTRIBUTE_NAME);
    if (!id) {
        id = wordCustomData.nextNodeId.toString();
        wordCustomData.nextNodeId++;
        element.setAttribute(NODE_ID_ATTRIBUTE_NAME, id);
    }
    return id;
}
