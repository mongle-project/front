import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
