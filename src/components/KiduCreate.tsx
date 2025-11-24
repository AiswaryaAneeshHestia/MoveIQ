import React, { useState } from "react";
import { KiduValidation, type ValidationRule } from "./KiduValidation";

export interface KiduField {
  name: string;
  label: string;
  type: ValidationRule["type"];
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  rules: ValidationRule;
}

interface Props {
  title: string;
  fields: KiduField[];
  onSubmit: (values: Record<string, any>) => void;
}

const KiduCreate: React.FC<Props> = ({ fields, onSubmit }) => {
  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string | undefined> = {};

  fields.forEach(f => { initialValues[f.name] = ""; initialErrors[f.name] = undefined; });

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (name: string, val: any) => {
    setValues(prev => ({...prev, [name]: val}));
    if (errors[name]) setErrors(prev => ({...prev, [name]: undefined}));
  };

  const handleValidation = (name: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return false;
    const result = KiduValidation.validate(values[name], field.rules);
    setErrors(prev => ({...prev, [name]: result.isValid ? undefined : result.message}));
    return result.isValid;
  };

  const handleSubmit = () => {
    let valid = true;
    fields.forEach(f => { if (!handleValidation(f.name)) valid = false; });
    if (!valid) return false;
    onSubmit(values);
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors(initialErrors);
  };

  return null; 
};

export default KiduCreate;
