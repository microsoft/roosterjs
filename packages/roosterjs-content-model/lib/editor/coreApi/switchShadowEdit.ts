import contentModelToDom from '../../modelToDom/contentModelToDom';
import domToContentModel from '../../domToModel/domToContentModel';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEditorCore } from '../ContentModelEditor';
import { DomToModelOption, ModelToDomOption } from '../../publicTypes/IContentModelEditor';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { getSelectionPath, moveContentWithEntityPlaceholders } from 'roosterjs-editor-dom';
import {
    EditorCore,
    ExperimentalFeatures,
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
    SwitchShadowEdit,
} from 'roosterjs-editor-types';

export function createContentModel(
    core: ContentModelEditorCore,
    option?: DomToModelOption
): ContentModelDocument {
    const shadowEditoModel = core.shadowEditContentModel;
    const cachedModel = core.reuseModel && !option?.forceNew ? core.cachedModel : null;

    return (
        shadowEditoModel ||
        cachedModel ||
        domToContentModel(core.contentDiv, createEditorContext(core), {
            selectionRange: core.api.getSelectionRangeEx(core),
            alwaysNormalizeTable: true,
            ...(option || {}),
        })
    );
}
/**
 * Set content with content model
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export function setContentModel(
    core: ContentModelEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption
) {
    // const range =
    contentModelToDom(
        core.contentDiv.ownerDocument,
        core.contentDiv,
        model,
        createEditorContext(core),
        option
    );

    // core.api.select(core, range);
}

/**
 * Create a EditorContext object used by ContentModel API
 */
function createEditorContext(core: ContentModelEditorCore): EditorContext {
    return {
        isDarkMode: core.lifecycle.isDarkMode,
        defaultFormat: core.defaultFormat,
        getDarkColor: core.lifecycle.getDarkColor,
        darkColorHandler: core.darkColorHandler,
        addDelimiterForEntity:
            core.lifecycle.experimentalFeatures.indexOf(
                ExperimentalFeatures.InlineEntityReadOnlyDelimiters
            ) >= 0,
    };
}

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const contentModelCore = core as ContentModelEditorCore;
    const { lifecycle, contentDiv, originalContentModel } = contentModelCore;
    let {
        shadowEditEntities,
        shadowEditFragment,
        shadowEditSelectionPath,
        shadowEditTableSelectionPath,
        shadowEditImageSelectionPath,
    } = lifecycle;
    const wasInShadowEdit = !!shadowEditFragment;

    const getShadowEditSelectionPath = (
        selectionType: SelectionRangeTypes,
        shadowEditSelection?: SelectionRangeEx
    ) => {
        return (
            (shadowEditSelection?.type == selectionType &&
                shadowEditSelection.ranges
                    .map(range => getSelectionPath(contentDiv, range))
                    .map(w => w!!)) ||
            null
        );
    };

    if (isOn) {
        if (!wasInShadowEdit) {
            contentModelCore.originalContentModel = createContentModel(contentModelCore);
            contentModelCore.shadowEditContentModel = createContentModel(contentModelCore, {
                forceNew: true,
            });

            //#region To be compatible with old API only
            const selection = core.api.getSelectionRangeEx(core);
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditTableSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.TableSelection,
                selection
            );
            shadowEditImageSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.ImageSelection,
                selection
            );

            shadowEditEntities = {};
            shadowEditFragment = moveContentWithEntityPlaceholders(contentDiv, shadowEditEntities);

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: shadowEditFragment,
                    selectionPath: shadowEditSelectionPath,
                },
                false /*broadcast*/
            );

            lifecycle.shadowEditFragment = shadowEditFragment;
            lifecycle.shadowEditSelectionPath = shadowEditSelectionPath;
            lifecycle.shadowEditTableSelectionPath = shadowEditTableSelectionPath;
            lifecycle.shadowEditImageSelectionPath = shadowEditImageSelectionPath;
            lifecycle.shadowEditEntities = shadowEditEntities;

            //#endregion
        }

        if (contentModelCore.shadowEditContentModel) {
            setContentModel(contentModelCore, contentModelCore.shadowEditContentModel);
        }
    } else {
        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditSelectionPath = null;
        lifecycle.shadowEditEntities = null;
        contentModelCore.shadowEditContentModel = undefined;
        contentModelCore.originalContentModel = undefined;

        if (wasInShadowEdit) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (originalContentModel) {
                setContentModel(contentModelCore, originalContentModel);
            }
            core.api.focus(core);
        }
    }
};
