import { renderHook, act } from "@testing-library/react";
import { useLoginFormData } from "./useLoginFormData";
import { loginValidator } from "../utils/loginValidator";
import { describe, expect, test, jest, beforeEach } from "@jest/globals";

jest.mock("../utils/loginValidator", () => ({
  loginValidator: jest.fn(),
}));
const mockLoginValidator = loginValidator as jest.Mock;

describe("useLoginFormData", () => {
  beforeEach(() => {
    mockLoginValidator.mockReset();
    mockLoginValidator.mockImplementation(() => "");
  });

  // 1
  test("should initialize with empty form data and errors", () => {
    const { result } = renderHook(() => useLoginFormData());

    expect(result.current.loginFormData).toEqual({
      email: "",
      password: "",
    });

    expect(result.current.errors).toEqual({
      email: "",
      password: "",
    });
  });

  // 2
  test("handleChange should update form data correctly", () => {
    const { result } = renderHook(() => useLoginFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    expect(result.current.loginFormData.email).toBe("test@example.com"); // checks if state is correctly updated after event handlerr
    expect(mockLoginValidator).toHaveBeenCalledWith(
      "email",
      "test@example.com"
    );
  });

  // 3
  test("handleChange should update errors based on validator response", () => {
    mockLoginValidator.mockImplementation((field, value) => {
      if (field === "email" && value === "invalid") {
        return "Invalid email format";
      }
      return "";
    });

    const { result } = renderHook(() => useLoginFormData());

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
    const { result } = renderHook(() => useLoginFormData());

    act(() => {
      const mockEvent = {
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(mockEvent);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.loginFormData).toEqual({
      email: "",
      password: "",
    });

    expect(result.current.errors).toEqual({
      email: "",
      password: "",
    });
  });

  // 5
  test("isLoginFormValid should validate all fields and return true when valid", () => {
    mockLoginValidator.mockImplementation(() => "");

    const { result } = renderHook(() => useLoginFormData());

    act(() => {
      const emailEvent = {
        target: { name: "email", value: "valid@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      const passwordEvent = {
        target: { name: "password", value: "valid!Password123" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(emailEvent);
      result.current.handleChange(passwordEvent);
    });

    let isValid;
    act(() => {
      isValid = result.current.isLoginFormValid();
    });

    expect(isValid).toBe(true);
    expect(mockLoginValidator).toHaveBeenCalledWith(
      "email",
      "valid@example.com"
    );
    expect(mockLoginValidator).toHaveBeenCalledWith(
      "password",
      "valid!Password123"
    );
  });
 

	// 6
  test("isLoginFormValid should return false when validation fails", () => {
    mockLoginValidator.mockImplementation((field, value) => {
      if (
        field === "password" &&
        typeof value === "string" &&
        (value.length < 5 || !value.includes("!"))
      ) {
        return "Invalid password";
      }
      return "";
    });

    const { result } = renderHook(() => useLoginFormData());

    act(() => {
      const emailEvent = {
        target: { name: "email", value: "valid@example.com" },
      } as React.ChangeEvent<HTMLInputElement>;

      const passwordEvent = {
        target: { name: "password", value: "short" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(emailEvent);
      result.current.handleChange(passwordEvent);
    });

    let isValid;
    act(() => {
      isValid = result.current.isLoginFormValid();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.password).toBe("Invalid password");
  });
 

	// 7
  test("isLoginFormValid should set errors for empty required fields", () => {
    const { result } = renderHook(() => useLoginFormData());

    let isValid;
    act(() => {
      isValid = result.current.isLoginFormValid();
    });

    expect(isValid).toBe(true);

    mockLoginValidator.mockImplementation((field, value) => {
      if (!value) {
        if (field === "email")
          return "Please enter the email you registered with";
        if (field === "password") return "Please enter your password";
      }
      return "";
    });

    act(() => {
      isValid = result.current.isLoginFormValid();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe(
      "Please enter the email you registered with"
    );
    expect(result.current.errors.password).toBe("Please enter your password");
  });
});
