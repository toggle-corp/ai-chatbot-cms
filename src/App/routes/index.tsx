import { Navigate } from 'react-router-dom';

import { unwrapRoute } from '#utils/routes';

import Auth from './Auth';
import {
    customWrapRoute,
    rootLayout,
} from './common';

const homeLayout = customWrapRoute({
    parent: rootLayout,
    path: '/',
    forwardPath: 'content-management',
    component: {
        render: () => import('#views/Home'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Home',
        visibility: 'is-authenticated',
    },
});

const homeIndex = customWrapRoute({
    parent: homeLayout,
    index: true,
    component: {
        eagerLoad: true,
        render: Navigate,
        props: {
            to: 'dashboard',
            replace: true,
        },
    },
    context: {
        title: 'Home',
        visibility: 'anything',
    },
});

const dashboard = customWrapRoute({
    parent: homeLayout,
    path: 'dashboard',
    component: {
        render: () => import('#views/Dashboard'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Dashboard',
        visibility: 'anything',
    },
});

const contentManagement = customWrapRoute({
    parent: homeLayout,
    path: 'content-management',
    component: {
        render: () => import('#views/ContentManagement'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Content Management',
        visibility: 'anything',
    },
});

const userManagement = customWrapRoute({
    parent: homeLayout,
    path: 'user-management',
    component: {
        render: () => import('#views/UserManagement'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'User Management',
        visibility: 'anything',
    },
});

const login = customWrapRoute({
    parent: rootLayout,
    path: 'login',
    component: {
        render: () => import('#views/Login'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Login',
        visibility: 'is-not-authenticated',
    },
});
const editProfile = customWrapRoute({
    parent: homeLayout,
    path: 'edit-profile',
    component: {
        render: () => import('#views/EditProfile'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Edit Profile',
        visibility: 'anything',
    },
});

const userActivation = customWrapRoute({
    parent: rootLayout,
    path: 'user-activation/:userId/:token',
    component: {
        render: () => import('#views/UserActivation'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Activation',
        visibility: 'anything',
    },
});

const forgotPassword = customWrapRoute({
    parent: rootLayout,
    path: 'forgot-password',
    component: {
        render: () => import('#views/ForgotPassword'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Forgot Password',
        visibility: 'is-not-authenticated',
    },
});
const forgotPasswordConfirm = customWrapRoute({
    parent: rootLayout,
    path: 'user-password-reset/:userId/:resetToken',
    component: {
        render: () => import('#views/ForgotPasswordConfirm'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Forgot Password Confirm',
        visibility: 'is-not-authenticated',
    },
});
const resetPasswordRedirect = customWrapRoute({
    parent: rootLayout,
    path: 'user-password-reset/:userId/:resetToken/redirect',
    component: {
        render: () => import('../redirects/ResetPasswordRedirect'),
        props: {},
    },
    wrapperComponent: Auth,
    context: {
        title: 'Reset Password Redirect',
        visibility: 'is-not-authenticated',
    },
});

const wrappedRoutes = {
    rootLayout,
    homeLayout,
    homeIndex,
    dashboard,
    contentManagement,
    userManagement,
    login,
    userActivation,
    editProfile,
    forgotPassword,
    forgotPasswordConfirm,
    resetPasswordRedirect,
};

export const unwrappedRoutes = unwrapRoute(Object.values(wrappedRoutes));

export default wrappedRoutes;

export type WrappedRoutes = typeof wrappedRoutes;
