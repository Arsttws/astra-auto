import React from "react"
import { useSelector } from "react-redux"

import '../styles/style.scss'

interface Props {
    children?: React.ReactNode
}

export default function ThemeProvider({children}: Props) {
    const { theme } = useSelector((state: any) => state.theme)
  return (
    <div className={theme}>
        <div className="colorProvider">
        {children}
        </div>
    </div>
  )
}
