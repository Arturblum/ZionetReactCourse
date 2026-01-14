import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNotificationsStore } from '@my-app/hooks'

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

function CheckInForm() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const { t } = useTranslation(['checkin'])
  const checkInFormSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(1, t('fields.firstName.required')),
          lastName: z.string(),
          email: z.string().min(1, t('fields.email.required')).email(t('fields.email.invalid')),
          phone: z.string(),
          password: z.string().min(8, t('fields.password.min')),
          confirmPassword: z.string().min(1, t('fields.confirmPassword.required')),
          company: z.string(),
          role: z.string(),
          contactMethod: z.enum(['email', 'phone', 'sms']),
          subscribe: z.boolean(),
          experience: z
            .coerce
            .number()
            .min(0, t('fields.experience.min'))
            .max(10, t('fields.experience.max')),
          bio: z.string(),
          website: z.string().url(t('fields.website.invalid')).or(z.literal('')),
          startDate: z.string(),
          guests: z
            .coerce
            .number()
            .min(1, t('fields.guests.min'))
            .max(10, t('fields.guests.max')),
        })
        .superRefine(({ password, confirmPassword }, context) => {
          if (password !== confirmPassword) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['confirmPassword'],
              message: t('fields.confirmPassword.mismatch'),
            })
          }
        }),
    [t]
  )
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, submitCount },
    reset,
    watch,
  } = useForm<CheckInFormValues>({
    defaultValues: getStoredDefaults(),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(checkInFormSchema),
  })

  useEffect(() => {
    document.title = contacts.length
      ? t('contactCount', { count: contacts.length })
      : t('title')
  }, [contacts, t])

  useEffect(() => {
    const subscription = watch((values) => {
      const { password: _password, confirmPassword: _confirmPassword, ...safeValues } = values
      if (typeof window === 'undefined') return
      window.localStorage.setItem(storageKey, JSON.stringify(safeValues))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const countLabel = t('contactCount', { count: contacts.length })
  const hasErrors = submitCount > 0 && Object.keys(errors).length > 0

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
      message: t('contactSaved'),
      timeout: 3000,
    })
  }

  return (
    <section className="card">
      <div className="heading-row">
        <h2>{t('title')}</h2>
        <span className="contact-count">{countLabel}</span>
      </div>
      <p className="muted">{t('subtitle')}</p>
      <p className="muted small">{t('requiredNote')}</p>

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {hasErrors && (
          <div className="form-error" role="alert">
            {t('errorsHeading')}
          </div>
        )}
        <div className="field">
          <label htmlFor="firstName">
            {t('fields.firstName.label')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="firstName"
            type="text"
            aria-invalid={Boolean(errors.firstName)}
            aria-required="true"
            {...register('firstName')}
            placeholder={t('fields.firstName.placeholder')}
          />
          {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="lastName">
            {t('fields.lastName.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <input
            id="lastName"
            type="text"
            aria-invalid={Boolean(errors.lastName)}
            {...register('lastName')}
            placeholder={t('fields.lastName.placeholder')}
          />
          {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">
            {t('fields.email.label')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            aria-required="true"
            {...register('email')}
            placeholder={t('fields.email.placeholder')}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone">
            {t('fields.phone.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <input
            id="phone"
            type="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone')}
            placeholder={t('fields.phone.placeholder')}
          />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">
            {t('fields.password.label')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="password"
            type="password"
            aria-invalid={Boolean(errors.password)}
            aria-required="true"
            {...register('password')}
            placeholder={t('fields.password.placeholder')}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">
            {t('fields.confirmPassword.label')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-required="true"
            {...register('confirmPassword')}
            placeholder={t('fields.confirmPassword.placeholder')}
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="company">
            {t('fields.company.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <input
            id="company"
            type="text"
            aria-invalid={Boolean(errors.company)}
            {...register('company')}
            placeholder={t('fields.company.placeholder')}
          />
          {errors.company && <p className="field-error">{errors.company.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="role">
            {t('fields.role.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <select
            id="role"
            aria-invalid={Boolean(errors.role)}
            {...register('role')}
          >
            <option value="designer">{t('fields.role.options.designer')}</option>
            <option value="engineer">{t('fields.role.options.engineer')}</option>
            <option value="product">{t('fields.role.options.product')}</option>
            <option value="other">{t('fields.role.options.other')}</option>
          </select>
          {errors.role && <p className="field-error">{errors.role.message}</p>}
        </div>

        <fieldset className="field field--full">
          <legend>
            {t('fields.contactMethod.legend')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </legend>
          <div className="choice-group">
            <label className="choice-row choice-custom" htmlFor="contactEmail">
              <input
                id="contactEmail"
                className="visually-hidden"
                type="radio"
                value="email"
                {...register('contactMethod')}
              />
              <span className="choice-control" aria-hidden="true" />
              <span>{t('fields.contactMethod.options.email')}</span>
            </label>
            <label className="choice-row choice-custom" htmlFor="contactPhone">
              <input
                id="contactPhone"
                className="visually-hidden"
                type="radio"
                value="phone"
                {...register('contactMethod')}
              />
              <span className="choice-control" aria-hidden="true" />
              <span>{t('fields.contactMethod.options.phone')}</span>
            </label>
            <label className="choice-row choice-custom" htmlFor="contactSms">
              <input
                id="contactSms"
                className="visually-hidden"
                type="radio"
                value="sms"
                {...register('contactMethod')}
              />
              <span className="choice-control" aria-hidden="true" />
              <span>{t('fields.contactMethod.options.sms')}</span>
            </label>
          </div>
          {errors.contactMethod && (
            <p className="field-error">{errors.contactMethod.message}</p>
          )}
        </fieldset>

        <div className="field">
          <label className="choice-row choice-custom" htmlFor="subscribe">
            <input
              id="subscribe"
              className="visually-hidden"
              type="checkbox"
              {...register('subscribe')}
            />
            <span className="choice-control" aria-hidden="true" />
            <span>{t('fields.subscribe.label')}</span>
          </label>
          {errors.subscribe && <p className="field-error">{errors.subscribe.message}</p>}
        </div>

        <div className="field field--full">
          <label htmlFor="experience">
            {t('fields.experience.label')}{' '}
            <span className="muted">{t('fields.experience.rangeHint')}</span>
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="experience"
            type="range"
            min="0"
            max="10"
            aria-invalid={Boolean(errors.experience)}
            aria-required="true"
            {...register('experience')}
          />
          {errors.experience && <p className="field-error">{errors.experience.message}</p>}
        </div>

        <div className="field field--full">
          <label htmlFor="bio">
            {t('fields.bio.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <textarea
            id="bio"
            aria-invalid={Boolean(errors.bio)}
            {...register('bio')}
            placeholder={t('fields.bio.placeholder')}
            rows={4}
          />
          {errors.bio && <p className="field-error">{errors.bio.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="website">
            {t('fields.website.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <input
            id="website"
            type="url"
            aria-invalid={Boolean(errors.website)}
            {...register('website')}
            placeholder={t('fields.website.placeholder')}
          />
          {errors.website && <p className="field-error">{errors.website.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="startDate">
            {t('fields.startDate.label')}
            <span className="field-tag">{t('optional')}</span>
          </label>
          <input
            id="startDate"
            type="date"
            aria-invalid={Boolean(errors.startDate)}
            {...register('startDate')}
          />
          {errors.startDate && <p className="field-error">{errors.startDate.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="guests">
            {t('fields.guests.label')}
            <span className="field-tag field-tag--required">{t('required')}</span>
          </label>
          <input
            id="guests"
            type="number"
            min="1"
            max="10"
            aria-invalid={Boolean(errors.guests)}
            aria-required="true"
            {...register('guests', { valueAsNumber: true })}
          />
          {errors.guests && <p className="field-error">{errors.guests.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('savingContact') : t('saveContact')}
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
