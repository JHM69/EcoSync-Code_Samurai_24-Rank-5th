import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'

const ContractorForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const [sts, setSts] = useState([])

  useEffect(() => {
    if (defaultValues) {
      setValue('companyName', defaultValues.companyName)
      setValue('stsId', defaultValues.stsId)
      setValue('registrationId', defaultValues.registrationId)
      setValue('registrationDate', defaultValues.registrationDate)
      setValue('tin', defaultValues.tin)
      setValue('phone', defaultValues.phone)
      setValue('paymentPerTonnage', defaultValues.paymentPerTonnage)
      setValue('requiredWastePerDay', defaultValues.requiredWastePerDay)
      setValue('contractStartDate', defaultValues.contractStartDate)
      setValue('contractEndDate', defaultValues.contractEndDate)
      setValue('areaOfCollection', defaultValues.areaOfCollection)
    }
  }, [defaultValues, setValue])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/sts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setSts(res.data)
        })
    }
  }, [sts])

  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="companyName"
          label="Company Name"
          placeholder="Company Name..."
          type="text"
          error={errors.companyName ? errors.companyName.message : false}
          register={register('companyName', {
            required: {
              value: true,
              message: 'You must add the name of the contractor company.'
            }
          })}
        />
        <Input
          name="registrationId"
          label="Registration ID"
          placeholder="Registration Id..."
          type="text"
          error={errors.registrationId ? errors.registrationId.message : false}
          register={register('registrationId', {
            required: {
              value: true,
              message: 'You must add the registrationId of the contractor.'
            }
          })}
        />

        <Input
          name="registrationDate"
          label="Registration Date"
          placeholder="Registration Date..."
          type="date"
          error={errors.registrationDate ? errors.registrationDate.message : false}
          register={register('registrationDate', {
            required: {
              value: true,
              message: 'You must add the registration date of the contractor.'
            }
          })}
        />

        <Input
          name="tin"
          label="TIN"
          placeholder="TIN..."
          type="text"
          error={errors.tin ? errors.tin.message : false}
          register={register('tin', {
            required: {
              value: true,
              message: 'You must add the TIN of the contractor.'
            }
          })}
        />

        <Input
          name="phone"
          label="Phone"
          placeholder="Phone..."
          type="text"
          error={errors.phone ? errors.phone.message : false}
          register={register('phone', {
            required: {
              value: true,
              message: 'You must add the phone of the contractor.'
            }
          })}
        />

        <Input
          name="paymentPerTonnage"
          label="Payment Per Tonnage"
          placeholder="Payment Per Tonnage..."
          type="text"
          error={errors.paymentPerTonnage ? errors.paymentPerTonnage.message : false}
          register={register('paymentPerTonnage', {
            required: {
              value: true,
              message: 'You must add the payment per tonnage of the contractor.'
            }
          })}
        />

        <Input
          name="requiredWastePerDay"
          label="Required Waste Per Day"
          placeholder="Required Waste Per Day..."
          type="text"
          error={errors.requiredWastePerDay ? errors.requiredWastePerDay.message : false}
          register={register('requiredWastePerDay', {
            required: {
              value: true,
              message: 'You must add the required waste per day of the contractor.'
            }
          })}
        />

        <Input
          name="contractStartDate"
          label="Contract Start Date"
          placeholder="Contract Start Date..."
          type="date"
          error={errors.contractStartDate ? errors.contractStartDate.message : false}
          register={register('contractStartDate', {
            required: {
              value: true,
              message: 'You must add the contract start date of the contractor.'
            }
          })}
        />

        <Input
          name="contractEndDate"
          label="Contract End Date"
          placeholder="Contract End Date..."
          type="date"
          error={errors.contractEndDate ? errors.contractEndDate.message : false}
          register={register('contractEndDate', {
            required: {
              value: true,
              message: 'You must add the contract end date of the contractor.'
            }
          })}
        />

        <Input
          name="areaOfCollection"
          label="Area Of Collection"
          placeholder="Area Of Collection..."
          type="text"
          error={errors.areaOfCollection ? errors.areaOfCollection.message : false}
          register={register('areaOfCollection', {
            required: {
              value: true,
              message: 'You must add the area of collection of the contractor.'
            }
          })}
        />

        {/* <Select
          name="areaOfCollection"
          label="Area Of Collection"
          placeholder="Area Of Collection..."
          type="text"
          multiple
          error={errors.areaOfCollection ? errors.areaOfCollection.message : false}
          register={register('areaOfCollection', {
            required: {
              value: true,
              message: 'You must add the area of collection of the contractor.'
            }
          })}
        >
          <option value="" selected>Select a Ward</option>
          <option value="1">Ward 1</option>
          <option value="2">Ward 2</option>
          <option value="3">Ward 3</option>
          <option value="4">Ward 4</option>
          <option value="5">Ward 5</option>
          <option value="6">Ward 6</option>
        </Select> */}

        <Select
          name="stsId"
          label="Select a Sts"
          error={errors.stsId ? errors.stsId.message : false}
          register={register('stdId', {
            required: {
              value: true,
              message: 'You must select a STS.'
            }
          })}
        >
          <option value="" selected>Select a STS</option>
          {sts.map((sts) => (
              <option key={sts.id} value={sts.id}>
                {sts.name}
              </option>
          ))}
        </Select>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Contractor` : 'Submit'}
      </Button>
    </div>
  )
}

export default ContractorForm
