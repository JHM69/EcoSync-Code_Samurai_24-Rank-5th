/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { getBaseUrl } from '../../utils/url'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
const StsForm = ({ type, defaultValues, onFormSubmit,handleClose,reload,setReload, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  const [search, setSearch] = useState('')
  const [stsManagers, setStsMans] = useState([])

  const [search2, setSearch2] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    if (defaultValues) {
      setValue('wardNumber', defaultValues.wardNumber)
      setValue('capacity', defaultValues.capacity)
      setValue('lat', defaultValues.lat)
      setValue('lon', defaultValues.lon)
      setValue('name', defaultValues.name)
      
      setValue('address', defaultValues.address)
      setValue('logo', defaultValues.logo)
      if (vehicles) {
        setValue(
          'vehicleIds',
          defaultValues?.vehicles?.map((vehicle) => vehicle.id.toString()) || []
        )
      }

      if (stsManagers) {
        setValue(
          'managerIds2',
          defaultValues?.managers?.map((manager) => manager.id.toString()) || []
        )
      }
    }
  }, [defaultValues, setValue, stsManagers, vehicles])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/stsmanagers?search=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
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
        .get(`${getBaseUrl()}/freevehicle?search=${search2}`, {
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
    setLoading(true)
    await onFormSubmit(data)
    setLoading(false)
    setReload(!reload)
    reset()
  })

  const onSubmit2 =async () => {
    try {
      setLoading2(true)
      const token = localStorage.getItem('token')
      await axios.delete(getBaseUrl() + `/sts/${defaultValues.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('STS Deleted Successfully')
      setReload(!reload)
    } catch (error) {
      // alert('Error Deleting STS')
      toast.success('Error Deleting STS')
    } finally { 
      setLoading2(false)
      handleClose()
    }
  }

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
      <Input
          name="name"
          label="Name"
          placeholder="sts name"
          type="text"
          error={errors.name ? errors.name.message : false}
          register={register('name')} // No need for full validation object if optional
        />
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

        <Input
          name="logo"
          label="Logo"
          placeholder="Logo URL..."
          type="text"
          error={errors.logo ? errors.logo.message : false}
          register={register('logo')}
        />

<div className="flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
  <div className="flex items-center space-x-2">
    <input
      className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
      name="search"
      label="Search Manager..."
      placeholder="Search Managers by Name or Email..."
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button
      onClick={() => {
        setSearch('');
      }}
      type="button"
      className="w-1/5 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Clear
    </button>
  </div>

  <div className="flex flex-col mt-2 space-y-2">
    {stsManagers?.map((user) => (
      <label key={user.id} className="flex items-center space-x-2">
        <Input
          type="checkbox"
          name="managerIds"
          value={user.id.toString()}
          {...register('managerIds')}
        />
        <span>{user.name}</span>
      </label>
    ))}
  </div>
</div>


<div className="mt-3 flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
  <div className="flex">
    <input
      className="w-4/5 rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-200"
      name="search"
      label="Search Vehicles..."
      placeholder="Search available Vehicles by Registration Number.."
      type="text" // Change type from 'textarea' to 'text'
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

  <div className="flex flex-col mt-2 space-y-2">
    {vehicles?.map((v) => (
      <label key={v.id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="vehicleIds"
          value={v.id.toString()}
          {...register('vehicleIds')}
        />
        <span>{v.registrationNumber}</span>
      </label>
    ))}
  </div>
</div>

      </div>

      <Button type="button" onClick={onSubmit} className="w-full" disabled={loading}>
        {/* {type ? `${type} STS` : 'Submit'} */}
        {type === 'Update' ? (loading ? 'Updating STS...' : 'Update STS') : (loading ? 'Adding STS...' : 'Add STS')}
      </Button>
      
      {type === 'Update' &&(<Button type="button" onClick={onSubmit2} className="w-full bg-red-500" disabled={loading}>
        {loading2 ? 'Deleting STS...' : 'Delete STS'}
      </Button>)}
    </div>
  )
}

export default StsForm
