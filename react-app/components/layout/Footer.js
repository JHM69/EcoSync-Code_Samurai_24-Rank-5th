import React from 'react'
import { Link } from '../common/Links'

const Footer = () => {
  return (
    <footer className="h-[5vh] w-full border-t border-gray-200 bg-white p-3 text-center lg:h-[8vh]">
      <Link href={'https://github.com/jhm69/Shuno-Backend'} target={'_blank'}>
        Shuno Backend
      </Link>

      <Link href={'https://github.com/JHM69/Shuno-Client'} target={'_blank'}>
        Shuno App
      </Link>

      <Link href={'https://github.com/jhm69/Shuno-CMS'} target={'_blank'}>
        Shuno CMS
      </Link>
    </footer>
  )
}

export default Footer
