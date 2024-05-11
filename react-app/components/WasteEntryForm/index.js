/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
const WasteEntryForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultValues) {
      setValue('weight', defaultValues.weight)
      const formattedTimeOfArrival = defaultValues.timeOfArrival
        ? new Date(defaultValues.timeOfArrival).toISOString().slice(0, 16)
        : '' // Converts to "YYYY-MM-DDTHH:MM" format
      setValue('timeOfArrival', formattedTimeOfArrival)
      setValue('contractorId', defaultValues.contractorId)
      setValue('wasteType', defaultValues.wasteType)
      setValue('vehicleType', defaultValues.vehicleType) 
    }
  }, [defaultValues, setValue])

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    // convert timeOfArrival to ISO string
    // data.timeOfArrival = new Date(data.timeOfArrival).toISOString()
    await onFormSubmit(data)
    setLoading(false)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
      <div className="mt-3 flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">

        <Input
          name="weight"
          label="weight of Waste in Ton"
          placeholder="weight of Waste in Ton..."
          type="text"
          error={errors.weight ? errors.weight.message : false}
          register={register('weight', {
            required: {
              value: true,
              message: 'weight Of Waste is required'
            }
          })}
        />

        <Input
          name="contractorId"
          label="Contractor ID"
          placeholder="Contractor ID..."
          type="text"
          error={errors.contractorId ? errors.contractorId.message : false}
          register={register('contractorId', {
            required: {
              value: true,
              message: 'Contractor ID is required'
            }
          })}
        />

        <Input
          name="wasteType"
          label="Waste Type"
          placeholder="Waste Type..."
          type="text"
          error={errors.wasteType ? errors.wasteType.message : false}
          register={register('wasteType', {
            required: {
              value: true,
              message: 'Waste Type is required'
            }
          })}
        />

        <Input
          name="vehicleType"
          label="Vehicle Type"
          placeholder="Vehicle Type..."
          type="text"
          error={errors.vehicleType ? errors.vehicleType.message : false}
          register={register('vehicleType', {
            required: {
              value: true,
              message: 'Vehicle Type is required'
            }
          })}
        />

        

        {/* <Input
          name="timeOfArrival"
          label="Time of Arrival"
          placeholder="Time of Arrival..."
          type="datetime-local"
          error={errors.timeOfArrival ? errors.timeOfArrival.message : false}
          register={register('timeOfArrival', {
            required: {
              value: true,
              message: 'Time of Arrival is required'
            }
          })}
        /> */}

        </div>
      <Button type="button" onClick={onSubmit} className="w-full" disable={loading}>
        {loading ? 'Adding...' : 'Add waste'}
      </Button>
    </div>
    </div>
  )
}

export default WasteEntryForm
