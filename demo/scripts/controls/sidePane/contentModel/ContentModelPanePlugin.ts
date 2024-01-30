import ContentModelPane, { ContentModelPaneProps } from './ContentModelPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { ContentModelRibbonPlugin } from '../../ribbonButtons/contentModel/ContentModelRibbonPlugin';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { setCurrentContentModel } from './currentModel';
import { SidePaneElementProps } from '../SidePaneElement';

export default class ContentModelPanePlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    private contentModelRibbon: ContentModelRibbonPlugin;

    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model (Under development)');
        this.contentModelRibbon = new ContentModelRibbonPlugin();
    }

    initialize(editor: IEditor): void {
        super.initialize(editor);

        this.contentModelRibbon.initialize(editor as IContentModelEditor); // Temporarily use IContentModelEditor here. TODO: Port side pane to use IStandaloneEditor
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
        if (e.eventType == PluginEventType.ContentChanged && e.source == 'RefreshModel') {
            this.getComponent(component => {
                // TODO: Port to use IStandaloneEditor and remove type cast here
                const model = (this.editor as IContentModelEditor).createContentModel();
                component.setContentModel(model);
                setCurrentContentModel(model);
            });
        } else if (
            e.eventType == PluginEventType.Input ||
            e.eventType == PluginEventType.ContentChanged
        ) {
            this.onModelChange();
        }

        // this.contentModelRibbon.onPluginEvent(e);
    }

    getInnerRibbonPlugin() {
        return this.contentModelRibbon;
    }

    protected getComponentProps(baseProps: SidePaneElementProps): ContentModelPaneProps {
        return {
            ...baseProps,
            model: null,
            ribbonPlugin: this.contentModelRibbon,
        };
    }

    private onModelChangeFromSelection = () => {
        if (this.editor.hasFocus()) {
            this.onModelChange();
        }
    };

    private onModelChange = () => {
        this.getComponent(component => {
            // TODO: Port to use IStandaloneEditor and remove type cast here
            const model = (this.editor as IContentModelEditor).createContentModel();
            component.setContentModel(model);
            setCurrentContentModel(model);
        });
    };
}
