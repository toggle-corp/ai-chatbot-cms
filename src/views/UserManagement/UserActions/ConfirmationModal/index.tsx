import {
    Button,
    Modal,
} from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

interface Props {
    onClose: () => void;
    onConfirm: () => void;
    confirmationMessage: string;
    confirmationHeading: string;
}

function ConfirmationModal({
    onClose,
    onConfirm,
    confirmationHeading,
    confirmationMessage,
}: Props) {
    return (
        <Modal
            heading={confirmationHeading}
            onClose={onClose}
            size="extraSmall"
            footer={(
                <div className={styles.footerContent}>
                    <Button
                        name="cancel"
                        variant="default"
                        onClick={onClose}
                    >
                        No
                    </Button>
                    <Button
                        name="save"
                        variant="primary"
                        onClick={onConfirm}
                    >
                        Yes
                    </Button>
                </div>
            )}
        >
            {confirmationMessage}
        </Modal>
    );
}

export default ConfirmationModal;
