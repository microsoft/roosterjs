import * as React from 'react';
import * as ReactDOM from 'react-dom';
import removeReactTagsOnExtractContent from './util/removeReactTagsOnExtractContent';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ChangeSource,
    PluginEvent,
    PluginEventType,
    ContentPosition,
    ExtractContentEvent,
} from 'roosterjs-editor-types';
import {
    REACT_COMPONENT_DATA_KEY,
    REACT_COMPONENT_INSTANCE_ID,
    REACT_COMPONENT_SHARABLE_STATE,
} from './util/constants';

export interface ReactPluginComponentProps {
    /**
     * The DOM node that the mounted component is copied into when it is updated.
     *
     * Use this to bind event handlers (e.g. click, contextHandler, etc), as your component
     * is not mounted on the document.
     */
    inEditorMountRoot: HTMLElement;
    /**
     * the serialized state of the component.
     */
    initialSerializedSharableState: string | null;
    /**
     * the serialized state of the component.
     */
    updateSerialziedSharableState: (newState: string) => void;
    /**
     * triggers the listener to update the DOM in the editor.
     *
     * Call this in your `componentDidMount`+`componentDidUpdate`, or
     * in a `useEffect` hook.
     */
    updateDomInEditor: () => void;
}

interface MountedComponentInstance {
    /**
     * Editor root where the react component has been mounted
     */
    inEditorMountRoot: HTMLElement;
    /**
     * React root where the actual react component has been mounted
     */
    offDocumentReactRoot: HTMLElement;
    instanceId: string;
    updateMountPointCallback?: (element: HTMLElement) => void;
}

const legalChangeSources = new Set();
legalChangeSources.add(ChangeSource.SetContent);
legalChangeSources.add(ChangeSource.Paste);
legalChangeSources.add(ChangeSource.Drop);

export default class ReactComponentPlugin implements EditorPlugin {
    private editor: Editor | undefined;
    private nextId: number = 0;
    private elementToInstances: Map<HTMLElement, MountedComponentInstance> = new Map();
    private idToInstances: Map<string, MountedComponentInstance> = new Map();
    private componentId: string;
    private componentType: React.ComponentType<ReactPluginComponentProps>;

    constructor(
        componentId: string,
        componentType: React.ComponentType<ReactPluginComponentProps>
    ) {
        this.componentId = componentId;
        this.componentType = componentType;
    }

