import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashSidebar from "../Components/DashSidebar"
import DashProfile from "../Components/DashProfile"
import DashPosts from "../Components/DashPosts"
import DashUsers from "../Components/DashUsers"
import DashComments from "../Components/DashComments"
import DashComponent from "../Components/DashComponent"

import '../styles/style.scss'
import DashCars from "../Components/DashCars"

export default function Dashboard() {

  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <div className="dashboardWrapper">
      <div className="sidebar">
        <DashSidebar />
      </div>
        { tab === 'profile' && <DashProfile /> }
        { tab === 'mycars' && <DashCars /> }
        { tab === 'posts' && <DashPosts /> }
        { tab === 'users' && <DashUsers /> }
        { tab === 'comments' && <DashComments /> }
        { tab === 'dashboard' && <DashComponent /> }
    </div>
  )
}
