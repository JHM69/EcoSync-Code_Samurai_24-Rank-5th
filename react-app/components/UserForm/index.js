import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
const UserForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name)
      setValue('roleId', defaultValues.roleId)
      setValue('email', defaultValues.email)
      setValue('password', defaultValues.password)
    }
  }, [defaultValues, setValue])

  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  // const onSubmitPermissions = handleSubmit(async (data) => {
  //   console.log(data.permissions)
     
  //   await axios.put(getBaseUrl + `/users/${defaultValues.id}/permissions`, data.permissions, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   }
  //   ).then((res) => {
  //     console.log(res)
  //     if (res.status === 200 || res.status === 201) {
  //       alert('Successfully Added.')
  //     } else {
  //       alert(res.status)
  //       console.log(res)
  //     }
  //   })

  //   reset()
  // })



  return (
    <div {...props} className="flex flex-col space-y-6">
      <div>
        <Input
          name="name"
          label="Name "
          placeholder="Name..."
          type="text"
          error={errors.name ? errors.name.message : false}
          register={register('name', {
            required: {
              value: true,
              message: 'You must add the name of the user',
            },
          })}
        />
        <Input
          name="email"
          label="Email"
          placeholder="
            Email..."
          type="email"
          error={errors.email ? errors.email.message : false}
          register={register('email', {
            required: {
              value: true,
              message: 'You must add the email of the user.',
            },
          })}
        />

        {type === 'Add' && (
          <Input
            name="password"
            label="Temporary Password"
            placeholder="Password..."
            type="password"
            error={errors.password ? errors.password.message : false}
            register={register('password', {
              required: {
                value: true,
                message: 'You must add the password of the user.',
              },
            })}
          />
        )}

        {type === 'Update' && (
          <Select
            name="roleId"
            label="Select a Role"
            error={errors.roleId ? errors.roleId.message : false}
            register={register('roleId', {
              required: {
                value: true,
                message: 'You must select a role.',
              },
            })}
          >
            <option value="4">Unassigned</option>
            <option value="1">System Admin</option>
            <option value="2">STS Manager</option>
            <option value="3">Landfill Manager</option>
          </Select>
        )}

        {/* <FormSection defaultOpen={false} title={'Manage Permissions'}>
          <MultipleSelect
            name="permissions"
            multiple={true}
            label="Select Genre of the album..."
            error={errors.permissions ? errors.permissions.message : false}
            register={register('permissions', {})}
          >
            <option selected={true} value="pop">
              Pop
            </option>
            <option value="rock">Rock</option>
            <option value="hiphop">Hip Hop</option>
            <option value="rnb">RnB</option>
            <option value="jazz">Jazz</option>
            <option value="country">Country</option>
            <option value="classical">Classical</option>
            <option value="metal">Metal</option>
          </MultipleSelect>

          <Button type="button" onClick={onSubmitPermissions} className="w-full">
            Update Permissions
          </Button>
        </FormSection> */}
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} User` : 'Submit'}
      </Button>
    </div>
  )
}

export default UserForm
