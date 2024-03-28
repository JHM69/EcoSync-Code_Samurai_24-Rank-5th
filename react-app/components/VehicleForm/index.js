/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
const VehicleForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  useEffect(() => {
    if (defaultValues) {
      setValue('registrationNumber', defaultValues.registrationNumber)
      setValue('type', defaultValues.type)
      setValue('capacity', defaultValues.capacity)
      setValue('loaddedFuelCost', defaultValues.loaddedFuelCost)
      setValue('unloadedFuelCost', defaultValues.unloadedFuelCost)
    }
  }, [defaultValues, setValue])


  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="registrationNumber"
          label="Registration Number"
          placeholder="Registration Number..."
          type="text"
          error={
            errors.registrationNumber
              ? errors.registrationNumber.message
              : false
          }
          register={register('registrationNumber', {
            required: {
              value: true,
              message: 'Registration Number is required',
            },
          })}
        />

        <Select
          name="type"
          label="Type"
          error={errors.type ? errors.type.message : false}
          register={register('type', {
            required: {
              value: true,
              message: 'Type is required',
            },
          })}
        >
          <option value="Compactor">Compactor</option>
          <option value="DumpTruck">Dump Truck</option>
          <option value="OpenTruck">Open Truck</option>
          <option value="ContainerCarrier">Container Carrier</option>
        </Select>

        <Input
          name="capacity"
          label="Capacity"
          placeholder="Capacity..."
          type="text" // Or 'number' if appropriate
          error={errors.capacity ? errors.capacity.message : false}
          register={register('capacity', {
            required: {
              value: true,
              message: 'Capacity is required',
            },
          })}
        />

        <Input
          name="loaddedFuelCost"
          label="Loadded Fuel Cost"
          placeholder="Loadded Fuel Cost..."
          type="text"
          error={
            errors.loaddedFuelCost ? errors.loaddedFuelCost.message : false
          }
          register={register('loaddedFuelCost', {
            required: {
              value: true,
              message: 'Loadded Fuel Cost is required',
            },
          })}
        />

        <Input
          name="unloadedFuelCost"
          label="Unloadded Fuel Cost"
          placeholder="Unloadded Fuel Cost..."
          type="text"
          error={
            errors.unloadedFuelCost ? errors.unloadedFuelCost.message : false
          }
          register={register('unloadedFuelCost', {
            required: {
              value: true,
              message: 'Unloadded Fuel Cost is required',
            },
          })}
        />
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Vehicle` : 'Submit'}
      </Button>
    </div>
  )
}

export default VehicleForm
