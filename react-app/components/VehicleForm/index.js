/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
import toast from 'react-hot-toast'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
const VehicleForm = ({ type, defaultValues, onFormSubmit,handleClose,reload,setReload, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [search, setSearch] = useState('')
  const [stsManagers, setStsMans] = useState([])

  useEffect(() => {
    if (defaultValues) {
      setValue('registrationNumber', defaultValues.registrationNumber)
      setValue('type', defaultValues.type)
      setValue('capacity', defaultValues.capacity)
      setValue('loaddedFuelCost', defaultValues.loaddedFuelCost)
      setValue('unloadedFuelCost', defaultValues.unloadedFuelCost)

      if (stsManagers) {
        setValue(
          'driverIds',
          defaultValues?.drivers?.map((driver) => driver.id.toString()) || []
        )
      }
    }
  }, [defaultValues, setValue, stsManagers])

  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/users?search=${search}&type=driver`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setStsMans(res.data)
        })
    }
  }, [search])

  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await onFormSubmit(data)
    reset()
    setLoading(false)
    // window.location.reload()
  })
  const onSubmit2 = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(getBaseUrl()+'/vehicle/'+defaultValues.id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Vehicle deleted successfully')
      handleClose()
      setReload(!reload)
      // window.location.reload()
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete vehicle')
    }
  }

  return (
    <div {...props} className="flex flex-col space-y-6">
      <form>
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
              message: 'Registration Number is required'
            }
          })}
        />

        <Select
          name="type"
          label="Type"
          error={errors.type ? errors.type.message : false}
          register={register('type', {
            required: {
              value: true,
              message: 'Type is required'
            }
          })}
        >
          <option value="Compactor">Compactor</option>
          <option value="DumpTruck">Dump Truck</option>
          <option value="OpenTruck">Open Truck</option>
          <option value="ContainerCarrier">Container Carrier</option>
        </Select>

        {/* <Input
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
        /> */}

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
              message: 'Loadded Fuel Cost is required'
            }
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
              message: 'Unloadded Fuel Cost is required'
            }
          })}
        />

<div className="flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
            <div className="flex items-center space-x-2">
              <input
                className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
                name="search"
                label="Search Driver..."
                placeholder="Search Driver by Name or Email..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => {
                  setSearch('')
                }}
                type="button"
                className="w-1/5 rounded-md bg-blue-500 px-3 py-2 text-white transition duration-200 hover:bg-blue-600"
              >
                Clear
              </button>
            </div>

            <MultipleSelect
              name="driverIds"
              multiple={true}
              label="Select Driver..."
              register={register('driverIds')}
            >
              {stsManagers?.map((user) => (
                <OptionWithCheckbox
                  key={user.id.toString()}
                  value={user.id.toString()}
                >
                  {user.name}
                </OptionWithCheckbox>
              ))}
            </MultipleSelect>
          </div>

      <Button type="button" onClick={onSubmit} className="w-full" disable={loading}>
        {loading?(type ? `Loading...` : 'Submit') :(type ? `${type} Vehicle` : 'Submit')}
      </Button>
      {type!="Add" && (<Button type="button" onClick={onSubmit2} className="w-full bg-red-500">
        Delete Vehicle
      </Button>)}
      </form>
    </div>
  )
}

export default VehicleForm
