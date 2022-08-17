import ContentModelPane, { ContentModelPaneProps } from './ContentModelPane';
import isContentModelEditor from '../../editor/isContentModelEditor';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { createRibbonPlugin, RibbonPlugin } from 'roosterjs-react';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { setCurrentContentModel } from './currentModel';
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
        if (e.eventType == PluginEventType.Input || e.eventType == PluginEventType.ContentChanged) {
            this.onModelChange();
        }

        this.contentModelRibbon.onPluginEvent(e);
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
            const model = isContentModelEditor(this.editor)
                ? this.editor.createContentModel()
                : null;
            component.setContentModel(model);
            setCurrentContentModel(this.editor, model);
        });
    };
}
