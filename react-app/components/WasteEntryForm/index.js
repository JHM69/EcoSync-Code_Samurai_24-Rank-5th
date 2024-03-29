/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react'
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

  useEffect(() => {
    if (defaultValues) {
      setValue('volumeOfWaste', defaultValues.volumeOfWaste)
      const formattedTimeOfArrival = defaultValues.timeOfArrival
        ? new Date(defaultValues.timeOfArrival).toISOString().slice(0, 16)
        : '' // Converts to "YYYY-MM-DDTHH:MM" format
      setValue('timeOfArrival', formattedTimeOfArrival)
    }
  }, [defaultValues, setValue])

  const onSubmit = handleSubmit(async (data) => {
    // convert timeOfArrival to ISO string
    data.timeOfArrival = new Date(data.timeOfArrival).toISOString()
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
      <div className="mt-3 flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">

        <Input
          name="volumeOfWaste"
          label="Volume of Waste in KG"
          placeholder="Volume of Waste in KG..."
          type="text"
          error={errors.volumeOfWaste ? errors.volumeOfWaste.message : false}
          register={register('volumeOfWaste', {
            required: {
              value: true,
              message: 'volume Of Waste is required'
            }
          })}
        />

        <Input
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
        />

        </div>
      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Waste` : 'Submit'}
      </Button>
    </div>
    </div>
  )
}

export default WasteEntryForm
