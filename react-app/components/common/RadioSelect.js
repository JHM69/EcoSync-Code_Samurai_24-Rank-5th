import React from 'react';
import clsx from 'clsx';

const RadioSelect = ({ name, label, register, error, className, ...props }) => {
  return (
    <div className={`mb-2 flex items-center ${className}`}>
      <label
        className="text-sm mr-8 my-2 font-medium text-gray-600"
      >
        {label}
      </label>
      <div className="ml-2 flex items-center">
        <input
          type="radio"
          id={`${name}_yes`}
          value="true"
          className={clsx([
            'form-radio',
            error ? 'border-red-300 text-red-500' : 'border-gray-300',
            'm-0 rounded-full transition ease-in-out focus:border-sky-300 focus:outline-none focus:ring-sky-300',
            className,
          ])}
          name={name}
          {...register}
          {...props}
        />
        <label htmlFor={`${name}_yes`} className="ml-1">Yes</label>
      </div>
      <div className="ml-4 flex items-center">
        <input
          type="radio"
          id={`${name}_no`}
          value="false"
          className={clsx([
            'form-radio',
            error ? 'border-red-300 text-red-500' : 'border-gray-300',
            'm-0 rounded-full transition ease-in-out focus:border-sky-300 focus:outline-none focus:ring-sky-300',
            className,
          ])}
          name={name}
          {...register}
          {...props}
        />
        <label htmlFor={`${name}_no`} className="ml-1">No</label>
      </div>
      {error ? <p className="ml-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default RadioSelect;
