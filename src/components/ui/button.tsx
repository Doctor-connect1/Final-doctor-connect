import React from 'react';

export const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
    >
      {children}
    </button>
  );
};

export const Input = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} className="border rounded-md p-2" />
));

export const Label = ({ children, ...props }) => (
  <label {...props} className="block text-gray-700 font-medium">
    {children}
  </label>
); 