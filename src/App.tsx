import { Elements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from 'components/header/Header';
import Layout from 'components/layout/Layout';
import ContactUs from 'pages/contact-us/ContactUs';
import Explore from 'pages/explore/Explore';
import List from 'pages/list/List';
import NotFound from 'pages/not-found/NotFound';
import PackageDetails from 'pages/package-details';
import PaymentResult from 'pages/payment-result';
import Profile from 'pages/profile/Profile';
import { MOBILE_MAX_WIDTH, pages, stripePromise } from 'utilities/constants';
import { useWindowWidth } from 'utilities/hooks';
import { setMobile } from 'stores/platform';

function App() {
    const dispatch = useDispatch();
    const windowWidth = useWindowWidth();
    dispatch(setMobile(windowWidth <= MOBILE_MAX_WIDTH));

    return (
        <>
            <Header />
            <Layout>
                <Routes>
                    <Route
                        path={pages.explore.path}
                        element={<Navigate to={pages.explore.alias!} replace />}
                    />
                    <Route path={pages.explore.alias} element={<Explore />} />
                    <Route path={pages.packages.path}>
                        <Route path=":packageId" element={<PackageDetails />} />
                        <Route path="" element={<List />} />
                    </Route>
                    <Route path={pages.profile.path} element={<Profile />} />
                    <Route
                        path={pages.contactUs.path}
                        element={<ContactUs />}
                    />
                    <Route
                        path={pages.paymentResult.path}
                        element={
                            <Elements stripe={stripePromise}>
                                <PaymentResult />
                            </Elements>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </>
    );
}

export default App;
