export const loginValidator = (name: string, value: string) => {
    switch (name) {
        case "email": {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) return "Invalid email format"
            if (!value) return "Please enter the email you registered with"
            return "";
        }
        case "password": {
            if (!value) return "Please enter your password"
            const specialChars = /[!@#$%^&*(),.?":{}|<>]/; // do i need this here?
            if (!specialChars.test(value) || (value.length < 5)) return "Invalid password";
            return "";
        }
        default:
            return "";
    }
}