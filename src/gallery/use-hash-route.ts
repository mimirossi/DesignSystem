import * as React from "react"

function readRoute() {
  return window.location.hash.replace(/^#\/?/, "").split("#")[0]
}

/** Minimal hash router: `#/button` → "button", empty for the home page. */
export function useHashRoute() {
  const [route, setRoute] = React.useState(readRoute)

  React.useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  return route
}
