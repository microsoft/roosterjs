import { ContentModelPane, ContentModelPaneProps } from './ContentModelPane';
import { createRibbonPlugin, RibbonPlugin } from '../../roosterjsReact/ribbon';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { setCurrentContentModel } from './currentModel';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export class ContentModelPanePlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    private contentModelRibbon: RibbonPlugin;

    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model');
        this.contentModelRibbon = createRibbonPlugin();
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
        if (e.eventType == 'contentChanged' && e.source == 'RefreshModel') {
            this.getComponent(component => {
                const model = this.editor.getContentModelCopy('connected');
                component.setContentModel(model);
                setCurrentContentModel(model);
            });
        } else if (
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
        };
    }

    private onModelChangeFromSelection = () => {
        if (this.editor.hasFocus()) {
            this.onModelChange();
        }
    };

    private onModelChange = () => {
        this.getComponent(component => {
            const model = this.editor.getContentModelCopy('connected');
            component.setContentModel(model);
            setCurrentContentModel(model);
        });
    };
}
