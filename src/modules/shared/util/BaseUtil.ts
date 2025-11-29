export class BaseUtil {
    /**
    * This function is used for testing purposes. This function aims to simulate a delay in the response from the server.
    * @param ms - The amount of milliseconds to delay.
    **/
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}