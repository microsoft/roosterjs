import type { DomToModelOption } from '../context/DomToModelOption';
import type { DomToModelSettings } from '../context/DomToModelSettings';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ModelToDomSettings } from '../context/ModelToDomSettings';

/**
 * Default DOM and Content Model conversion settings for an editor
 */
export interface ContentModelSettings<OptionType, ConfigType> {
    /**
     * Built in options used by editor
     */
    builtIn: OptionType;

    /**
     * Customize options passed in from Editor Options, used for overwrite default option.
     * This will also be used by copy/paste
     */
    customized: OptionType;

    /**
     * Configuration calculated from default and customized options.
     * This is a cached object so that we don't need to cache it every time when we use Content Model
     */
    calculated: ConfigType;
}

/**
 * Current running environment
 */
export interface EditorEnvironment {
    /**
     * Whether editor is running on Mac
     */
    readonly isMac?: boolean;

    /**
     * Whether editor is running on Android
     */
    readonly isAndroid?: boolean;

    /**
     * Whether editor is running on Safari browser
     */
    readonly isSafari?: boolean;

    /**
     * Whether current browser is on mobile or a tablet
     */
    readonly isMobileOrTablet?: boolean;

    /**
     * Settings used by DOM to Content Model conversion
     */
    readonly domToModelSettings: ContentModelSettings<DomToModelOption, DomToModelSettings>;

    /**
     * Settings used by Content Model to DOM conversion
     */
    readonly modelToDomSettings: ContentModelSettings<ModelToDomOption, ModelToDomSettings>;
}