    /**
     * Get a friendly name
     */
    getName() {
        return 'React Component';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    public initialize(editor: Editor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = undefined;
        for (let mountedInstance of [...this.elementToInstances.values()]) {
            this.unmountInstance(mountedInstance);
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param _event The event to check
     */
    public willHandleEventExclusively(_event: PluginEvent) {
        return false;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        if (this.isTriggeringEvent(event)) {
            this.handleChangeInEditor(event);
        } else if (event.eventType === PluginEventType.ExtractContent) {
            const evt = event as ExtractContentEvent;
            evt.content = removeReactTagsOnExtractContent(evt.content);
        }
    }

    private handleChangeInEditor(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        // Undoes and other major changes to document content fire this type of event.
        //
        // Scan for new elements.
        const foundComponentRoots = this.editor.queryElements(
            `[${REACT_COMPONENT_DATA_KEY}="${this.componentId}"]`
        );

        const unresolvedMountPoints: Array<{ element: HTMLElement; id: string }> = [];
        const unresolvedInstanceIds: Set<string> = new Set();
        for (let id of [...this.idToInstances.keys()]) {
            unresolvedInstanceIds.add(id);
        }
        const resolvedIds: Set<string> = new Set();

        // Find existing components which did not move, and initialize new components without IDs
        foundComponentRoots.forEach((foundMountPoint: HTMLElement) => {
            const foundId = foundMountPoint.getAttribute(REACT_COMPONENT_INSTANCE_ID);

            const existingEntry = this.elementToInstances.get(foundMountPoint);
            if (existingEntry && existingEntry.instanceId === foundId) {
                // Same component. do nothing
                unresolvedInstanceIds.delete(foundId);
                resolvedIds.add(foundId);
                return;
            }

            // New component with no ID. insert a new component
            if (foundId === null) {
                // create a new instance and add it to the map
                const newInstance = this.createNewComponentInstance(foundMountPoint);
                resolvedIds.add(newInstance.instanceId);
                this.mountNewInstanceInEditor(newInstance);
            }

            // New component with ID already assigned. Wait until
            // we have resolved all known and new components until we get to them.
            else {
                unresolvedMountPoints.push({ element: foundMountPoint, id: foundId });
            }
        });

        // Handle moved and pasted instances.
        unresolvedMountPoints.forEach(({ element, id }) => {
            const oldInstance = this.idToInstances.get(id);

            if (resolvedIds.has(id) || oldInstance == null) {
                // if it's already been resolved, then this is a copy/paste of an existing element.
                // Bind its ID in the DOM and mount a new instance for it.
                const newInstance = this.createNewComponentInstance(element);
                element.setAttribute(REACT_COMPONENT_INSTANCE_ID, newInstance.instanceId);
                this.mountNewInstanceInEditor(newInstance);
            } else {
                // If it's an ID that hasn't been resolved yet, this is a move of an existing component
                unresolvedInstanceIds.delete(oldInstance.instanceId);
                this.moveMountedComponentToNewPositionInEditor(element, oldInstance);
            }
        });

        // Remove instances that don't exist anymore
        unresolvedInstanceIds.forEach(instanceId => {
            const instance = this.idToInstances.get(instanceId);
            if (instance) {
                this.unmountInstance(instance);
            }
        });
    }

    private moveMountedComponentToNewPositionInEditor(
        element: HTMLElement,
        oldInstance: MountedComponentInstance
    ) {
        // Update our data on the instance
        this.elementToInstances.delete(oldInstance.inEditorMountRoot);
        this.elementToInstances.set(element, oldInstance);
        if (!oldInstance.updateMountPointCallback) {
            throw new Error('Tried to move a component that was never mounted');
        }
        oldInstance.updateMountPointCallback(element);
    }

    /**
     * Mounts an instance against a given element into the editor.
     *
     * Adds it to the tracked elements and sets up the react component hooks
     * to update it in-editor when its updated.
     *
     * @param newInstance the inststance to initialize
     */
    private mountNewInstanceInEditor(newInstance: MountedComponentInstance) {
        this.elementToInstances.set(newInstance.inEditorMountRoot, newInstance);
        newInstance.inEditorMountRoot.setAttribute(
            REACT_COMPONENT_INSTANCE_ID,
            newInstance.instanceId
        );
        newInstance.inEditorMountRoot.setAttribute('contenteditable', 'false');

        this.idToInstances.set(newInstance.instanceId, newInstance);
        this.mountInstanceOnShadowDom(newInstance);
    }

    /**
     * Creates a new component instance pointing to a given mount point.
     *
     * Does not initialize the react lifecycle on the component
     *
     * @param foundMountPoint
     */
    private createNewComponentInstance(inEditorMountRoot: HTMLElement): MountedComponentInstance {
        return {
            inEditorMountRoot,
            instanceId: (this.nextId++).toString(),
            offDocumentReactRoot: document.createElement('section'),
        };
    }

    /**
     * Mounts an instance on the shadow dom, and installs a render callback
     * to copy the component data into the editor body
     *
     * @param instanceToMount the instance to mount
     */
    private mountInstanceOnShadowDom(instanceToMount: MountedComponentInstance) {
        const Component: React.ComponentType<ReactPluginComponentProps> = this.componentType;
        const offDocumentReactRoot = instanceToMount.offDocumentReactRoot;

        const serializedState = instanceToMount.inEditorMountRoot.getAttribute(
            REACT_COMPONENT_SHARABLE_STATE
        );
        const updateSerializedSharableStateOnDom = (newState: string) => {
            instanceToMount.inEditorMountRoot.setAttribute(
                REACT_COMPONENT_SHARABLE_STATE,
                newState
            );
        };

        const onRenderCallback = () => {
            // If the mountpoint has been removed from the editor, do nothing.
            // Rely on the editor event handling above to clean up this mounted component.
            if (!this.editor || !this.editor.contains(instanceToMount.inEditorMountRoot)) {
                return;
            }

            // Clone the rendered DOM
            const shadowRootClone = offDocumentReactRoot.cloneNode(true);

            // highlight all children of the mount root as insert point
            const insertRange = document.createRange();
            // Work by reference here, so that if the partialInstance's in-editor mount
            // point is updated over the lifetime of the component, this will write to the
            // new mount point.
            const currentInEditorMountRoot = instanceToMount.inEditorMountRoot;
            while (currentInEditorMountRoot.childNodes.length) {
                currentInEditorMountRoot.removeChild(currentInEditorMountRoot.childNodes[0]);
            }
            insertRange.setStart(currentInEditorMountRoot, 0);
            insertRange.setEnd(currentInEditorMountRoot, 0);

            if (shadowRootClone.childNodes.length !== 1) {
                throw new Error(
                    'ReactPlugin only supports components that render a single root element'
                );
            }

            // replace the contents of the node with updated DOM.
            this.editor.insertNode(shadowRootClone.childNodes[0], {
                position: ContentPosition.Range,
                range: insertRange,
            });
        };

        ReactDOM.render(
            <Component
                inEditorMountRoot={instanceToMount.inEditorMountRoot}
                initialSerializedSharableState={serializedState}
                updateSerialziedSharableState={updateSerializedSharableStateOnDom}
                updateDomInEditor={onRenderCallback}
            />,
            offDocumentReactRoot
        );

        // Change the tracked value and re-render.
        instanceToMount.updateMountPointCallback = (element: HTMLElement) => {
            instanceToMount.inEditorMountRoot = element;
            ReactDOM.render(
                <Component
                    inEditorMountRoot={instanceToMount.inEditorMountRoot}
                    initialSerializedSharableState={serializedState}
                    updateSerialziedSharableState={updateSerializedSharableStateOnDom}
                    updateDomInEditor={onRenderCallback}
                />,
                offDocumentReactRoot
            );
        };

        return instanceToMount;
    }

    private unmountInstance(mountedInstance: MountedComponentInstance) {
        ReactDOM.unmountComponentAtNode(mountedInstance.offDocumentReactRoot);
    }

    private isTriggeringEvent(event: PluginEvent): boolean {
        if (event.eventType === PluginEventType.EditorReady) {
            return true;
        } else if (
            event.eventType == PluginEventType.ContentChanged &&
            legalChangeSources.has(event.source)
        ) {
            return true;
        }
        return false;
    }
}
