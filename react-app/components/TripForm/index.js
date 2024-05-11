/* eslint-disable no-unused-vars */
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
const TripForm = ({
  type,
  defaultValues,
  onFormSubmit,
  handleClose,
  reload,
  setReload,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [stss, setStss] = useState([])

  useEffect(() => {
    if (defaultValues) {
      setValue('vehicleId', defaultValues.vehicleId)
      setValue('stsList', defaultValues.stsList)
      setValue('landfillList', defaultValues.landfillList)
      setValue('driverId', defaultValues.driverId)
    }
  }, [defaultValues, setValue, vehicles, drivers])

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       axios
//         .get(`${getBaseUrl()}/tripplan`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((res) => {
//           setTrips(res.data)
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     }
//   }, [])

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       axios
//         .get(`${getBaseUrl()}/freevehicle?search=${search2}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((res) => {
//           setVehicles(res.data)
//         })
//     }
//   }, [search2])

  const onSubmit = handleSubmit(async (data) => { 
    setLoading(true)
    await onFormSubmit(data)
    setLoading(false)
    setReload(!reload)
    reset()
  })

//   const onSubmit2 = async () => {
//     try {
//       setLoading2(true)
//       const token = localStorage.getItem('token')
//       await axios.delete(getBaseUrl() + `/trip/${defaultValues.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       toast.success('STS Deleted Successfully')
//       setReload(!reload)
//     } catch (error) {
//       // alert('Error Deleting STS')
//       toast.success('Error Deleting STS')
//     } finally {
//       setLoading2(false)
//       handleClose()
//     }
//   }

  return (
    <div {...props} className="flex flex-col space-y-6">
      <form>
        <div>
          <Input
            name="driverId"
            label="Driver Id"
            placeholder="Driver Id..."
            type="text"
            error={errors.driverId ? errors.driverId.message : false}
            register={register('driverId', {
                required: {
                    value: true,
                    message: 'Driver Id is required',
                },
            })}
          />

          <Input
            name="vehicleId"
            label="Vehicle Id"
            placeholder="Vehicle Id..."
            type="text"
            error={errors.vehicleId ? errors.vehicleId.message : false}
            register={register('vehicleId', {
              required: {
                value: true,
                message: 'Vehicle Id is required',
              },
            })}
          />
          <Input
            name="stsList"
            label="STS"
            placeholder="STS(s)..."
            type="text" // Or 'number' if appropriate
            error={errors.stsList ? errors.stsList.message : false}
            register={register('stsList', {
              required: {
                value: true,
                message: 'Minimum 1 STS is required',
              },
            })}
          />

          <Input
            name="landfillList"
            label="Landfill"
            placeholder="Landfill(s)..."
            type="text"
            error={errors.landfillList ? errors.landfillList.message : false}
            register={register('landfillList', {
              required: {
                value: true,
                message: 'Minimum 1 Landfill is required',
              },
            })}
          />

          {/* <div className="flex flex-col rounded-[4px] border-[1px] border-gray-300 p-3">
            <MultipleSelect
              name="managerIds"
              multiple={true}
              label="Select manager..."
              register={register('managerIds')}
            >
              {vehicles?.map((user) => (
                <OptionWithCheckbox
                  key={user.id.toString()}
                  value={user.id.toString()}
                >
                  {user.name}
                </OptionWithCheckbox>
              ))}
            </MultipleSelect>
          </div> */}

            {/* <MultipleSelect
              name="vehicleIds"
              multiple={true}
              label="Select Vehicles..."
              register={register('vehicleIds')}
            >
              {vehicles?.map((v) => (
                <OptionWithCheckbox key={v.id} value={v.id.toString()}>
                  {v.registrationNumber}
                </OptionWithCheckbox>
              ))}
            </MultipleSelect> */}
        </div>

        <Button
          type="button"
          onClick={onSubmit}
          className="w-full"
          disabled={loading}
        >
          {/* {type ? `${type} STS` : 'Submit'} */}
          {loading
            ? 'Adding Trip Plan...'
            : 'Add Trip Plan'}
        </Button>
      </form>
    </div>
  )
}

export default TripForm
