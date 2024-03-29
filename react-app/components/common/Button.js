/* eslint-disable no-useless-computed-key */
import clsx from 'clsx'
import React, { Children } from 'react'

export default React.forwardRef(function Button(
  {
    variant = 'primary',
    loading = false,
    loadingText = 'loading...',
    children,
    ...attributes
  },
  ref
) {
  const handleClick = (e) => {
    if (!loading && attributes.onClick) {
      attributes.onClick(e)
    }
  }

  const variantClassname = clsx({
    ['bg-green-500 text-white my-2 disabled:bg-green-400 disabled:ring-0']:
      variant === 'primary',
    ['text-green-500 disabled:text-green-400']: variant === 'text',
  })

  return (
    <button
      {...attributes}
      className={clsx(
        'inline-block smooth-effect cursor-pointer rounded-md hover:bg-green-600 px-6 py-2 text-sm font-semibold leading-snug ring-green-300   hover:ring focus:ring',
        variantClassname,
        attributes.className
      )}
      disabled={attributes.disabled || loading}
      ref={ref}
      onClick={handleClick}
    >
      {loading
        ? loadingText
        : Children.map(children, (child, i) => {
            return (
              <span key={i} className="mr-xsmall last:mr-0">
                {child}
              </span>
            )
          })}
    </button>
  )
})
