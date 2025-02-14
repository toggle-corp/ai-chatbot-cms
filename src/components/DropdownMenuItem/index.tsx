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

type CommonProp = {
    persist?: boolean;
    children?: React.ReactNode;
}

type CustomButtonProps<NAME extends string | number | undefined> = {
    name?: string | undefined;
    onClick?: (name: NAME, e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    type: 'button';
    persist?: boolean;
}

type LinkTypeProps = LinkProps & {
    type: 'link';
}

type ConfirmButtonTypeProps<NAME extends string | number | undefined> = Omit<ConfirmButtonProps<NAME>, 'type'> & {
    type: 'confirm-button',
}

type Props<N extends string | number | undefined> = CommonProp & (
    CustomButtonProps<N> | LinkTypeProps | ConfirmButtonTypeProps<N>);

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
        (name: NAME, e: React.MouseEvent<HTMLButtonElement>) => {
            if (!persist) {
                setShowDropdown(false);
            }
            if (isDefined(onClick) && type !== 'link') {
                onClick(name, e);
            }
        },
        [setShowDropdown, type, onClick, persist],
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
                onClick={(e) => handleButtonClick(otherProps.name as NAME, e)}
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
        } = props;

        return (
            <ConfirmButton
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                onClick={handleButtonClick}
            />
        );
    }
}

export default DropdownMenuItem;
