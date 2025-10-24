export type LoginEventCallback = object

export class NavigateToHomePage implements LoginEventCallback {}
export class ShowErrorOnField implements LoginEventCallback {
    fieldName: string
    error: string

    constructor(fieldName: string, error: string) {
        this.fieldName = fieldName
        this.error = error
    }
}