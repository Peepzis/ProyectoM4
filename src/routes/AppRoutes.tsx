import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Tasks } from '../pages/Tasks'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}