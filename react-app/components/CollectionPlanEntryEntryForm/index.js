/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'

const CollectionPlanEntryEntryForm = ({
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
      setValue('area', defaultValues.area)
      setValue('startTime', defaultValues.startTime)
      setValue('endTime', defaultValues.endTime)
      setValue('laborers', defaultValues.laborers)
      setValue('expectedWaste', defaultValues.expectedWaste)
      setValue('vans', defaultValues.vans) 
    }
  }, [ defaultValues ])

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
          name="area"
          label="Area"
          placeholder="Enter Area"
          type="text"
          error={errors.area ? errors.area.message : false}
          {...register('area')}
        />

        <Input
          name="startTime"
          label="Start Time"
          type="datetime-local"
          error={errors.startTime ? errors.startTime.message : false}
          {...register('startTime')}
        />

        <Input
          name="endTime"
          label="End Time"
          type="datetime-local"
          error={errors.endTime ? errors.endTime.message : false}
          {...register('endTime')}
        />

        <Input
          name="laborers"
          label="Laborers"
          placeholder="Enter Laborers"
          type="number"
          error={errors.laborers ? errors.laborers.message : false}
          {...register('laborers')}
        />

        <Input
          name="expectedWaste"
          label="Expected Waste"
          placeholder="Enter Expected Waste"
          type="number"
          error={errors.expectedWaste ? errors.expectedWaste.message : false}
          {...register('expectedWaste')}
        />

        <Input
          name="vans"
          label="Vans"
          placeholder="Enter Vans"
          type="number"
          error={errors.vans ? errors.vans.message : false}
          {...register('vans')}
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

export default CollectionPlanEntryEntryForm
