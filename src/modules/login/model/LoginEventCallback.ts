import { Callback } from "../../shared/model/Callback"

export abstract class LoginEventCallback extends Callback {
    constructor() { super("login") }
}

export class NavigateToOverviewPage extends LoginEventCallback { }

export class ShowErrorOnField extends LoginEventCallback {
    constructor(
        public fieldName: string, 
        public error: string
    ) { super() }
}

export class ShowErrorToast extends LoginEventCallback {
    constructor(
        public errorMessage: string
    ) { super() }
}