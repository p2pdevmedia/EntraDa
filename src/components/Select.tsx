import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select(props: SelectProps) {
  return (
    <select
      className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}
