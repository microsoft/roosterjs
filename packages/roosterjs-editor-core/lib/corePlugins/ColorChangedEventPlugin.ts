import { arrayPush, getComputedStyles, safeInstanceOf, toArray } from 'roosterjs-editor-dom';
import {
    ColorChangedEventPluginState,
    ColorTransformDirection,
    DarkModeDatasetNames,
    EditorOptions,
    IEditor,
    PluginEvent,
    PluginEventType,
    PluginWithState,
} from 'roosterjs-editor-types';

const enum ColorAttributeEnum {
    CssColor = 0,
    HtmlColor = 1,
    CssDataSet = 2,
    HtmlDataSet = 3,
}

const ColorAttributeName: { [key in ColorAttributeEnum]: string }[] = [
    {
        [ColorAttributeEnum.CssColor]: 'color',
        [ColorAttributeEnum.HtmlColor]: 'color',
        [ColorAttributeEnum.CssDataSet]: DarkModeDatasetNames.OriginalStyleColor,
        [ColorAttributeEnum.HtmlDataSet]: DarkModeDatasetNames.OriginalAttributeColor,
    },
    {
        [ColorAttributeEnum.CssColor]: 'background-color',
        [ColorAttributeEnum.HtmlColor]: 'bgcolor',
        [ColorAttributeEnum.CssDataSet]: DarkModeDatasetNames.OriginalStyleBackgroundColor,
        [ColorAttributeEnum.HtmlDataSet]: DarkModeDatasetNames.OriginalAttributeBackgroundColor,
    },
];

/**
 * @internal
 * ColorChangedEventPlugin handles color changes event
 */
export default class ColorChangedEventPlugin
    implements PluginWithState<ColorChangedEventPluginState> {
    private editor: IEditor;
    private state: ColorChangedEventPluginState;

    /**
     * Construct a new instance of PendingFormatStatePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor(options: EditorOptions, contentDiv: HTMLDivElement) {
        this.state = {
            contentDiv: contentDiv,
            isDarkMode: options.inDarkMode,
            getDarkColor: options.getDarkColor,
            onExternalContentTransform: options.onExternalContentTransform,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ColorChangedEvent';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.clear();
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType === PluginEventType.ColorChanged) {
            const rootNode = event.rootNode || this.state.contentDiv;
            const direction =
                event.direction || this.state.isDarkMode
                    ? ColorTransformDirection.DarkToLight
                    : ColorTransformDirection.LightToDark;

            this.transformColor(
                this.state.isDarkMode,
                rootNode,
                direction,
                this.state.onExternalContentTransform,
                this.state.getDarkColor,
                event.includeSelf,
                event.callback
            );
        }
    }

    private transformColor = (
        isDarkMode: boolean,
        rootNode: Node,
        direction: ColorTransformDirection,
        onExternalContentTransform: (htmlIn: HTMLElement) => void,
        getDarkColor: (lightColor: string) => string,
        includeSelf?: boolean,
        callback?: () => void
    ) => {
        const elementsToTransform = isDarkMode ? this.getAll(rootNode, includeSelf) : [];
        const transformFunction =
            direction == ColorTransformDirection.DarkToLight
                ? this.transformToLightMode
                : onExternalContentTransform ||
                  ((element: HTMLElement) => this.transformToDarkMode(element, getDarkColor));

        callback?.();

        elementsToTransform.forEach(
            element => element?.dataset && element.style && transformFunction(element)
        );
    };

    private transformToLightMode(element: HTMLElement) {
        ColorAttributeName.forEach(names => {
            // Reset color styles based on the content of the ogsc/ogsb data element.
            // If those data properties are empty or do not exist, set them anyway to clear the content.
            if (element.dataset[names[ColorAttributeEnum.CssDataSet]]) {
                element.style.setProperty(
                    names[ColorAttributeEnum.CssColor],
                    this.getValueOrDefault(
                        element.dataset[names[ColorAttributeEnum.CssDataSet]],
                        ''
                    )
                );
                delete element.dataset[names[ColorAttributeEnum.CssDataSet]];
            }

            // Some elements might have set attribute colors. We need to reset these as well.
            const value = element.dataset[names[ColorAttributeEnum.HtmlDataSet]];

            if (this.getValueOrDefault(value, null)) {
                element.setAttribute(names[ColorAttributeEnum.HtmlColor], value);
            } else {
                element.removeAttribute(names[ColorAttributeEnum.HtmlColor]);
            }

            delete element.dataset[names[ColorAttributeEnum.HtmlDataSet]];
        });
    }

    private transformToDarkMode(element: HTMLElement, getDarkColor: (color: string) => string) {
        const computedValues = getComputedStyles(element, ['color', 'background-color']);

        ColorAttributeName.forEach((names, index) => {
            const styleColor = element.style.getPropertyValue(names[ColorAttributeEnum.CssColor]);
            const attrColor = element.getAttribute(names[ColorAttributeEnum.HtmlColor]);

            if (
                !element.dataset[names[ColorAttributeEnum.CssDataSet]] &&
                !element.dataset[names[ColorAttributeEnum.HtmlDataSet]] &&
                (styleColor || attrColor) &&
                styleColor != 'inherit' // For inherit style, no need to change it and let it keep inherit from parent element
            ) {
                const newColor = getDarkColor(computedValues[index] || styleColor || attrColor);
                element.style.setProperty(
                    names[ColorAttributeEnum.CssColor],
                    newColor,
                    'important'
                );
                element.dataset[names[ColorAttributeEnum.CssDataSet]] = styleColor || '';

                if (attrColor) {
                    element.setAttribute(names[ColorAttributeEnum.HtmlColor], newColor);
                    element.dataset[names[ColorAttributeEnum.HtmlDataSet]] = attrColor;
                }
            }
        });
    }

    private getValueOrDefault(value: string, defaultValue: string | null) {
        return value && value != 'undefined' && value != 'null' ? value : defaultValue;
    }

    private getAll(rootNode: Node, includeSelf: boolean): HTMLElement[] {
        const result: HTMLElement[] = [];

        if (safeInstanceOf(rootNode, 'HTMLElement')) {
            if (includeSelf) {
                result.push(rootNode);
            }
            const allChildren = rootNode.getElementsByTagName('*');
            arrayPush(result, toArray(allChildren));
        } else if (safeInstanceOf(rootNode, 'DocumentFragment')) {
            const allChildren = rootNode.querySelectorAll('*');
            arrayPush(result, toArray(allChildren));
        }

        return result;
    }

    private clear() {
        this.state.contentDiv = null;
        this.state.isDarkMode = null;
        this.state.onExternalContentTransform = null;
        this.state.getDarkColor = null;
    }
}
