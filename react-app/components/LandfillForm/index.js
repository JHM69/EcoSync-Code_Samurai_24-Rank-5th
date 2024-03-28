/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input' 
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
const LandfillForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [search, setSearch] = useState('')
  const [landfillManagers, setlandfillManagers] = useState([])
 
  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name)
      setValue('capacity', defaultValues.capacity)
      setValue('lat', defaultValues.lat)
      setValue('lon', defaultValues.lon)
      setValue('address', defaultValues.address) 
      
      if (landfillManagers) {
        setValue(
          'managerIds',
          defaultValues.managers.map((manager) => manager.id.toString()) || []
        )
      }
    }
  }, [defaultValues, setValue, landfillManagers])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/users?search=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setlandfillManagers(res.data)
        })
    }
  }, [search])
 
  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="name"
          label="Landfill Name"
          placeholder="Landfill Number..."
          type="text"
          error={errors.name ? errors.name.message : false}
          register={register('name', {
            required: {
              value: true,
              message: 'Landfill Name is required'
            }
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
              message: 'Capacity is required'
            }
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
              message: 'Latitude is required'
            }
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
              message: 'Longitude is required'
            }
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

 
        <div className="flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
          <div className="flex">
            <input
              className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
              name="search"
              label="Search Manager..."
              placeholder="Search Manager by Name"
              type="textarea"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => {
                setSearch('')
              }}
              type="button"
              className="w-1/5"
            >
              Clear
            </button>
          </div>

          <MultipleSelect
            name="managerIds"
            multiple={true}
            label="Select Vehicles..."
            register={register('managerIds')}
          >
            {landfillManagers?.map((user) => (
              <OptionWithCheckbox key={user.id.toString()} value={(user.id.toString())}>
                {user.name}
              </OptionWithCheckbox>
            ))}
          </MultipleSelect>
        </div>
 
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Landfill` : 'Submit'}
      </Button>
    </div>
  )
}

export default LandfillForm
