import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect'
const RoleForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  console.log(
    defaultValues.permissions.map((permission) => String(permission.id)) || []
  )

  useEffect(() => {
    if (defaultValues) {
      setValue('type', defaultValues.type)

      setValue(
        'permissions',
        defaultValues?.permissions?.map(
          (permission) => 'id-' + String(permission.id)
        ) || []
      )
    }
  }, [defaultValues, setValue])

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
              message: 'You must add the type of the user',
            },
          })}
        />
        <MultipleSelect
          name="permissions"
          multiple={true}
          label="Permissions"
          error={errors.permissions ? errors.permissions.message : false}
          register={register('permissions', [])}
        >
          <OptionWithCheckbox value="id-1"> Edit STS Entry</OptionWithCheckbox>
          <OptionWithCheckbox value="id-2"> Edit Vehicle Entry</OptionWithCheckbox>
          <OptionWithCheckbox value="id-3">
            {' '}
            Edit Landfill Entry{' '}
          </OptionWithCheckbox>
          <OptionWithCheckbox value="id-4"> Edit User</OptionWithCheckbox>
          <OptionWithCheckbox value="id-5"> View User</OptionWithCheckbox>
          <OptionWithCheckbox value="id-6"> Edit Role</OptionWithCheckbox>
          <OptionWithCheckbox value="id-7"> View Role</OptionWithCheckbox>
          <OptionWithCheckbox value="id-8"> Edit Permission</OptionWithCheckbox>
          <OptionWithCheckbox value="id-9"> View Permission</OptionWithCheckbox>
          <OptionWithCheckbox value="id-10"> View STS Entry</OptionWithCheckbox>
          <OptionWithCheckbox value="id-11">
            {' '}
            View Vehicle Entry
          </OptionWithCheckbox>
          <OptionWithCheckbox value="id-12">
            {' '}
            View Landfill Entry
          </OptionWithCheckbox>
        </MultipleSelect>
      </div>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Role` : 'Submit'}
      </Button>
    </div>
  )
}

export default RoleForm
