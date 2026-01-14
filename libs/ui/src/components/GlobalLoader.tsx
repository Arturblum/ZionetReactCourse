type GlobalLoaderProps = {
  message: string
}

export default function GlobalLoader({ message }: GlobalLoaderProps) {
  return <p className="muted global-loader">{message}</p>
}
