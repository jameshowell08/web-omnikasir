export class BaseUtil {
    /**
    * This function is used for testing purposes. This function aims to simulate a delay in the response from the server.
    * @param ms - The amount of milliseconds to delay.
    * @returns A promise that resolves after the specified amount of milliseconds.
    **/
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * This function is used to format a number to a string with a thousand separator.
     * @param value The number to format.
     * @returns The formatted number as a string.
     */
    public static formatNumber(value: string | number) {
        const stringValue = String(value);
        const numericValue = stringValue.replace(/\D/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    public static unformatNumber(value: string) {
        return value.replace(/\./g, "");
    }

    public static formatString(str: string, ...values: any[]) {
        return str.replace(/{(\d+)}/g, (match, index) =>
            typeof values[index] !== 'undefined' ? values[index] : match
        );
    }

    private static padDateStart(value: number) {
        return value.toString().padStart(2, "0");
    }

    public static formatDate(date: Date) {
        return `${this.padDateStart(date.getDate())}/${this.padDateStart(date.getMonth() + 1)}/${date.getFullYear()} ${this.padDateStart(date.getHours())}:${this.padDateStart(date.getMinutes())}:${this.padDateStart(date.getSeconds())}`;
    }
}