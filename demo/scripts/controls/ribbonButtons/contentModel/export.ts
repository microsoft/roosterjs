import ContentModelRibbonButton from './ContentModelRibbonButton';
import { cloneModel } from 'roosterjs-content-model-core';
import { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import {
    contentModelToDom,
    createModelToDomContext,
    parseEntityClassName,
} from 'roosterjs-content-model-dom';

/**
 * Key of localized strings of Zoom button
 */
export type ExportButtonStringKey = 'buttonNameExport';

/**
 * "Export content" button on the format ribbon
 */
export const exportContent: ContentModelRibbonButton<ExportButtonStringKey> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Export',
    iconName: 'Export',
    flipWhenRtl: true,
    onClick: editor => {
        // TODO: We need a export function in dev code to handle this feature
        const win = editor.getDocument().defaultView.open();

        editor.formatContentModel(model => {
            const clonedModel = cloneModel(model, {
                includeCachedElement: (node, type) => {
                    switch (type) {
                        case 'cache':
                            return undefined;

                        case 'general':
                            return node.cloneNode() as HTMLElement;

                        case 'entity':
                            const clonedRoot = node.cloneNode(true) as HTMLElement;
                            const format: ContentModelEntityFormat = {};
                            let isEntity = false;

                            clonedRoot.classList.forEach(name => {
                                isEntity = parseEntityClassName(name, format) || isEntity;
                            });

                            if (isEntity && format.id && format.entityType) {
                                editor.triggerEvent(PluginEventType.EntityOperation, {
                                    operation: EntityOperation.ReplaceTemporaryContent,
                                    entity: {
                                        wrapper: clonedRoot,
                                        id: format.id,
                                        type: format.entityType,
                                        isReadonly: !!format.isReadonly,
                                    },
                                });
                            }

                            return clonedRoot;
                    }
                },
            });

            contentModelToDom(
                win.document,
                win.document.body,
                clonedModel,
                createModelToDomContext()
            );

            return false;
        });
    },
};
