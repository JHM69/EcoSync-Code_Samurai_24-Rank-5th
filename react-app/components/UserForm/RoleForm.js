import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
const RoleForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  console.log(
    defaultValues.permissions
  )

  useEffect(() => {
    if (defaultValues) {
      setValue('type', defaultValues.type)
      setValue(
        'vehicleIds',
        defaultValues.permissions.map((p) => (p.id)).toString  
      )
       
    }
  }, [defaultValues, setValue])

  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(`${getBaseUrl()}/rbac/permissions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setPermissions(res.data)
        })
    }
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="type"
          disabled
          label="Role Type "
          placeholder="Type..."
          type="text"
          error={errors.name ? errors.name.message : false}
          register={register('type', {
            required: {
              value: true,
              message: 'You must add the type of the user'
            }
          })}
        />

        <MultipleSelect
          name="permissions"
          multiple={true}
          label="Select Permissions"
          register={register('permissions')}
        >
          {permissions?.map((user) => (
            <OptionWithCheckbox key={user.id} value={String(user.id)}>
              {user.name}
            </OptionWithCheckbox>
          ))}
        </MultipleSelect>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Role` : 'Submit'}
      </Button>
    </div>
  )
}

export default RoleForm
