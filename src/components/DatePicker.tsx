import React from 'react';
import Input from './Input';

// Reusable date picker based on the generic Input component
// Allows consistent styling for all date inputs in the app

type DatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function DatePicker(props: DatePickerProps) {
  return <Input type="date" {...props} />;
}

