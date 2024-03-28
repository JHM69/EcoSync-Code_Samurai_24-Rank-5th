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

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (defaultValues && loaded) {
      setValue('type', defaultValues.type)
      setValue('permissionIds', defaultValues.permissions.map((p) => p.name))
    }
  }, [defaultValues, setValue, loaded])

  // print permissionIds
  console.log(register('permissionIds'))

  console.log(register('type'))

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
          setLoaded(true)
        })
    }
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    // await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <form>
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
          name="permissionIds"
          multiple={true}
          label="Select Permissions"
          register={register('permissionIds')}
        >
          {permissions?.map((p) => (
            <OptionWithCheckbox key={p.name} value={p.name}>
              {p.name}
            </OptionWithCheckbox>
          ))}
        </MultipleSelect>
      </form>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Role` : 'Submit'}
      </Button>
    </div>
  )
}

export default RoleForm
