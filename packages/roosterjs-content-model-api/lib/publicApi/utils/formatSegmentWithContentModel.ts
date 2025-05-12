import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
    getSelectedSegmentsAndParagraphs,
    mergeTextSegments,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelEntity,
    ContentModelSegmentFormat,
    EditorContext,
    FormattableRoot,
    IEditor,
    PluginEventData,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the selected segment using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param toggleStyleCallback The callback to format the segment. It will be called with current selected table. If no table is selected, it will not be called.
 * @param segmentHasStyleCallback The callback used for checking if the given segment already has required format
 * @param includingFormatHolder True to also include format holder of list item when search selected segments
 * @param afterFormatCallback A callback to invoke after format is applied to all selected segments and before the change is applied to DOM tree
 */
export function formatSegmentWithContentModel(
    editor: IEditor,
    apiName: string,
    toggleStyleCallback: (
        format: ContentModelSegmentFormat,
        isTuringOn: boolean,
        segment: ShallowMutableContentModelSegment | null,
        paragraph: ShallowMutableContentModelParagraph | null
    ) => void,
    segmentHasStyleCallback?: (
        format: ContentModelSegmentFormat,
        segment: ShallowMutableContentModelSegment | null,
        paragraph: ShallowMutableContentModelParagraph | null
    ) => boolean,
    includingFormatHolder?: boolean,
    afterFormatCallback?: (model: ReadonlyContentModelDocument) => void
) {
    editor.formatContentModel(
        (model, context) => {
            let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(
                model,
                !!includingFormatHolder,
                true /*includingEntity*/,
                true /*mutate*/
            );
            let isCollapsedSelection =
                segmentAndParagraphs.length >= 1 &&
                segmentAndParagraphs.every(x => x[0].segmentType == 'SelectionMarker');

            // 1. adjust selection to a word if selection is collapsed
            if (isCollapsedSelection) {
                const para = segmentAndParagraphs[0][1];
                const path = segmentAndParagraphs[0][2];

                segmentAndParagraphs = adjustWordSelection(
                    model,
                    segmentAndParagraphs[0][0]
                ).map(x => [x, para, path]);

                if (segmentAndParagraphs.length > 1) {
                    isCollapsedSelection = false;
                }
            }

            // 2. expand selection for entities if any
            const formatsAndSegments: [
                ContentModelSegmentFormat,
                ShallowMutableContentModelSegment | null,
                ShallowMutableContentModelParagraph | null
            ][] = [];
            const modelsFromEntities: [
                ContentModelEntity,
                FormattableRoot,
                ContentModelDocument
            ][] = [];

            segmentAndParagraphs.forEach(item => {
                if (item[0].segmentType == 'Entity') {
                    expandEntitySelections(editor, item[0], formatsAndSegments, modelsFromEntities);
                } else {
                    formatsAndSegments.push([item[0].format, item[0], item[1]]);
                }
            });

            // 3. check if we should turn format on (when not all selection has the required format already)
            // or off (all selections already have the required format)
            const isTurningOff = segmentHasStyleCallback
                ? formatsAndSegments.every(([format, segment, paragraph]) =>
                      segmentHasStyleCallback(format, segment, paragraph)
                  )
                : false;

            // 4. invoke the callback function to apply the format
            formatsAndSegments.forEach(([format, segment, paragraph]) => {
                toggleStyleCallback(format, !isTurningOff, segment, paragraph);
            });

            // 5. after format is applied to all selections, invoke another callback to do some clean up before write the change back
            afterFormatCallback?.(model);

            // 6. finally merge segments if possible, to avoid fragmentation
            formatsAndSegments.forEach(([_, __, paragraph]) => {
                if (paragraph) {
                    mergeTextSegments(paragraph);
                }
            });

            // 7. Write back models that we got from entities (if any)
            writeBackEntities(editor, modelsFromEntities);

            // 8. if the selection is still collapsed, it means we didn't actually applied format, set a pending format so it can be applied when user type
            // otherwise, write back to editor
            if (isCollapsedSelection) {
                context.newPendingFormat = segmentAndParagraphs[0][0].format;
                editor.focus();
                return false;
            } else {
                return formatsAndSegments.length > 0;
            }
        },
        {
            apiName,
        }
    );
}

/**
 * Create EditorContext for an entity
 * @param editor The editor object
 * @param entity The entity to create the context for
 * @returns The EditorContext for the entity
 */
export function createEditorContextForEntity(
    editor: IEditor,
    entity: ContentModelEntity
): EditorContext {
    const domHelper = editor.getDOMHelper();
    const context: EditorContext = {
        isDarkMode: editor.isDarkMode(),
        defaultFormat: { ...entity.format },
        darkColorHandler: editor.getColorManager(),
        addDelimiterForEntity: false,
        allowCacheElement: false,
        domIndexer: undefined,
        zoomScale: domHelper.calculateZoomScale(),
        experimentalFeatures: [],
    };

    if (editor.getDocument().defaultView?.getComputedStyle(entity.wrapper).direction == 'rtl') {
        context.isRootRtl = true;
    }

    return context;
}

function expandEntitySelections(
    editor: IEditor,
    entity: ContentModelEntity,
    formatsAndSegments: [
        ContentModelSegmentFormat,
        ShallowMutableContentModelSegment | null,
        ShallowMutableContentModelParagraph | null
    ][],
    modelsFromEntities: [ContentModelEntity, FormattableRoot, ContentModelDocument][]
) {
    const { id, entityType: type, isReadonly } = entity.entityFormat;

    if (id && type) {
        const formattableRoots: FormattableRoot[] = [];
        const entityOperationEventData: PluginEventData<'entityOperation'> = {
            entity: { id, type, isReadonly: !!isReadonly, wrapper: entity.wrapper },
            operation: 'beforeFormat',
            formattableRoots,
        };

        editor.triggerEvent('entityOperation', entityOperationEventData);

        formattableRoots.forEach(root => {
            if (entity.wrapper.contains(root.element)) {
                const editorContext = createEditorContextForEntity(editor, entity);
                const context = createDomToModelContext(editorContext, root.domToModelOptions);

                // Treat everything as selected since the parent entity is selected
                context.isInSelection = true;

                const model = domToContentModel(root.element, context);
                const selections = getSelectedSegmentsAndParagraphs(
                    model,
                    false /*includingFormatHolder*/,
                    false /*includingEntity*/,
                    true /*mutate*/
                );

                selections.forEach(item => {
                    formatsAndSegments.push([item[0].format, item[0], item[1]]);
                });

                modelsFromEntities.push([entity, root, model]);
            }
        });
    }
}

function writeBackEntities(
    editor: IEditor,
    modelsFromEntities: [ContentModelEntity, FormattableRoot, ContentModelDocument][]
) {
    modelsFromEntities.forEach(([entity, root, model]) => {
        const editorContext = createEditorContextForEntity(editor, entity);
        const modelToDomContext = createModelToDomContext(editorContext, root.modelToDomOptions);

        contentModelToDom(editor.getDocument(), root.element, model, modelToDomContext);
    });
}
