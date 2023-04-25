import ContentModelBeforePasteEvent from '../../../publicTypes/event/ContentModelBeforePasteEvent';

const DEFAULT_BORDER_STYLE = 'solid 1px #d4d4d4';

export function handleExcelOnline(ev: ContentModelBeforePasteEvent) {
    if (!ev.domToModelOption.formatParserOverride) {
        ev.domToModelOption.formatParserOverride = {};
    }

    if (!ev.domToModelOption.processorOverride) {
        ev.domToModelOption.processorOverride = {};
    }

    ev.domToModelOption.processorOverride.element = (group, element, context) => {
        if (element.tagName.toLowerCase() === 'div' && element.getAttribute('data-ccp-timestamp')) {
            context.elementProcessors.child(group, element, context);
        } else {
            context.defaultElementProcessors.element(group, element, context);
        }
    };

    ev.domToModelOption.formatParserOverride.border = (format, element) => {
        if (element.style.border === 'none') {
            format.borderBottom = DEFAULT_BORDER_STYLE;
            format.borderRight = DEFAULT_BORDER_STYLE;
            format.borderTop = DEFAULT_BORDER_STYLE;
            format.borderLeft = DEFAULT_BORDER_STYLE;
        }
    };
}
