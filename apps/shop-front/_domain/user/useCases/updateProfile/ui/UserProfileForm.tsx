'use client'

import type { UserProfile } from '@/_domain/user/model'
import { useForm } from 'react-hook-form'
import { useActionState } from 'react'

type ActionState = {
  errors: Record<string, { message: string }>
  values: UserProfile
}

export type EditUserProfileProps = {
  profile: UserProfile
  action: (initialData: ActionState, formData: UserProfile) => Promise<ActionState>
}

export const UserProfileForm = ({ profile, action }: EditUserProfileProps) => {
  const [state, formAction, isPending] = useActionState(action, {
    values: profile,
    errors: {},
  })

  const { register, formState, handleSubmit } = useForm({
    values: state.values,
    errors: state.errors,
    mode: 'onBlur',
  })

  return (
    <form onSubmit={handleSubmit(formAction)}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input type="email" className="input input-disabled" disabled value={profile.email} />
      </fieldset>

      <div className={'divider'} />

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Name</legend>

        <label className="label" htmlFor={'firstName'}>
          First name
        </label>
        <input className="input input-bordered" {...register('firstName')} />
        {formState.errors.firstName && <p className="label text-error">{formState.errors.firstName.message}</p>}

        <label className="label" htmlFor={'lastName'}>
          Last name
        </label>
        <input className="input input-bordered" {...register('lastName')} />
        {formState.errors.lastName && <p className="label text-error">{formState.errors.lastName.message}</p>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Address</legend>

        <label className="label" htmlFor={'address.street'}>
          Street
        </label>
        <input className="input input-bordered" {...register('address.street')} />
        {formState.errors.address?.street && (
          <p className="label text-error">{formState.errors.address.street.message}</p>
        )}

        <label className="label" htmlFor={'address.zip'}>
          Postal Code
        </label>
        <input className="input input-bordered" {...register('address.zipCode')} />
        {formState.errors.address?.zipCode && (
          <p className="label text-error">{formState.errors.address.zipCode.message}</p>
        )}

        <label className="label" htmlFor={'address.city'}>
          City
        </label>
        <input className="input input-bordered" {...register('address.city')} />
        {formState.errors.address?.city && <p className="label text-error">{formState.errors.address.city.message}</p>}
      </fieldset>

      <fieldset className="fieldset">
        <label className="label" htmlFor={'phone'}>
          Phone
        </label>
        <input className="input input-bordered" {...register('phoneNumber')} />
        {formState.errors.phoneNumber && <p className="label text-error">{formState.errors.phoneNumber.message}</p>}

        <button className={'btn btn-primary'} type={'submit'} disabled={isPending}>
          Update Profile
        </button>
      </fieldset>
    </form>
  )
}
