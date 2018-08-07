import { ChangeSource, LinkData, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { Keys, GenericContentEditFeature } from '../ContentEditFeatures';
import {
    Editor,
    cacheGetEventData,
    cacheGetContentSearcher,
    clearContentSearcherCache,
} from 'roosterjs-editor-core';
import { Browser, matchLink } from 'roosterjs-editor-dom';
import { replaceWithNode } from 'roosterjs-editor-api';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const TRAILING_PUNCTUATION_REGEX = /[.+={}\[\]\s:;"',>]+$/i;
const MINIMUM_LENGTH = 5;

export const AutoLink: GenericContentEditFeature<PluginEvent> = {
    keys: [Keys.ENTER, Keys.SPACE, Keys.CONTENTCHANGED],
    initialize: editor =>
        Browser.isIE && editor.getDocument().execCommand('AutoUrlDetect', false, false),
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
    isAvailable: featureSet => featureSet.autoLink,
};

function cacheGetLinkData(event: PluginEvent, editor: Editor): LinkData {
    return event.eventType == PluginEventType.KeyDown ||
        (event.eventType == PluginEventType.ContentChanged && event.source == ChangeSource.Paste)
        ? cacheGetEventData(event, 'LINK_DATA', () => {
              let searcher = cacheGetContentSearcher(event, editor);
              let word = searcher && searcher.getWordBefore();
              if (word && word.length > MINIMUM_LENGTH) {
                  // Check for trailing punctuation
                  let trailingPunctuations = word.match(TRAILING_PUNCTUATION_REGEX);
                  let trailingPunctuation = (trailingPunctuations || [])[0] || '';
                  let candidate = word.substring(0, word.length - trailingPunctuation.length);

                  // Do special handling for ')'
                  if (candidate[candidate.length - 1] == ')' && candidate.indexOf('(') < 0) {
                      candidate = candidate.substr(0, candidate.length - 1);
                  }

                  // Match and replace in editor
                  return matchLink(candidate);
              }
              return null;
          })
        : null;
}

function autoLink(event: PluginEvent, editor: Editor) {
    let searcher = cacheGetContentSearcher(event, editor);
    let anchor = editor.getDocument().createElement('a');
    let linkData = cacheGetLinkData(event, editor);
    anchor.textContent = linkData.originalUrl;
    anchor.href = linkData.normalizedUrl;

    editor.runAsync(() => {
        editor.performAutoComplete(() => {
            replaceWithNode(editor, linkData.originalUrl, anchor, false /* exactMatch */, searcher);

            // The content at cursor has changed. Should also clear the cursor data cache
            clearContentSearcherCache(event);

            // Explicitly trigger ContentChanged event here and do not trigger it from performAutoComplete,
            // because we want the anchor can be handled by other plugins (e.g. HyperLink) before undo snapshot is added
            editor.triggerContentChangedEvent(ChangeSource.AutoLink, anchor);
        });
    });
}
