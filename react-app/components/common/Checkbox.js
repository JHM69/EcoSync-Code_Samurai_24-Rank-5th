import React from 'react';
import clsx from 'clsx';

const Checkbox = ({ name, label, register, error, className, ...props }) => {
  return (
    <div className="mb-2 flex items-center">
        <label
        htmlFor={name}
        className="mr-4 text-sm font-medium text-gray-600"
      >
        {label}
      </label>
      <input
        type="checkbox"
        className={clsx([
          'form-checkbox',
          error ? 'border-red-300 text-red-500' : 'border-gray-300',
          'm-0 rounded-md transition ease-in-out focus:border-sky-300 focus:outline-none focus:ring-sky-300',
          className,
        ])}
        name={name}
        {...props}
        {...register}
      />
      {error ? <p className="ml-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default Checkbox;
