import {
    useCallback,
    useContext,
} from 'react';
import {
    Link,
    LinkProps,
} from 'react-router-dom';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    ConfirmButton,
    ConfirmButtonProps,
} from '@togglecorp/toggle-ui';

import DropdownMenuContext from '#contexts/DropdownMenuContext';

import styles from './styles.module.css';

type CommonProps = {
    persist?: boolean;
};

type CustomButtonProps<NAME extends string | number | undefined> = CommonProps & {
    name?: string;
    onClick?: (name: NAME, e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    type: 'button';
};

type LinkTypeProps = CommonProps & LinkProps & {
    type: 'link';
};

type ConfirmButtonTypeProps<NAME extends string | number | undefined> = CommonProps &
    Omit<ConfirmButtonProps<NAME>, 'type'> & {
        type: 'confirm-button';
    };

type Props<N extends string | number | undefined> =
    | CustomButtonProps<N>
    | LinkTypeProps
    | ConfirmButtonTypeProps<N>;

function DropdownMenuItem<NAME extends string | number | undefined>(props: Props<NAME>) {
    const {
        type,
        onClick,
        persist = false,
    } = props;
    const { setShowDropdown } = useContext(DropdownMenuContext);

    const handleLinkClick = useCallback(
        () => {
            if (!persist) {
                setShowDropdown(false);
            }
        },
        [setShowDropdown, persist],
    );

    const handleButtonClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            setShowDropdown(false);
            if (!persist) {
                setShowDropdown(false);
            }
            if (isDefined(onClick) && type === 'button') {
                onClick((props as CustomButtonProps<NAME>).name as NAME, e);
            }
        },
        [setShowDropdown, onClick, type, props, persist],
    );

    const handleConfirmButtonClick = useCallback(
        (name: NAME, e: React.MouseEvent<HTMLButtonElement>) => {
            setShowDropdown(false);
            if (!persist) {
                setShowDropdown(false);
            }
            if (isDefined(onClick) && type === 'confirm-button') {
                onClick(name, e);
            }
        },
        [setShowDropdown, onClick, type, persist],
    );

    if (type === 'link') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            persist: __,
            ...otherProps
        } = props;

        return (
            <Link
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                onClick={handleLinkClick}
                className={_cs(styles.link, otherProps.className)}
            />
        );
    }

    if (type === 'button') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            persist: __,
            ...otherProps
        } = props as CustomButtonProps<NAME>;

        return (
            <button
                type="button"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                onClick={handleButtonClick}
                className={_cs(styles.menuItem, otherProps.className)}
            >
                {otherProps.children}
            </button>
        );
    }

    if (type === 'confirm-button') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            persist: __,
            ...otherProps
        } = props as ConfirmButtonTypeProps<NAME>;

        return (
            <ConfirmButton
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                onConfirm={handleConfirmButtonClick}
            />
        );
    }
}

export default DropdownMenuItem;
