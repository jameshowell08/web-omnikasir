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

export class ShowErrorToast implements LoginEventCallback {
    errorMessage: string

    constructor(errorMessage: string) {
        this.errorMessage = errorMessage
    }
}