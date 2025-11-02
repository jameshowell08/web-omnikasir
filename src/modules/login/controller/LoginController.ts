import { Constants } from "@/src/modules/shared/model/constants"
import { LoginEventCallback, NavigateToOverviewPage, ShowErrorOnField, ShowErrorToast } from "../model/LoginEventCallback";

export class LoginController {
    constructor(
        private eventCallback: (event: LoginEventCallback) => void
    ) { }

    async login(formData: FormData) {
        let error = false
        const payload = {
            username: formData.get("username")?.toString() ?? "",
            password: formData.get("password")?.toString() ?? ""
        }

        if (payload.username.length < 5) {
            this.eventCallback(new ShowErrorOnField("username", "Username minimal 5 karakter!"))
            error = true
        }

        if (payload.password.length < 8) {
            this.eventCallback(new ShowErrorOnField("password", "Password minimal 8 karakter!"))
            error = true
        }

        if (error) return

        try {
            const response = await fetch(Constants.LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                this.eventCallback(new NavigateToOverviewPage())
            } else {
                const errorJson: { message: string } = await response.json()
                this.eventCallback(new ShowErrorToast(errorJson.message))
            }
        } catch (error) {
            console.error(error)
        }
    }
}