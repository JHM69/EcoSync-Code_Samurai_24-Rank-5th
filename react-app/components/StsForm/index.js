/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
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
      setValue(
        'managerIds',
        defaultValues.managers.map((manager) => String(manager.id)) || []
      ),
        setValue('address', defaultValues.address)
      setValue('logo', defaultValues.logo)
      setValue(
        'vehicleIds',
        defaultValues.vehicles.map((vehicle) => String(vehicle.id)) || []
      )
    }
  }, [defaultValues, setValue])

  const [search, setSearch] = useState('')
  const [stsManagers, setStsMans] = useState([])

  const [search2, setSearch2] = useState('')
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/users?search=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setStsMans(res.data)
        })
    }
  }, [search])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/vehicle?search=${search2}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setVehicles(res.data)
        })
    }
  }, [search2])

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

        <div className="flex flex-col p-3 rounded-[4px] border-[1px] border-gray-300">
          <div className="flex">
            <input
              className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
              name="search"
              label="Search Manager..."
              placeholder="Search Manager by Name"
              type="textarea"
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
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
            name="vehicles"
            multiple={true}
            label="Select Vehicles..."
            register={register('vehicles')}
          >
            {stsManagers?.map((user) => (
              <OptionWithCheckbox key={user.id} value={String(user.id)}>
                {user.name}
              </OptionWithCheckbox>
            ))}
          </MultipleSelect>
        </div>

        <div className="flex flex-col p-3 mt-3 rounded-[4px] border-[1px] border-gray-300">
          <div className="flex">
            <input
              className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
              name="search"
              label="Search Vehicles..."
              placeholder="Search Vehicle by Registration Number.."
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
            name="vehicleIds"
            multiple={true}
            label="Select Vehicles..."
            register={register('vehicleIds')}
          >
            {vehicles?.map((v) => (
              <OptionWithCheckbox key={v.id} value={String(v.id)}>
                {v.registrationNumber}
              </OptionWithCheckbox>
            ))}
          </MultipleSelect>
        </div>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} STS` : 'Submit'}
      </Button>
    </div>
  )
}

export default StsForm
