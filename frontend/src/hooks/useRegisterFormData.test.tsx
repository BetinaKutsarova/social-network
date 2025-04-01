import { renderHook, act } from "@testing-library/react";
import { useRegisterFormData } from "./useRegisterFormData";
import { describe, expect, test, jest, beforeEach } from "@jest/globals";

const mockRegisterValidator = jest.fn();

jest.mock("../utils/registerValidator", () => ({
  registerValidator: mockRegisterValidator,
}));



describe("useRegisterFormData", () => {
  beforeEach(() => {
    mockRegisterValidator.mockReset();
    mockRegisterValidator.mockImplementation(() => "");
  });

  // 1
  test("should initialize with empty form data and errors", () => {
    const { result } = renderHook(() => useRegisterFormData());

    expect(result.current.registerFormData).toEqual({
      username: "",
      email: "",
			role: "user",
      password: "",
    });

    expect(result.current.errors).toEqual({
      username: "",
      email: "",
      password: "",
    });
  });

  // 2
  test("handleChange should update form data correctly", () => {
    const { result } = renderHook(() => useRegisterFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    expect(result.current.registerFormData.email).toBe("test@example.com");
    expect(mockRegisterValidator).toHaveBeenCalledWith(
      "email",
      "test@example.com"
    );
  });

  // 3
  test("handleChange should update errors based on validator response", () => {
    mockRegisterValidator.mockImplementation((field, value) => {
      if (field === "email" && value === "invalid") {
        return "Invalid email format";
      }
      return "";
    });

    const { result } = renderHook(() => useRegisterFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "invalid" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    expect(result.current.errors.email).toBe("Invalid email format");
  });

  // 4
  test("resetForm should clear form data and errors", () => {
    const { result } = renderHook(() => useRegisterFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.registerFormData).toEqual({
      username: "",
			role: "user",
      email: "",
      password: "",
    });

    expect(result.current.errors).toEqual({
      username: "",
      email: "",
      password: "",
    });
  });

  // 5
  test("isRegisterFormValid should validate all fields and return true when valid", () => {
    mockRegisterValidator.mockImplementation(() => "");

    const { result } = renderHook(() => useRegisterFormData());

    act(() => {
      const usernameEvent = {
        target: { name: "username", value: "validuser" },
      } as React.ChangeEvent<HTMLInputElement>;

      const emailEvent = {
        target: { name: "email", value: "valid@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      const passwordEvent = {
        target: { name: "password", value: "valid!Password123" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(usernameEvent);
      result.current.handleChange(emailEvent);
      result.current.handleChange(passwordEvent);
    });

    let isValid;
    act(() => {
      isValid = result.current.isRegisterFormValid();
    });

    expect(isValid).toBe(true);
    expect(mockRegisterValidator).toHaveBeenCalledWith("username", "validuser");
    expect(mockRegisterValidator).toHaveBeenCalledWith(
      "email",
      "valid@example.com"
    );
    expect(mockRegisterValidator).toHaveBeenCalledWith(
      "password",
      "valid!Password123"
    );
  });

  // 6
  test("isRegisterFormValid should return false when password validation fails", () => {
    mockRegisterValidator.mockImplementation((field, value) => {
      if (field === "password" && typeof value === "string") {
        if (value.length < 5) return "Password must be at least 5 characters";
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialChars.test(value))
          return "Password must contain at least one special character";
      }
      return "";
    });

    const { result } = renderHook(() => useRegisterFormData());

    // Test too short password
    act(() => {
      const usernameEvent = {
        target: { name: "username", value: "validuser" },
      } as React.ChangeEvent<HTMLInputElement>;

      const emailEvent = {
        target: { name: "email", value: "valid@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      const passwordEvent = {
        target: { name: "password", value: "shrt" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(usernameEvent);
      result.current.handleChange(emailEvent);
      result.current.handleChange(passwordEvent);
    });

    let isValid;
    act(() => {
      isValid = result.current.isRegisterFormValid();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.password).toBe(
      "Password must be at least 5 characters"
    );

    // Test password without special character
    act(() => {
      const passwordEvent = {
        target: { name: "password", value: "longpassword" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(passwordEvent);
    });

    act(() => {
      isValid = result.current.isRegisterFormValid();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.password).toBe(
      "Password must contain at least one special character"
    );
  });

  // 7
  test("isRegisterFormValid should set errors for empty required fields", () => {
    const { result } = renderHook(() => useRegisterFormData());

    let isValid;
    act(() => {
      isValid = result.current.isRegisterFormValid();
    });

    expect(isValid).toBe(true);

    mockRegisterValidator.mockImplementation((field, value) => {
      if (!value) {
        if (field === "username") return "Please provide a username";
        if (field === "email") return "Email is required";
        if (field === "password") return "A password is required";
      }
      return "";
    });

    act(() => {
      isValid = result.current.isRegisterFormValid();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.username).toBe("Please provide a username");
    expect(result.current.errors.email).toBe("Email is required");
    expect(result.current.errors.password).toBe("A password is required");
  });

  // 8
  test("handleChange should validate username correctly", () => {
    mockRegisterValidator.mockImplementation((field, value) => {
      if (field === "username") {
        if (!value) return "Please provide a username";
        if (typeof value == "string" && value.length < 2)
          return "Username must be at least 2 characters";
      }
      return "";
    });

    const { result } = renderHook(() => useRegisterFormData());

    // Test short username
    act(() => {
      const mockEvent = {
        target: { name: "username", value: "a" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    expect(result.current.errors.username).toBe(
      "Username must be at least 2 characters"
    );
  });

  // 9
  test("handleChange should validate email format correctly", () => {
    mockRegisterValidator.mockImplementation((field, value) => {
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return "Email is required";
        if (typeof value == "string" && !emailRegex.test(value))
          return "Invalid email format";
      }
      return "";
    });

    const { result } = renderHook(() => useRegisterFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "invalidemail" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    expect(result.current.errors.email).toBe("Invalid email format");
  });
});
