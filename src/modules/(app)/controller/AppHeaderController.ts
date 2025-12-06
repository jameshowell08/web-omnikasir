
import { Constants } from "../../shared/model/Constants";
import { AppHeaderEventCallback, NavigateToUrl } from "../model/AppHeaderEventCallback";

export class AppHeaderController {

    constructor(
        private eventCallback: (e: AppHeaderEventCallback) => void
    ) { }

    public async logout() {
        console.log("logging user out...")
        const res = await fetch(Constants.LOGOUT_API_URL, { method: "POST" })

        if (res.ok) {
            this.eventCallback(new NavigateToUrl(Constants.LOGIN_URL))
        }
    }

}