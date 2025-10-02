// utils/withAuth.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // Client-side only
      const uid = Cookies.get('uid') || sessionStorage.getItem('id')
      const role = Cookies.get('role') || sessionStorage.getItem('role')

      if (!uid || role !== 'user') {
        router.replace('/login')
      } else {
        setLoading(false) // user is authenticated
      }
    }, [])

    // Show nothing while checking auth
    if (loading) return null

    return <WrappedComponent {...props} />
  }
}

export default withAuth
