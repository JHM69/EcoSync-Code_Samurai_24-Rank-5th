/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
const ContractorEntryForm = ({
  type,
  defaultValues,
  onFormSubmit,
  handleClose,
  contractorId,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultValues) {
      setValue('contractorId', contractorId)
      setValue('name', defaultValues.name)
      setValue('dateOfHire', defaultValues.dateOfHire)
      setValue('jobTitle', defaultValues.jobTitle)
      setValue('paymentRatePerHour', defaultValues.paymentRatePerHour)
      setValue('phone', defaultValues.phone)
      setValue('assignedCollectionRoute', defaultValues.assignedCollectionRoute)
      setValue('volumeOfWaste', defaultValues.volumeOfWaste)
      const formattedTimeOfArrival = defaultValues?.dateOfBirth
        ? new Date(defaultValues?.dateOfBirth).toISOString().slice(0, 16)
        : '' // Converts to "YYYY-MM-DDTHH:MM" format
      setValue('dateOfBirth', formattedTimeOfArrival)
    }
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    setLoading(true)
    // convert timeOfArrival to ISO string
    data.dateOfBirth = new Date(data.dateOfBirth).toISOString()
    await onFormSubmit(data)
    setLoading(false)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="contractorId"
          label="Contractor ID"
          placeholder={contractorId}
          value={contractorId}
          type="text"
          error={errors.contractorId ? errors.contractorId.message : false}
          disabled
        />

        <Input
          name="name"
          label="Full Name"
          placeholder="Full Name of the Employee..."
          type="text"
          error={errors.name ? errors.name.message : false}
          register={register('name', {
            required: {
              value: true,
              message: 'Full name is required...',
            },
          })}
        />

        <Input
          name="dateOfBirth"
          label="Date of Birth"
          placeholder="Date of Birth..."
          type="datetime-local"
          error={errors.dateOfBirth ? errors.dateOfBirth.message : false}
          register={register('dateOfBirth', {
            required: {
              value: true,
              message: 'Date of Birth is required',
            },
          })}
        />

        <Input
          name="dateOfHire"
          label="Date of Hire"
          placeholder="Date of Hire..."
          type="datetime-local"
          error={errors.dateOfHire ? errors.dateOfHire.message : false}
          register={register('dateOfHire', {
            required: {
              value: true,
              message: 'Date of Hire is required',
            },
          })}
        />

        <Input
          name="jobTitle"
          label="Job Title"
          placeholder="Job Title..."
          type="text"
          error={errors.jobTitle ? errors.jobTitle.message : false}
          register={register('jobTitle', {
            required: {
              value: true,
              message: 'Job Title is required',
            },
          })}
        />

        <Input
          name="paymentRatePerHour"
          label="Payment Rate Per Hour"
          placeholder="Payment Rate Per Hour..."
          type="text"
          error={
            errors.paymentRatePerHour
              ? errors.paymentRatePerHour.message
              : false
          }
          register={register('paymentRatePerHour', {
            required: {
              value: true,
              message: 'Payment Rate Per Hour is required',
            },
          })}
        />

        <Input
          name="phone"
          label="Phone"
          placeholder="Phone..."
          type="text"
          error={errors.phone ? errors.phone.message : false}
          register={register('phone', {
            required: {
              value: true,
              message: 'Phone is required',
            },
          })}
        />

        <Input
          name="assignedCollectionRoute"
          label="Assigned Collection Route"
          placeholder="Assigned Collection Route..."
          type="text"
          error={
            errors.assignedCollectionRoute
              ? errors.assignedCollectionRoute.message
              : false
          }
          register={register('assignedCollectionRoute', {
            required: {
              value: true,
              message: 'Assigned Collection Route is required',
            },
          })}
        />
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        className="w-full"
        disable={loading}
      >
        {/* loading and type condition */}
        {loading ? 'Adding' : 'Add Entry'}
      </Button>
    </div>
  )
}

export default ContractorEntryForm
