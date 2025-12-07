import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

type Contact = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

function CheckInForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [countLabel, setCountLabel] = useState('0 contacts')

  useEffect(() => {
    document.title = contacts.length
      ? `${contacts.length} contact${contacts.length === 1 ? '' : 's'} saved`
      : 'Contact form'
  }, [contacts])

  useEffect(() => {
    const label = contacts.length === 1 ? '1 contact' : `${contacts.length} contacts`
    setCountLabel(label)
  }, [contacts])

  const handleInputChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.value)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedFirst = firstName.trim()
    if (!trimmedEmail || !trimmedFirst) return

    const contact: Contact = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      firstName: trimmedFirst,
      lastName: lastName.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
    }

    setContacts((current) => [contact, ...current])
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
  }

  return (
    <section className="card">
      <div className="heading-row">
        <h2>Simple contact form</h2>
        <span className="contact-count">{countLabel}</span>
      </div>
      <p className="muted">Add a first name, last name, email, and phone.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={handleInputChange(setFirstName)}
            placeholder="Jhon"
          />
        </div>

        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={handleInputChange(setLastName)}
            placeholder="Doe"
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            placeholder="email@example.com"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={handleInputChange(setPhone)}
            placeholder="(555) 123-4567"
          />
        </div>

        <button type="submit">Save contact</button>
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
