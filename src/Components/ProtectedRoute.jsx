import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        return <Navigate to="/login" replace />;//replace -> Ensures user can’t go back to a protected page after redirect. without replace user can go back to the previous route using back button.
    }

    // If children exist, render them; otherwise render Outlet
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
// =============When rendering a single component==============//
// <ProtectedRoute><Dashboard /></ProtectedRoute> =>	Use children
// ============When protecting multiple nested routes=================//	
// <Route element={<ProtectedRoute />}>
// <Route ... />
// <Route ... />
// </Route> =>	    Use Outlet