import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNotificationsStore } from '../stores'

type Contact = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  role: string
  contactMethod: string
  subscribe: boolean
  experience: string
  bio: string
  website: string
  startDate: string
  guests: number
}

type CheckInFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  company: string
  role: string
  contactMethod: 'email' | 'phone' | 'sms'
  subscribe: boolean
  experience: number
  bio: string
  website: string
  startDate: string
  guests: number
}

const initialValues: CheckInFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  company: '',
  role: 'designer',
  contactMethod: 'email',
  subscribe: false,
  experience: 3,
  bio: '',
  website: '',
  startDate: '',
  guests: 1,
}

const storageKey = 'advanced3-checkin-form'

const getStoredDefaults = (): CheckInFormValues => {
  if (typeof window === 'undefined') return initialValues
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return initialValues
    const data = JSON.parse(raw) as Partial<CheckInFormValues>
    return { ...initialValues, ...data }
  } catch {
    return initialValues
  }
}

const checkInFormSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string(),
    email: z.string().email('Enter a valid email address.'),
    phone: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    company: z.string(),
    role: z.string(),
    contactMethod: z.enum(['email', 'phone', 'sms']),
    subscribe: z.boolean(),
    experience: z.coerce.number().min(0, 'Select 0-10.').max(10, 'Select 0-10.'),
    bio: z.string(),
    website: z.string().url('Enter a valid URL.').or(z.literal('')),
    startDate: z.string(),
    guests: z.coerce.number().min(1, 'At least 1 guest.').max(10, 'No more than 10.'),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      })
    }
  })

function CheckInForm() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<CheckInFormValues>({
    defaultValues: getStoredDefaults(),
    mode: 'onBlur',
    resolver: zodResolver(checkInFormSchema),
  })

  useEffect(() => {
    document.title = contacts.length
      ? `${contacts.length} contact${contacts.length === 1 ? '' : 's'} saved`
      : 'Contact form'
  }, [contacts])

  useEffect(() => {
    const subscription = watch((values) => {
      const { password, confirmPassword, ...safeValues } = values
      if (typeof window === 'undefined') return
      window.localStorage.setItem(storageKey, JSON.stringify(safeValues))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const countLabel = contacts.length === 1 ? '1 contact' : `${contacts.length} contacts`

  const onSubmit = async (values: CheckInFormValues) => {
    const trimmedEmail = values.email.trim()
    const trimmedFirst = values.firstName.trim()
    const contact: Contact = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      firstName: trimmedFirst,
      lastName: values.lastName.trim(),
      email: trimmedEmail,
      phone: values.phone.trim(),
      company: values.company.trim(),
      role: values.role,
      contactMethod: values.contactMethod,
      subscribe: values.subscribe,
      experience: values.experience,
      bio: values.bio.trim(),
      website: values.website.trim(),
      startDate: values.startDate,
      guests: values.guests,
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Submitted check-in form:', values)
    setContacts((current) => [contact, ...current])
    reset(initialValues)
    addNotification({
      type: 'success',
      message: 'Contact saved.',
      timeout: 3000,
    })
  }

  return (
    <section className="card">
      <div className="heading-row">
        <h2>Simple contact form</h2>
        <span className="contact-count">{countLabel}</span>
      </div>
      <p className="muted">Complete the check-in details below.</p>

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            aria-invalid={Boolean(errors.firstName)}
            {...register('firstName')}
            placeholder="Jhon"
          />
          {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            aria-invalid={Boolean(errors.lastName)}
            {...register('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
            placeholder="email@example.com"
            required
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone')}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
            placeholder="At least 8 characters"
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            aria-invalid={Boolean(errors.company)}
            {...register('company')}
            placeholder="Zionet"
          />
          {errors.company && <p className="field-error">{errors.company.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            aria-invalid={Boolean(errors.role)}
            {...register('role')}
          >
            <option value="designer">Designer</option>
            <option value="engineer">Engineer</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
          {errors.role && <p className="field-error">{errors.role.message}</p>}
        </div>

        <fieldset className="field field--full">
          <legend>Preferred contact method</legend>
          <div className="choice-group">
            <label className="choice-row" htmlFor="contactEmail">
              <input
                id="contactEmail"
                type="radio"
                value="email"
                {...register('contactMethod')}
              />
              Email
            </label>
            <label className="choice-row" htmlFor="contactPhone">
              <input
                id="contactPhone"
                type="radio"
                value="phone"
                {...register('contactMethod')}
              />
              Phone call
            </label>
            <label className="choice-row" htmlFor="contactSms">
              <input
                id="contactSms"
                type="radio"
                value="sms"
                {...register('contactMethod')}
              />
              SMS
            </label>
          </div>
          {errors.contactMethod && (
            <p className="field-error">{errors.contactMethod.message}</p>
          )}
        </fieldset>

        <div className="field">
          <label className="choice-row" htmlFor="subscribe">
            <input
              id="subscribe"
              type="checkbox"
              {...register('subscribe')}
            />
            Subscribe to product updates
          </label>
          {errors.subscribe && <p className="field-error">{errors.subscribe.message}</p>}
        </div>

        <div className="field field--full">
          <label htmlFor="experience">
            Experience level <span className="muted">(0-10)</span>
          </label>
          <input
            id="experience"
            type="range"
            min="0"
            max="10"
            aria-invalid={Boolean(errors.experience)}
            {...register('experience')}
          />
          {errors.experience && <p className="field-error">{errors.experience.message}</p>}
        </div>

        <div className="field field--full">
          <label htmlFor="bio">Short bio</label>
          <textarea
            id="bio"
            aria-invalid={Boolean(errors.bio)}
            {...register('bio')}
            placeholder="A couple of sentences about your experience."
            rows={4}
          />
          {errors.bio && <p className="field-error">{errors.bio.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="website">Portfolio website</label>
          <input
            id="website"
            type="url"
            aria-invalid={Boolean(errors.website)}
            {...register('website')}
            placeholder="https://example.com"
          />
          {errors.website && <p className="field-error">{errors.website.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="startDate">Preferred start date</label>
          <input
            id="startDate"
            type="date"
            aria-invalid={Boolean(errors.startDate)}
            {...register('startDate')}
          />
          {errors.startDate && <p className="field-error">{errors.startDate.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="guests">Number of guests</label>
          <input
            id="guests"
            type="number"
            min="1"
            max="10"
            aria-invalid={Boolean(errors.guests)}
            {...register('guests', { valueAsNumber: true })}
          />
          {errors.guests && <p className="field-error">{errors.guests.message}</p>}
        </div>

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save contact'}
        </button>
      </form>

      {contacts.length > 0 && (
        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <div>
                <strong>
                  {contact.firstName} {contact.lastName}
                </strong>
                <div className="muted small">
                  <span>{contact.email}</span>
                  {contact.phone && <span> · {contact.phone}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CheckInForm
