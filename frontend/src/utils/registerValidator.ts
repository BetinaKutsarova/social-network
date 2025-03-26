export const  registerValidator = (name: string, value: string) => {
    switch (name) {
        case "username": {
            if (!value) return "Please provide a username"
            if (value.length < 2) return "Username must be at least 2 characters"
            return "";
        }
        case "email": {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value) return "Email is required"
            if (!emailRegex.test(value)) return "Invalid email format"
            return "";
        }
        case "password": {
            if (!value) return "A password is required"
            if (value.length < 5) return "Password must be at least 5 characters"
            const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
            if (!specialChars.test(value)) return "Password must contain at least one special character";
            return "";
        }
        // case "confirmPassword": {
        //     if (!value) return "Please confirm your password"
        //     if (value !== formData.password) return "Passwords do not match"
        //     return "";
        // }
        default:
            return "";
    }
}