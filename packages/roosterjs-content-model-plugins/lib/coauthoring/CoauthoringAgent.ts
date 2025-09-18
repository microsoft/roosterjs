import {
    areSameSegments,
    cloneModel,
    getObjectKeys,
    ParagraphMapBase,
} from 'roosterjs-content-model-dom';
import type {
    CoauthoringUpdate,
    CoauthoringUpdateParagraph,
    ContentModelDocument,
    ContentModelParagraph,
    ICoauthoringAgent,
    ICoauthoringClient,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

const MAX_VERSIONS_TO_KEEP = 100;

/**
 * Implementation of ICoauthoringAgent
 */
export class CoauthoringAgent implements ICoauthoringAgent {
    private clients: ICoauthoringClient[] = [];
    private models: Record<number, ContentModelDocument> = {};
    private lastVersion: number;
    private lastOwner: string = '';

    constructor(initialModel: ContentModelDocument) {
        this.lastVersion = 0;
        this.updateModel(initialModel);
    }

    register(client: ICoauthoringClient) {
        this.clients.push(client);

        client.onRemoteUpdate(
            {
                type: 'model',
                model: this.models[this.lastVersion],
            },
            this.lastOwner,
            this.lastVersion,
            this.lastVersion
        );
    }

    unregister(owner: string) {
        this.clients = this.clients.filter(client => client.owner !== owner);
    }

    onClientUpdate(update: CoauthoringUpdate, owner: string, baseOnVersion: number) {
        const lastModel = this.models[this.lastVersion];

        let updateOwner = owner;

        if (baseOnVersion > this.lastVersion) {
            // TODO: Error, client cannot have a version larger than current version
        } else if (baseOnVersion == this.lastVersion || owner == this.lastOwner) {
            // Fast path, just apply the update
            this.lastVersion++;
            this.lastOwner = owner;

            switch (update.type) {
                case 'model':
                    this.updateModel(update.model);

                    break;

                case 'paragraph':
                    const map = new ParagraphMapBase();
                    const newModel = cloneModel(lastModel, {
                        paragraphCloner: (target, source) => {
                            map.copyParagraphMarker(target, source);
                        },
                    });

                    map.scanParagraphs(newModel);

                    for (const paragraph of update.paragraphs) {
                        const paraInMap = map.getParagraphFromMarker(paragraph);
                        if (paraInMap) {
                            copyParagraph(paraInMap, paragraph);
                        } else {
                            // TODO: error handling
                        }
                    }

                    this.updateModel(newModel);

                    break;
            }
        } else {
            this.lastVersion++;
            this.lastOwner = owner;

            switch (update.type) {
                case 'model':
                    // TODO: Merge model
                    this.updateModel(update.model);

                    break;

                case 'paragraph':
                    const newModel = this.mergeParagraphs(baseOnVersion, lastModel, update, owner);

                    this.updateModel(newModel);

                    break;
            }

            updateOwner = 'Multiple';
        }

        this.dispatch(update, updateOwner, this.lastVersion, baseOnVersion);
    }

    private mergeParagraphs(
        baseOnVersion: number,
        lastModel: ContentModelDocument,
        update: CoauthoringUpdateParagraph,
        owner: string
    ) {
        const baseMap = new ParagraphMapBase();
        const newMap = new ParagraphMapBase();
        const baseModel = this.models[baseOnVersion];
        const newModel = cloneModel(lastModel, {
            paragraphCloner: (target, source) => {
                newMap.copyParagraphMarker(target, source);
            },
        });

        newMap.scanParagraphs(newModel);
        baseMap.scanParagraphs(baseModel);
        const paragraphsFromUpdate = update.paragraphs;

        update.paragraphs = [];

        for (const paraInUpdateModel of paragraphsFromUpdate) {
            // paraInUpdateModel: The paragraph passed from client side
            // paraInNewModel: The paragraph with the same marker from new model that is cloned from latest model
            // paraInBaseModel: The paragraph with the same marker from base model that is used by client to generate the update
            // Now we need to update paraInNewModel using changes from paraInUpdateModel compared to paraInBaseModel
            const paraInNewModel = newMap.getParagraphFromMarker(paraInUpdateModel);
            const paraInBaseModel = baseMap.getParagraphFromMarker(paraInUpdateModel);

            console.log('Start to merge: From owner: ' + owner);
            console.log(paraInBaseModel?.segments);
            console.log(paraInNewModel?.segments);
            console.log(paraInUpdateModel?.segments);

            if (paraInNewModel && paraInBaseModel) {
                let newIndex = 0;
                let updateIndex = 0;
                const handledSegments: ReadonlyContentModelSegment[] = [];
                let sameSegmentIndex: number;

                for (; updateIndex < paraInUpdateModel.segments.length; updateIndex++) {
                    const updateSegment = paraInUpdateModel.segments[updateIndex];
                    const newSegment = paraInNewModel.segments[newIndex];

                    if (
                        newIndex < paraInNewModel.segments.length &&
                        areSameSegments(updateSegment, paraInNewModel.segments[newIndex])
                    ) {
                        handledSegments.push(newSegment);
                        newIndex++;
                    } else if (
                        (sameSegmentIndex = paraInNewModel.segments.findIndex(
                            seg =>
                                areSameSegments(updateSegment, seg) &&
                                !handledSegments.includes(seg)
                        )) > -1
                    ) {
                        // Segment exists in new model but at different position
                        handledSegments.push(paraInNewModel.segments[sameSegmentIndex]);
                        newIndex = sameSegmentIndex + 1;
                    } else if (
                        !paraInBaseModel.segments.some(seg => areSameSegments(seg, updateSegment))
                    ) {
                        paraInNewModel.segments.splice(newIndex, 0, updateSegment);
                        handledSegments.push(updateSegment);
                        newIndex++;
                    }
                }

                // Remove segments that are not in update
                for (let i = paraInNewModel.segments.length - 1; i >= 0; i--) {
                    const segment = paraInNewModel.segments[i];

                    if (
                        !handledSegments.includes(segment) && // Not handled yet
                        paraInBaseModel.segments.some(seg => areSameSegments(seg, segment)) // And exists in base model, that means it is removed in update
                    ) {
                        paraInNewModel.segments.splice(i, 1);
                    }
                }

                update.paragraphs.push(paraInNewModel);
            } else {
                // TODO: error handling
            }
        }

        return newModel;
    }

    private dispatch(
        update: CoauthoringUpdate,
        updateOwner: string,
        version: number,
        originalVersion: number
    ) {
        window.setTimeout(() => {
            for (const client of this.clients) {
                client.onRemoteUpdate(update, updateOwner, version, originalVersion);
            }
        }, 1000);
    }

    private updateModel(model: ContentModelDocument) {
        this.models[this.lastVersion] = model;

        getObjectKeys(this.models).forEach(key => {
            if (key <= this.lastVersion - MAX_VERSIONS_TO_KEEP) {
                delete this.models[key];
            }
        });
    }
}

function copyParagraph(paragraph: ContentModelParagraph, sourceParagraph: ContentModelParagraph) {
    const mutablePara = paragraph;
    mutablePara.segments = sourceParagraph.segments;
    mutablePara.format = sourceParagraph.format;
    mutablePara.decorator = sourceParagraph.decorator;
    mutablePara.segmentFormat = sourceParagraph.segmentFormat;
}
