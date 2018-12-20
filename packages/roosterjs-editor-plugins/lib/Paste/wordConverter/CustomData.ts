import { NodeType } from 'roosterjs-editor-types';

/** NodeId attribute */
const NODE_ID_ATTRIBUTE_NAME = 'NodeId';

/** Custom data for dom elements */
export default interface CustomData {
    /** The dict storing custom data, key is element Id, value is dictionary */
    dict: { [key: string]: { [key: string]: number } };

    /** Next node Id to use */
    nextNodeId: number;
}

/** create an empty CustomData */
export function createCustomData(): CustomData {
    return {
        dict: {},
        nextNodeId: 1,
    };
}

/**
 * Sets the specified object data
 */
export function setObject(customData: CustomData, element: Node, key: string, value: any) {
    // Get the id for the element
    if (element.nodeType == NodeType.Element) {
        let id = getAndSetNodeId(customData, element as HTMLElement);
        if (id != '') {
            // Get the values for the element
            if (!customData.dict[id]) {
                // First time dictionary creation
                customData.dict[id] = {};
            }
            customData.dict[id][key] = value;
        }
    }
}

/**
 * Reads the specified object data
 */
export function getObject(customData: CustomData, element: Node, key: string): any {
    if (element.nodeType == NodeType.Element) {
        let id = getAndSetNodeId(customData, element as HTMLElement);
        if (id != '') {
            return customData.dict[id] && customData.dict[id][key];
        }
    }

    return null;
}

/** Get the unique id for the specified node... */
function getAndSetNodeId(customData: CustomData, element: HTMLElement): string {
    let id = element.getAttribute(NODE_ID_ATTRIBUTE_NAME);
    if (!id) {
        id = customData.nextNodeId.toString();
        customData.nextNodeId++;
        element.setAttribute(NODE_ID_ATTRIBUTE_NAME, id);
    }
    return id;
}
