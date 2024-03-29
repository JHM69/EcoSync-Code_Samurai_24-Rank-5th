/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
const StsEntryForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [search2, setSearch2] = useState('')
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    if (defaultValues) {
      setValue('volumeOfWaste', defaultValues.volumeOfWaste)
      setValue('timeOfArrival', defaultValues.timeOfArrival)
      setValue('timeOfDeparture', defaultValues.timeOfDeparture)
      if (vehicles) {
        setValue(
          'vehicleId',
          defaultValues.vehicleId ? defaultValues.vehicleId.toString() : ''
        )
      }
    }
  }, [defaultValues, setValue, vehicles])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/vehicle?search=${search2}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setVehicles(res.data)
        })
    }
  }, [search2])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
      <div className="mt-3 flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
          <div className="flex">
            <input
              className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
              name="search"
              label="Search Vehicles..."
              placeholder="Search Vehicle by Registration Number.."
              type="textarea"
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
            />
            <button
              onClick={() => {
                setSearch2('')
              }}
              type="button"
              className="w-1/5"
            >
              Clear
            </button>
          </div>

          <Select
            name="vehicleId"
            label="Select a Vehicle..."
            error={errors.vehicleId ? errors.vehicleId.message : false}
            register={register('vehicleId', {
              required: {
                value: true,
                message: 'You must select a vehicle.'
              }
            })}
          >
            <option value="">Select a Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id.toString()}>
                {vehicle.registrationNumber}
              </option>
            ))}
          </Select>
        </div>

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

        <Input
          name="timeOfDeparture"
          label="Time of Departure"
          placeholder="Time of Departure..."
          type="datetime-local"
          error={errors.timeOfDeparture ? errors.timeOfDeparture.message : false}
          register={register('timeOfDeparture', {
            required: {
              value: true,
              message: 'Time of Departure is required'
            }
          })}
        />

      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} STS` : 'Submit'}
      </Button>
    </div>
  )
}

export default StsEntryForm
