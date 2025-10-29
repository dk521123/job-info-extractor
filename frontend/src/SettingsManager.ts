export class SettingsManager {
    private static readonly STORAGE_KEY = 'settings_rowLimit';
    public static readonly DEFAULT_ROW_LIMIT: number = 20;

    public static getRowLimit(): number {
        try {
            const storedValue = localStorage.getItem(SettingsManager.STORAGE_KEY);            
            const numericValue = Number(storedValue || SettingsManager.DEFAULT_ROW_LIMIT.toString());
            if (isNaN(numericValue) || numericValue <= 0) {
                return SettingsManager.DEFAULT_ROW_LIMIT;
            }
            return numericValue;
        } catch (e) {
            console.error('Failed to load LocalStorage', e);
            return SettingsManager.DEFAULT_ROW_LIMIT;
        }
    }

    public static setRowLimit(value: number): void {
        try {
            localStorage.setItem(SettingsManager.STORAGE_KEY, value.toString());
        } catch (e) {
            console.error('Failed to save LocalStorage', e);
        }
    }
}
