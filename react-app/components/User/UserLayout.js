/* eslint-disable multiline-ternary */
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
      <div className="w-full">
        <Section title={'User Information'}>
          <section className="mb-3 rounded-md border px-3 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                <img src={user.image} alt={user.name} width={64} height={64} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-gray-500">
                  {user.name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </section>
        </Section>

        <Section title={'User Type'}>
          <h3 className="font-bond text-xl text-gray-500">
            {user?.role?.type}
          </h3>
        </Section>

        {user?.role?.type === 'STSManager' && (
          <Section title={'STS Info'}>
            {
              user.sts.map((sts) => (
                <div key={sts.id} className="mb-3 rounded-md border px-3 py-4">
                  <p className="text-xl font-semibold text-gray-500">{sts.address || sts.wardNumber}</p>
                </div>
              ))
            }
          </Section>
        )}
        {user?.role?.type === 'LandfillManager' && (
          <Section title={'Landfill Information'}>
            {
              user?.landfill?.map((landfill) => (
                <div key={landfill.id} className="mb-3 rounded-md border px-3 py-4">
                  <p className="text-xl font-semibold text-gray-500">{landfill.name}</p>
                </div>
              ))
            }
          </Section>
        )}
      </div>
    </div>
  )
}

export default UserLayout
