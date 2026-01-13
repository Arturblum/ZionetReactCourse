import { useNotificationsStore } from '@my-app/hooks'

function About() {
  const addNotification = useNotificationsStore((s) => s.addNotification)

  return (
    <section className="card">
      <h2>About</h2>
      <p className="muted">
        This demo shows a simple contact form and a basic React Router setup with two routes.
      </p>
      <div className="button-row">
        <button
          type="button"
          onClick={() =>
            addNotification({
              type: 'success',
              message: 'Saved successfully.',
              timeout: 4000,
            })
          }
        >
          Show success toast
        </button>
        <button
          type="button"
          onClick={() =>
            addNotification({
              type: 'error',
              message: 'Something went wrong.',
              timeout: 6000,
            })
          }
        >
          Show error toast
        </button>
      </div>
    </section>
  )
}

export default About
