import NextLink from 'next/link'

export const Link = ({ children, ...props }) => {
  return (
    <NextLink {...props}>
      <a className="px-2 text-[#76C75E] hover:underline">{children}</a>
    </NextLink>
  )
}

export const NavLink = ({ children, ...props }) => {
  return (
    <NextLink {...props}>
      <a className="ease my-2 rounded border border-gray-200 p-2 text-center font-semibold text-gray-800 hover:text-[#76C75E] hover:shadow-sm">
        {children}
      </a>
    </NextLink>
  )
}
