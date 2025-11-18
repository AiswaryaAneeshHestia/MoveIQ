/* eslint-disable react-refresh/only-export-components */
import React from "react";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ValidationRule {
  type?: "text" | "number" | "email" | "url" | "textarea" | "popup" | "password";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  label?: string;
}

export const KiduValidation = {
  validate(value: unknown, rules: ValidationRule): ValidationResult {
    const val = String(value ?? "").trim();
    const label = rules.label || "This field";

    // Required
    if (rules.required && !val) {
      return { isValid: false, message: `${label} is required.` };
    }

    // Number
    if (rules.type === "number" && val && isNaN(Number(val))) {
      return { isValid: false, message: `${label} must be a number.` };
    }

    // Email
    if (
      rules.type === "email" &&
      val &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    ) {
      return {
        isValid: false,
        message: "Please enter a valid email address.",
      };
    }

    // URL
    if (
      rules.type === "url" &&
      val &&
      !/^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/.test(val)
    ) {
      return {
        isValid: false,
        message: "Please enter a valid website URL.",
      };
    }

    // Password validation
    if (rules.type === "password" && val) {
      if (val.length < 8) {
        return {
          isValid: false,
          message: `${label} must be at least 8 characters.`,
        };
      }

      if (!/[A-Z]/.test(val)) {
        return {
          isValid: false,
          message: `${label} must contain at least one uppercase letter.`,
        };
      }

      if (!/[a-z]/.test(val)) {
        return {
          isValid: false,
          message: `${label} must contain at least one lowercase letter.`,
        };
      }

      if (!/[0-9]/.test(val)) {
        return {
          isValid: false,
          message: `${label} must contain at least one number.`,
        };
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
        return {
          isValid: false,
          message: `${label} must contain at least one special character.`,
        };
      }
    }

    // Min length
    if (rules.minLength && val.length < rules.minLength) {
      return {
        isValid: false,
        message: `${label} must be at least ${rules.minLength} characters.`,
      };
    }

    // Max length
    if (rules.maxLength && val.length > rules.maxLength) {
      return {
        isValid: false,
        message: `${label} must be less than ${rules.maxLength} characters.`,
      };
    }

    // Pattern
    if (rules.pattern && val && !rules.pattern.test(val)) {
      return {
        isValid: false,
        message: `Invalid ${label.toLowerCase()}.`,
      };
    }

    return { isValid: true };
  },
};

export const ValidationMessage: React.FC<{ message?: string }> = ({
  message,
}) => {
  if (!message) return null;

  return (
    <div
      style={{
        fontSize: "0.8rem",
        color: "#EF4444",
        marginTop: "4px",
        fontFamily: "Urbanist",
      }}
    >
      {message}
    </div>
  );
};

export default KiduValidation;
