import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    IoCaretDownSharp,
    IoCaretUpOutline,
} from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';
import {
    Button,
    ButtonProps,
    Popup,
    useBlurEffect,
} from '@togglecorp/toggle-ui';

import DropdownMenuContext, { DropdownMenuContextProps } from '#contexts/DropdownMenuContext';

import styles from './styles.module.css';

 interface Props {
    className?: string;
    popupClassName?: string;
    children?: React.ReactNode;
    label?: React.ReactNode;
    activeClassName?: string;
    icons?: React.ReactNode;
    variant?: ButtonProps<undefined>['variant'];
    actions?: React.ReactNode;
    withoutDropdownIcon?: boolean;
    componentRef?: React.MutableRefObject<{
        setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    } | null>;
    elementRef?: React.RefObject<HTMLButtonElement>;
    persistent?: boolean;
}

function DropdownMenu(props: Props) {
    const newButtonRef = useRef<HTMLButtonElement>(null);
    const {
        className,
        popupClassName,
        children,
        label,
        activeClassName,
        icons,
        variant = 'default',
        actions,
        withoutDropdownIcon,
        componentRef,
        persistent,
        elementRef: buttonRef = newButtonRef,
    } = props;

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (componentRef) {
            componentRef.current = {
                setShowDropdown,
            };
        }
    }, [componentRef, setShowDropdown]);

    const handleMenuClick: NonNullable<ButtonProps<undefined>['onClick']> = useCallback(
        () => {
            setShowDropdown((prevValue) => !prevValue);
        },
        [setShowDropdown],
    );
    const handleBlurCallback = useCallback(
        (isClickedWithin: boolean, e: MouseEvent) => {
            if (e.target instanceof HTMLElement && dropdownRef.current?.contains(e.target)) {
                return;
            }

            if (isClickedWithin && persistent) {
                return;
            }

            setShowDropdown(false);
        },
        [setShowDropdown, persistent],
    );

    useBlurEffect(
        showDropdown,
        handleBlurCallback,
        dropdownRef,
        buttonRef,
    );

    const contextValue = useMemo<DropdownMenuContextProps>(
        () => ({
            setShowDropdown,
        }),
        [setShowDropdown],
    );

    const hasActions = !!actions || !withoutDropdownIcon;

    return (
        <DropdownMenuContext.Provider value={contextValue}>
            <Button
                name={undefined}
                className={_cs(
                    styles.dropdownMenu,
                    showDropdown && activeClassName,
                    className,
                )}
                transparent
                elementRef={buttonRef}
                onClick={handleMenuClick}
                variant={variant}
                childrenContainerClassName={styles.content}
                actions={hasActions ? (
                    <>
                        {actions}
                        {!withoutDropdownIcon && (showDropdown
                            ? <IoCaretUpOutline className={styles.dropdownIcon} />
                            : <IoCaretDownSharp className={styles.dropdownIcon} />
                        )}
                    </>
                ) : undefined}
                icons={icons}
            >
                {label}
            </Button>
            {showDropdown && (
                <Popup
                    elementRef={dropdownRef}
                    className={_cs(styles.dropdownContent, popupClassName)}
                    parentRef={buttonRef}
                >
                    {children}
                </Popup>
            )}
        </DropdownMenuContext.Provider>
    );
}

export default DropdownMenu;
