import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import FormSection from '../common/Section'
const UserForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
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

  return (
    <div {...props} className="flex flex-col space-y-6">
        <FormSection defaultOpen={true} title={'User Information'}>
          <Input
            name="name"
            label="Name "
            placeholder="Name..."
            type="text"
            error={errors.name ? errors.name.message : false}
            register={register('name', {
              required: {
                value: true,
                message: 'You must add the name of the user'
              }
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
                message: 'You must add the email of the user.'
              }
            })}
          />
          <Input
            name="password"
            label="Temporary Password"
            placeholder="Password..."
            type="password"
            error={errors.password ? errors.password.message : false}
            register={register('password', {
              required: {
                value: true,
                message: 'You must add the password of the user.'
              }
            })}
          />

          <Select
            name="roleId"
            label="Select a Role"
            error={errors.roleId ? errors.roleId.message : false}
            register={register('roleId', {
              required: {
                value: true,
                message: 'You must select a role.'
              }
            })}
          >
          <option value="4">Unassigned</option>
            <option value="1">System Admin</option>
            <option value="2">STS Manager</option>
            <option value="3">Landfill Manager</option>

          </Select>

      </FormSection>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} User` : 'Submit'}
      </Button>
    </div>
  )
}

export default UserForm
