import { cloneModel, createContentModelDocument, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    CloneModelOptions,
    CoauthoringUpdate,
    ContentModelParagraph,
    EditorCore,
    ICoauthoringAgent,
    ICoauthoringClient,
    ICoauthoringClientBridge,
    ReadonlyContentModelParagraph,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

class CoauthoringClient implements ICoauthoringClient, ICoauthoringClientBridge {
    private ignoreLocal = false;
    private currentVersion = 0;
    private clonedOptionForRemoteUpdate: CloneModelOptions;
    private cloneOptionForLocalUpdate: CloneModelOptions;
    public readonly isCoauthoring = true;

    constructor(
        private core: EditorCore,
        public readonly owner: string,
        private agent: ICoauthoringAgent
    ) {
        this.clonedOptionForRemoteUpdate = {
            paragraphCloner: (target, source) => {
                this.core.cache.paragraphMap?.copyParagraphMarker(target, source);
            },
            selectionMarkerCloner: target => {
                if (target.owner == owner) {
                    target.isSelected = true;
                }
            },
        };

        this.cloneOptionForLocalUpdate = {
            paragraphCloner: (target, source) => {
                this.core.cache.paragraphMap?.copyParagraphMarker(target, source);
            },
            selectionMarkerCloner: target => {
                if (!target.owner) {
                    target.owner = owner;
                }

                target.isSelected = false;
            },
        };

        agent.register(owner, this);
    }

    dispose() {
        this.agent.unregister(this.owner);
    }

    onRemoteUpdate(update: CoauthoringUpdate, fromOwner: string, newVersion: number) {
        this.currentVersion = newVersion;

        if (fromOwner != this.owner) {
            this.ignoreLocal = true;
            try {
                applyRemoteUpdate(update, this.clonedOptionForRemoteUpdate, this.core);
                this.core.cache.textMutationObserver.flushMutations(true /*ignoreMutations*/);
            } finally {
                this.ignoreLocal = false;
            }
        }
    }

    onLocalUpdate(update: CoauthoringUpdate) {
        if (!this.ignoreLocal) {
            switch (update.type) {
                case 'paragraph':
                    this.agent.onClientUpdate(
                        {
                            type: 'paragraph',
                            paragraphs: cloneParagraphs(
                                update.paragraphs,
                                this.cloneOptionForLocalUpdate
                            ),
                        },
                        this.owner,
                        this.currentVersion
                    );

                    break;
                case 'model':
                    const targetModel = cloneModel(update.model, this.cloneOptionForLocalUpdate);

                    this.agent.onClientUpdate(
                        { type: 'model', model: targetModel },
                        this.owner,
                        this.currentVersion
                    );

                    break;
            }
        }
    }
}

/**
 * @internal
 */
export function createCoauthoringClient(
    core: EditorCore,
    owner: string,
    agent: ICoauthoringAgent
): ICoauthoringClientBridge {
    return new CoauthoringClient(core, owner, agent);
}

function applyRemoteUpdate(
    update: CoauthoringUpdate,
    options: CloneModelOptions,
    core: EditorCore
) {
    switch (update.type) {
        case 'paragraph':
            core.api.formatContentModel(core, (_, context) => {
                context.skipUndoSnapshot = 'SkipAll';
                let modified = false;
                const clonedParagraphs = cloneParagraphs(update.paragraphs, options);

                for (const clonedParagraph of clonedParagraphs) {
                    const localParagraph = context.paragraphIndexer?.getParagraphFromMarker(
                        clonedParagraph
                    );

                    if (localParagraph) {
                        copyParagraph(localParagraph, clonedParagraph);

                        modified = true;
                    } else {
                        // TODO: handle error case that paragraph is not found
                    }
                }

                return modified;
            });
            break;

        case 'model':
            const clonedModel = cloneModel(update.model, options);

            core.api.setContentModel(core, clonedModel, {
                ignoreSelection: true,
            });
            break;
    }
}

function copyParagraph(
    paragraph: ReadonlyContentModelParagraph,
    sourceParagraph: ContentModelParagraph
) {
    const mutablePara = mutateBlock(paragraph);
    mutablePara.segments = sourceParagraph.segments;
    mutablePara.format = sourceParagraph.format;
    mutablePara.decorator = sourceParagraph.decorator;
    mutablePara.segmentFormat = sourceParagraph.segmentFormat;
}

function cloneParagraphs(
    source: ReadonlyContentModelParagraph[],
    options: CloneModelOptions
): ContentModelParagraph[] {
    const tempModel: ShallowMutableContentModelDocument = createContentModelDocument();

    tempModel.blocks = source;

    const clonedModel = cloneModel(tempModel, options);

    return clonedModel.blocks.filter(
        (x): x is ContentModelParagraph => x.blockType === 'Paragraph'
    );
}
