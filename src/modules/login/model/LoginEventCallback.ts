export abstract class LoginEventCallback {
  readonly eventType = "login";
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