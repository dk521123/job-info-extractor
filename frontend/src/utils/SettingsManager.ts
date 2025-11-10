export type ThemeMode = 'light' | 'dark';
export type AppLanguage = 'en' | 'ja';

export class SettingsManager {
    private static readonly KEY_FOR_THEME = 'settings_themeMode';
    public static readonly DEFAULT_THEME: ThemeMode = 'light';

    private static readonly KEY_FOR_LANG = 'settings_lang';
    public static readonly DEFAULT_LANG: AppLanguage = 'ja';

    private static readonly KEY_FOR_ROW_LIMIT = 'settings_rowLimit';
    public static readonly DEFAULT_ROW_LIMIT: number = 20;

    // About theme
    public static getThemeMode(): ThemeMode {
        const mode = localStorage.getItem(SettingsManager.KEY_FOR_THEME);
        return (mode === 'light' || mode === 'dark') ? mode as ThemeMode: SettingsManager.DEFAULT_THEME; 
    }
    public static setThemeMode(mode: ThemeMode) {
        localStorage.setItem(SettingsManager.KEY_FOR_THEME, mode);
    }

    // About language
    public static getLang(): AppLanguage {
        try {
            const storedValue = localStorage.getItem(SettingsManager.KEY_FOR_LANG);
            if (storedValue === 'en' || storedValue === 'ja') {
                return storedValue as AppLanguage;
            }
            return SettingsManager.DEFAULT_LANG;
        } catch (e) {
            console.warn('Failed to load LocalStorage', e);
            return SettingsManager.DEFAULT_LANG;
        }
    }

    public static setLang(value: AppLanguage): void {
        try {
            localStorage.setItem(SettingsManager.KEY_FOR_LANG, value);
        } catch (e) {
            console.warn('Failed to save LocalStorage', e);
        }
    }

    // About row limit
    public static getRowLimit(): number {
        try {
            const storedValue = localStorage.getItem(SettingsManager.KEY_FOR_ROW_LIMIT);            
            const numericValue = Number(storedValue || SettingsManager.DEFAULT_ROW_LIMIT.toString());
            if (isNaN(numericValue) || numericValue <= 0) {
                return SettingsManager.DEFAULT_ROW_LIMIT;
            }
            return numericValue;
        } catch (e) {
            console.warn('Failed to load LocalStorage', e);
            return SettingsManager.DEFAULT_ROW_LIMIT;
        }
    }

    public static setRowLimit(value: number): void {
        try {
            localStorage.setItem(SettingsManager.KEY_FOR_ROW_LIMIT, value.toString());
        } catch (e) {
            console.warn('Failed to save LocalStorage', e);
        }
    }
}
