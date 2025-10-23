import { Constants } from "@/src/lib/constants"
import { LoginEventCallback, NavigateToHomePage } from "../model/LoginEventCallback";

export class LoginController {
    eventCallback: (event: LoginEventCallback) => void

    constructor(
        eventCallback: (event: LoginEventCallback) => void
    ) {
        this.eventCallback = eventCallback
    }

    async login(formData: FormData) {
        const payload = {
            username: formData.get("username"),
            password: formData.get("password")
        }

        try {
            const response = await fetch(Constants.LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                this.eventCallback(new NavigateToHomePage())
            } 
        } catch (error) {
            console.error(error)
        }
    }
}