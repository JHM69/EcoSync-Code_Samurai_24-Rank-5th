import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)

const UserLayout = ({ user }) => {
  return (
    <div className="mt-6 flex flex-col md:flex-row">
      <div className='w-full'>
         <Section title={'User Information'}>
           <section className="mb-3 rounded-md border px-3 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={user.image}
                    alt={user.name}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-500">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </section>

        </Section>

        <Section title={'STS Info'}>

        </Section>

        <Section title={'Landfill Info'}>

        </Section>

      </div>
    </div>
  )
}

export default UserLayout
