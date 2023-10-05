import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from 'stores';
import { pages } from 'utilities/constants';

type ProtectedRouteProps = {
    redirectPath?: string;
};

function ProtectedRoute({
    redirectPath = pages.explore.path,
}: ProtectedRouteProps) {
    const { isLoggedIn } = useSelector((root: RootState) => root.user);

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

export default ProtectedRoute;
