import React from "react";
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "../../components/ui/message";
import { Input } from "../../components/ui/input";
import { loginUser } from "../../services/loginUser";
import { LoginFormData } from "../../interfaces/form";
import { useLoginFormData } from "../../hooks/useLoginFormData";
import { isAuthenticatedAtom } from "../../state/atoms";
import { useAtom } from "jotai";

export const Login: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  const { loginFormData, handleChange, resetForm, errors, isLoginFormValid } =
    useLoginFormData();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoginFormValid()) {
      setMessageType("error");
      setSubmitMessage("Please fix the errors in the form.");
      return;
    }

    const userData: LoginFormData = {
      email: loginFormData.email,
      password: loginFormData.password,
    };

    try {
      await loginUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
      resetForm();
    } catch (error) {
      console.error("Login error:", error);
      setMessageType("error");
      setSubmitMessage("Incorrect email or password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Email"
            name="email"
            type="email"
            id="emailid"
            value={loginFormData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            id="passwordid"
            value={loginFormData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <button type="submit">Login</button>
          {submitMessage && (
            <Message type={messageType}>{submitMessage}</Message>
          )}
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
