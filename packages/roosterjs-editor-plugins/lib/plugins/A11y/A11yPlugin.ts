// import { AnnounceData } from 'roosterjs-editor-types/lib/interface/AnnounceData';
// import { cacheGetEventData, clearEventDataCache } from 'roosterjs-editor-dom/lib';
// import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types/lib';
// import { KnownAnnouncedEvents } from 'roosterjs-editor-types/lib/enum/KnownAnnouncedEvents';

// export default class A11yPlugin implements EditorPlugin {
//     /**
//      *
//      */
//     constructor(
//         private announceCallback: (text: string) => void,
//         private readonly stringsMap: Map<KnownAnnouncedEvents, string>
//     ) {}

//     private editor: IEditor | undefined = undefined;

//     getName() {
//         return 'A11yPlugin';
//     }
//     initialize(editor: IEditor) {
//         this.editor = editor;
//     }
//     dispose() {
//         this.editor = undefined;
//     }
//     onPluginEvent(event: PluginEvent) {
//         if (
//             event.eventType == PluginEventType.ContentChanged &&
//             event.additionalData?.announceData
//         ) {
//             const { knownAnnounceStrings, text } = event.additionalData.announceData;
//             let stringToAnnounce =
//                 knownAnnounceStrings && this.stringsMap.has(knownAnnounceStrings)
//                     ? this.stringsMap.get(knownAnnounceStrings)
//                     : text;
//             if (stringToAnnounce) {
//                 this.announceCallback(stringToAnnounce);
//             }
//         }
//     }
// }

// const A11Y_EVENT_CACHE_KEY = 'A11Y_EVENT_CACHE_KEY';

// function cacheGetTextToAnnounce(event: PluginEvent, text: AnnounceData | undefined = undefined) {
//     return cacheGetEventData<AnnounceData | undefined>(event, A11Y_EVENT_CACHE_KEY, () => text);
// }
