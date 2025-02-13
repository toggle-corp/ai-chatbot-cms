import {
    useContext,
    useMemo,
} from 'react';
import {
    generatePath,
    matchPath,
    NavLink,
    useLocation,
} from 'react-router-dom';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';

import RouteContext from '#contexts/route';

import { WrappedRoutes } from '../../App/routes';

import styles from './styles.module.css';

interface Props {
    to: keyof WrappedRoutes;
    children?: React.ReactNode;
    title?: string;
    className?: string;
    parentRoute?: boolean;
    icon?: React.ReactNode;
}

function resolvePath(
    to: keyof WrappedRoutes,
    routes: WrappedRoutes,
    // NOTE: Might need later
    // urlParams: UrlParams | undefined,
) {
    const route = routes[to];
    try {
        const resolvedPath = generatePath(route.absoluteForwardPath);
        return {
            ...route,
            resolvedPath,
        };
    } catch (ex) {
        return {
            ...route,
            resolvedPath: undefined,
        };
    }
}

function NavigationTab(props: Props) {
    const {
        to,
        children,
        title,
        className,
        parentRoute = false,
        icon,
    } = props;

    const location = useLocation();
    const routes = useContext(RouteContext);

    const route = resolvePath(to, routes);

    const isActive = useMemo(
        () => {
            if (isNotDefined(to)) {
                return false;
            }

            const match = matchPath(
                {
                    // eslint-disable-next-line react/destructuring-assignment
                    path: routes[to].absolutePath,
                    end: !parentRoute,
                },
                location.pathname,
            );

            if (isNotDefined(match)) {
                return false;
            }

            return true;
        },
        [to, routes, location.pathname, parentRoute],
    );

    if (isNotDefined(route.resolvedPath)) {
        return (
            <div className={_cs(className, styles.navigationButton, styles.disabled)}>
                {icon}
                {children}
            </div>
        );
    }

    return (
        <NavLink
            to={route.resolvedPath}
            title={title}
            className={_cs(className, styles.navigationButton, isActive && styles.active)}
        >
            {icon}
            {children}
        </NavLink>
    );
}

export default NavigationTab;
