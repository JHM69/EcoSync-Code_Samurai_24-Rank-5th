/* eslint-disable multiline-ternary */
import React from 'react'
import UpdateContractor from './UpdateContractor'
import DeleteContractor from './DeleteContractor'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)

const ContractorLayout = ({ contractor }) => {
  return (
    <div className="mt-6 flex flex-col md:flex-row">
     
      <div className="w-full">

        <Section title={'Contractor Information'}>
          <div className="flex items-center justify-end space-x-2">
            <UpdateContractor contractor={contractor} />
            <DeleteContractor
              contractorId={contractor?.id}
            />
          </div>
          <section className="mb-3 rounded-md border px-3 py-4">
            <div className="flex items-center space-x-4 py-2">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">
                  Company: {contractor.companyName}
                </h3>
                <p className="text-gray-700">Registration Id: {contractor.registrationId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-xl font-semibold text-gray-700">STS Assigned: {contractor.stsId}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Registration Date: {contractor.registrationDate}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">TIN Number: {contractor.tin}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Phone Number: {contractor.phone}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Payment Per Tonnage: {contractor.paymentPerTonnage} Ton</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Required Waste Per Day: {contractor.requiredWastePerDay} Ton</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Contract Start Date: {contractor.contractStartDate}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Contract End Date: {contractor.contractEndDate}</p>
            </div>

            <div className="flex items-center space-x-4 py-2">
              <p className="text-gray-700">Area of Collection: {contractor.areaOfCollection}</p>
            </div>
          </section>
        </Section>

        {/* <Section title={'Contractor Type'}>
          <h3 className="font-bond text-xl text-gray-500">
            {contractor?.role?.type}
          </h3>
        </Section> */}

        {/* {contractor?.role?.type === 'STSManager' && (
          <Section title={'STS Info'}>
            {
              contractor.sts.map((sts) => (
                <div key={sts.id} className="mb-3 rounded-md border px-3 py-4">
                  <p className="text-xl font-semibold text-gray-500">{sts.address || sts.wardNumber}</p>
                </div>
              ))
            }
          </Section>
        )}
        {contractor?.role?.type === 'LandfillManager' && (
          <Section title={'Landfill Information'}>
            {
              contractor?.landfill?.map((landfill) => (
                <div key={landfill.id} className="mb-3 rounded-md border px-3 py-4">
                  <p className="text-xl font-semibold text-gray-500">{landfill.name}</p>
                </div>
              ))
            }
          </Section>
        )} */}
      </div>
    </div>
  )
}

export default ContractorLayout
