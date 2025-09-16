import { cloneModel, cloneParagraph, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    CloneModelOptions,
    ContentModelParagraph,
    EditorCore,
    ICoauthoringAgent,
    ICoauthoringClient,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createCoauthoringClient(
    core: EditorCore,
    owner: string,
    agent: ICoauthoringAgent
): ICoauthoringClient {
    let ignoreLocal = false;

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

    const client: ICoauthoringClient = {
        isCoauthoring: true,
        owner,
        dispose: () => agent.unregister(owner),
        onRemoteUpdate: update => {
            ignoreLocal = true;
            try {
                switch (update.type) {
                    case 'paragraph':
                        const clonedParagraph = cloneParagraph(
                            update.paragraph,
                            clonedOptionForRemoteUpdate
                        );

                        core.api.formatContentModel(core, (_, context) => {
                            context.skipUndoSnapshot = 'SkipAll';

                            const paragraph = context.paragraphIndexer?.getParagraphFromMarker(
                                update.paragraph
                            );

                            if (paragraph) {
                                copyParagraph(paragraph, clonedParagraph);

                                return true;
                            } else {
                                // TODO: handle error case that paragraph is not found
                                return false;
                            }
                        });
                        break;

                    case 'model':
                        const clonedModel = cloneModel(update.model, clonedOptionForRemoteUpdate);

                        core.api.setContentModel(core, clonedModel, {
                            ignoreSelection: true,
                        });
                        break;
                }
            } finally {
                ignoreLocal = false;
            }
        },
        onLocalUpdate: update => {
            if (!ignoreLocal) {
                switch (update.type) {
                    case 'paragraph':
                        const targetPara = cloneParagraph(
                            update.paragraph,
                            cloneOptionForLocalUpdate
                        );

                        agent.onClientUpdate({ type: 'paragraph', paragraph: targetPara }, owner);
                        break;
                    case 'model':
                        const targetModel = cloneModel(update.model, cloneOptionForLocalUpdate);

                        agent.onClientUpdate({ type: 'model', model: targetModel }, owner);
                        break;
                }
            }
        },
    };

    agent.register(client);

    return client;
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
