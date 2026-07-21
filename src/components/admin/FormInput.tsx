import React from 'react';
import classes from '@/pages/admin/Admin.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextarea?: boolean;
}

export default function FormInput({ label, isTextarea, className, style, ...props }: FormInputProps) {
  return (
    <div className={classes.inputGroup}>
      <label>{label}</label>
      {isTextarea ? (
        <textarea 
          className={`${classes.input} ${className || ''}`} 
          style={{ minHeight: '80px', ...style }} 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
        />
      ) : (
        <input 
          className={`${classes.input} ${className || ''}`} 
          style={style}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)} 
        />
      )}
    </div>
  );
}
