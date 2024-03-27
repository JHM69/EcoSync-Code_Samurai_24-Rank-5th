import React, { useState } from 'react';
import clsx from 'clsx';

// Custom Dropdown Component
const MultipleSelect = ({ name, label, children, error, className, ...props }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = value => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div className={clsx("mb-2", className)}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-600">
        {label}
      </label>
      <div
        className={clsx([
          'relative border border-solid bg-white bg-clip-padding px-4 py-2 font-normal text-gray-700',
          error ? 'border-red-300' : 'border-gray-300',
          'rounded-md transition ease-in-out focus-within:border-green-300 focus-within:ring focus-within:ring-green-300',
        ])}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onToggle: handleOptionToggle,
              isSelected: selectedOptions.includes(child.props.value),
            });
          }
          return child;
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Custom Option Component with Checkbox
const OptionWithCheckbox = ({ value, children, onToggle, isSelected }) => (
  <div
    className={clsx([
      "flex items-center p-2 cursor-pointer",
      isSelected ? 'bg-green-100' : 'hover:bg-gray-100'
    ])}
    onClick={() => onToggle(value)}
  >
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => {}}
      className="mr-2"
      // Prevent the checkbox from directly toggling which causes a double toggle effect
      onClick={e => e.stopPropagation()}
    />
    {children}
  </div>
);

export { MultipleSelect, OptionWithCheckbox };
