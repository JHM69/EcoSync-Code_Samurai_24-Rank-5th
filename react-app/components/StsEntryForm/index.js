/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
const StsEntryForm = ({ type, defaultValues, onFormSubmit,handleClose,landfills,stsId, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [search2, setSearch2] = useState('')
  const [vehicles, setVehicles] = useState([])
  // const [landfills, setLandfills] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultValues) {
      setValue('volumeOfWaste', defaultValues.volumeOfWaste)
      const formattedTimeOfArrival = defaultValues?.timeOfArrival
        ? new Date(defaultValues?.timeOfArrival).toISOString().slice(0, 16)
        : '' // Converts to "YYYY-MM-DDTHH:MM" format
      setValue('timeOfArrival', formattedTimeOfArrival)

      const formattedTimeOfDeparture = defaultValues?.timeOfDeparture
        ? new Date(defaultValues?.timeOfDeparture).toISOString().slice(0, 16)
        : '' // Converts to "YYYY-MM-DDTHH:MM" format
      setValue('timeOfDeparture', formattedTimeOfDeparture)
      if (vehicles) {
        setValue(
          'vehicleId',
          defaultValues.vehicleId ? defaultValues.vehicleId.toString() : ''
        )
      }
    }
  }, [])

  // useEffect(async() => {
  //   try {
  //     // make a axios call to get the landfill
  //   const token = localStorage.getItem('token')
  //   let landfills = await axios.get(`${getBaseUrl()}/landfills`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   setLandfills(landfills.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/stsvehicle/${stsId}?search=${search2}`, {
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
    setLoading(true)
    // convert timeOfArrival to ISO string
    data.timeOfArrival = new Date(data.timeOfArrival).toISOString()
    data.timeOfDeparture = new Date(data.timeOfDeparture).toISOString()
    await onFormSubmit(data)
    setLoading(false)
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

        {/* select a landfill from dropdown and add its id */}
        <Select
          name="landfillId"
          label="Select a Landfill..."
          error={errors.landfillId ? errors.landfillId.message : false}
          register={register('landfillId', {
            required: {
              value: true,
              message: 'You must select a landfill.'
            }
          })}
        >

          <option value="">Select a Landfill</option>
          {landfills.map((landfill) => (
            <option key={landfill.id} value={landfill.id.toString()}>
              {landfill.name}
            </option>
          ))}
        </Select>
        

        <Input
          name="volumeOfWaste"
          label="Volume of Waste in Ton"
          placeholder="Volume of Waste in Ton..."
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
          type='datetime-local'
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
          type='datetime-local'
          error={errors.timeOfDeparture ? errors.timeOfDeparture.message : false}
          register={register('timeOfDeparture', {
            required: {
              value: true,
              message: 'Time of Departure is required'
            }
          })}
        />

      </div>

      <Button type="button" onClick={onSubmit} className="w-full" disable={loading}>
        {/* loading and type condition */}
        {loading ? "Adding" : 'Add Entry'}
      </Button>
    </div>
  )
}

export default StsEntryForm
