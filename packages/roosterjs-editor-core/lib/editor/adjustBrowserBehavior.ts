import { Browser } from 'roosterjs-editor-dom';
import { DocumentCommand } from 'roosterjs-editor-types';

const COMMANDS: {
    [command: string]: any;
} = Browser.isFirefox
    ? {
          /**
           * Disable these object resizing for firefox since other browsers don't have these behaviors
           */
          [DocumentCommand.EnableObjectResizing]: false,
          [DocumentCommand.EnableInlineTableEditing]: false,
      }
    : Browser.isIE
    ? {
          /**
           * Change the default paragraph separater to DIV. This is mainly for IE since its default setting is P
           */
          [DocumentCommand.DefaultParagraphSeparator]: 'div',

          /**
           * Disable auto link feature in IE since we have our own implementation
           */
          [DocumentCommand.AutoUrlDetect]: false,
      }
    : {};

/**
 * Execute document command to adjust browser default behavior
 */
export default function adjustBrowserBehavior() {
    Object.keys(COMMANDS).forEach(command => {
        // Catch any possible exception since this should not block the initialization of editor
        try {
            document.execCommand(command, false, COMMANDS[command]);
        } catch {}
    });
}
