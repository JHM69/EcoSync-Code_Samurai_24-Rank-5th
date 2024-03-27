import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
const StsForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()


  useEffect(() => {
    if (defaultValues) {
      setValue('wardNumber', defaultValues.wardNumber)
      setValue('capacity', defaultValues.capacity)
      setValue('lat', defaultValues.lat)
      setValue('lon', defaultValues.lon)
      setValue('managerIds', defaultValues.managerIds || []) // Handle optional array
      setValue('address', defaultValues.address)
      setValue('logo', defaultValues.logo)
      setValue('vehicleIds', defaultValues.vehicleIds || []) // Handle optional array
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
          name="wardNumber"
          label="Ward Number"
          placeholder="Ward Number..."
          type="text"
          error={errors.wardNumber ? errors.wardNumber.message : false}
          register={register('wardNumber', {
            required: {
              value: true,
              message: 'Ward Number is required',
            },
          })}
        />
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
          name="lat"
          label="Latitude"
          placeholder="Latitude..."
          type="text"
          error={errors.lat ? errors.lat.message : false}
          register={register('lat', {
            required: {
              value: true,
              message: 'Latitude is required',
            },
          })}
        />

        <Input
          name="lon"
          label="Longitude"
          placeholder="Longitude..."
          type="text"
          error={errors.lon ? errors.lon.message : false}
          register={register('lon', {
            required: {
              value: true,
              message: 'Longitude is required',
            },
          })}
        />

        <Input
          name="address"
          label="Address"
          placeholder="Address..."
          type="text"
          error={errors.address ? errors.address.message : false}
          register={register('address')} // No need for full validation object if optional
        />

        <Input
          name="logo"
          label="Logo"
          placeholder="Logo URL..."
          type="text"
          error={errors.logo ? errors.logo.message : false}
          register={register('logo')}
        />

        <Select
          name="managerIds"
          label="Manager IDs"
          error={errors.managerIds ? errors.managerIds.message : false}
          register={register('managerIds')}
          multiple
        >
          <option value="1">Manager 1</option>
          <option value="2">Manager 2</option>
        </Select>

        <Select
          name="vehicleIds"
          label="Vehicle IDs"
          error={errors.vehicleIds ? errors.vehicleIds.message : false}
          register={register('vehicleIds')}
          multiple
        >
          <option value="1">Vehicle 1</option>
          <option value="2">Vehicle 2</option>
        </Select>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} STS` : 'Submit'}
      </Button>
    </div>
  )
}

export default StsForm
