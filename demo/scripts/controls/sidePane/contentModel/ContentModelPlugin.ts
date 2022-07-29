import ContentModelPane, { ContentModelPaneProps } from './ContentModelPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { ChangeSource, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument, isContentModelEditor } from 'roosterjs-content-model';
import { createRibbonPlugin, RibbonPlugin } from 'roosterjs-react';
import { SidePaneElementProps } from '../SidePaneElement';

export default class ContentModelPlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    private contentModelRibbon: RibbonPlugin;

    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model (Under development)');
        this.contentModelRibbon = createRibbonPlugin();
    }

    initialize(editor: IEditor): void {
        super.initialize(editor);

        this.contentModelRibbon.initialize(editor);
        editor.getDocument().addEventListener('selectionchange', this.onModelChange);
    }

    dispose(): void {
        this.contentModelRibbon.dispose();
        this.editor.getDocument().removeEventListener('selectionchange', this.onModelChange);

        super.dispose();
    }

    onPluginEvent(e: PluginEvent) {
        if (
            e.eventType == PluginEventType.ContentChanged &&
            (e.source == ChangeSource.SwitchToDarkMode ||
                e.source == ChangeSource.SwitchToLightMode)
        ) {
            this.onModelChange();
        }

        this.contentModelRibbon.onPluginEvent(e);
    }

    private onGetModel = () => {
        return isContentModelEditor(this.editor) ? this.editor.getContentModel() : null;
    };

    protected getComponentProps(baseProps: SidePaneElementProps): ContentModelPaneProps {
        return {
            ...baseProps,
            model: null,
            ribbonPlugin: this.contentModelRibbon,
            onUpdateModel: this.onGetModel,
            onCreateDOM: this.onCreateDOM,
        };
    }

    private onModelChange = () => {
        this.getComponent(component => {
            const model = this.onGetModel();
            component.setContentModel(model);
        });
    };

    private onCreateDOM = (model: ContentModelDocument) => {
        if (isContentModelEditor(this.editor)) {
            const fragment = this.editor.getDOMFromContentModel(model);
            const win = window.open('about:blank');

            win.document.body.appendChild(fragment);
        }
    };
}
