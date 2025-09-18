import { cloneModel, createContentModelDocument, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    CloneModelOptions,
    CoauthoringUpdate,
    ContentModelParagraph,
    EditorCore,
    ICoauthoringAgent,
    ICoauthoringClientBridge,
    ReadonlyContentModelParagraph,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createCoauthoringClient(
    core: EditorCore,
    owner: string,
    agent: ICoauthoringAgent
): ICoauthoringClientBridge {
    let ignoreLocal = false;
    let currentVersion = 0;
    let expectedVersion: number | undefined;

    const clonedOptionForRemoteUpdate: CloneModelOptions = {
        paragraphCloner: (target, source) => {
            core.cache.paragraphMap?.copyParagraphMarker(target, source);
        },
        selectionMarkerCloner: target => {
            if (target.owner == owner) {
                target.isSelected = true;
            }
        },
    };

    const cloneOptionForLocalUpdate: CloneModelOptions = {
        paragraphCloner: (target, source) => {
            core.cache.paragraphMap?.copyParagraphMarker(target, source);
        },
        selectionMarkerCloner: target => {
            if (!target.owner) {
                target.owner = owner;
            }

            target.isSelected = false;
        },
    };

    const client: ICoauthoringClientBridge = {
        isCoauthoring: true,
        owner,
        dispose: () => agent.unregister(owner),
        onRemoteUpdate: (update, fromOwner, newVersion, originalVersion) => {
            if (expectedVersion == undefined || newVersion >= expectedVersion) {
                currentVersion = newVersion;
                expectedVersion = undefined;

                if (fromOwner === owner) {
                    return;
                }

                ignoreLocal = true;
                try {
                    applyRemoteUpdate(update, clonedOptionForRemoteUpdate, core);
                    core.cache.textMutationObserver.flushMutations(true /*ignoreMutations*/);
                } finally {
                    ignoreLocal = false;
                }
            }
        },
        onLocalUpdate: update => {
            if (!ignoreLocal) {
                if (expectedVersion === undefined) {
                    expectedVersion = currentVersion + 1;
                } else {
                    expectedVersion++;
                }

                switch (update.type) {
                    case 'paragraph':
                        agent.onClientUpdate(
                            {
                                type: 'paragraph',
                                paragraphs: cloneParagraphs(
                                    update.paragraphs,
                                    cloneOptionForLocalUpdate
                                ),
                            },
                            owner,
                            currentVersion
                        );

                        break;
                    case 'model':
                        const targetModel = cloneModel(update.model, cloneOptionForLocalUpdate);

                        agent.onClientUpdate(
                            { type: 'model', model: targetModel },
                            owner,
                            currentVersion
                        );

                        break;
                }
            }
        },
    };

    agent.register(client);

    return client;
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
