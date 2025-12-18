export type AppHeaderEventCallback = object

export class NavigateToUrl implements AppHeaderEventCallback {

    constructor (
        public url: string
    ) { }

}