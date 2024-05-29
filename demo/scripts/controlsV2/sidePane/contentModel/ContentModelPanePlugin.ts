import { cloneModel } from 'roosterjs-content-model-dom';
import { ContentModelPane, ContentModelPaneProps } from './ContentModelPane';
import { createRibbonPlugin, RibbonButton, RibbonPlugin } from '../../roosterjsReact/ribbon';
import { getRefreshButton } from './buttons/refreshButton';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { setCurrentContentModel } from './currentModel';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export class ContentModelPanePlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    private contentModelRibbon: RibbonPlugin;
    private refreshButton: RibbonButton<string>;

    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model');
        this.contentModelRibbon = createRibbonPlugin();
        this.refreshButton = getRefreshButton(this);
    }

    initialize(editor: IEditor): void {
        super.initialize(editor);

        this.contentModelRibbon.initialize(editor);
        editor.getDocument().addEventListener('selectionchange', this.onModelChangeFromSelection);
    }

    dispose(): void {
        this.contentModelRibbon.dispose();
        this.editor
            .getDocument()
            .removeEventListener('selectionchange', this.onModelChangeFromSelection);

        super.dispose();
    }

    onPluginEvent(e: PluginEvent) {
        if (
            e.eventType == 'input' ||
            e.eventType == 'selectionChanged' ||
            e.eventType == 'editorReady'
        ) {
            this.onModelChange();
        }

        this.contentModelRibbon.onPluginEvent(e);
    }

    getInnerRibbonPlugin() {
        return this.contentModelRibbon;
    }

    protected getComponentProps(baseProps: SidePaneElementProps): ContentModelPaneProps {
        return {
            ...baseProps,
            model: null,
            ribbonPlugin: this.contentModelRibbon,
            refreshButton: this.refreshButton,
        };
    }

    private onModelChangeFromSelection = () => {
        if (this.editor.hasFocus()) {
            this.onModelChange();
        }
    };

    onModelChange = (force?: boolean) => {
        this.getComponent(component => {
            this.editor.formatContentModel(
                model => {
                    const clonedModel = cloneModel(model);
                    component.setContentModel(clonedModel);
                    setCurrentContentModel(clonedModel);

                    return false;
                },
                undefined,
                {
                    tryGetFromCache: !force,
                }
            );
        });
    };
}
