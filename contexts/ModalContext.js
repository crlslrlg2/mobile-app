import React, { createContext, useContext, useState, useMemo } from 'react';

// Define the context
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

// Provider Component
export const ModalProvider = ({ children }) => {
    const [modalTitle, setModalTitle] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = (title, content) => {
        setModalTitle(title)
        setModalContent(content);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalTitle('');
        setModalVisible(false);
        setModalContent(null);
    };

    const value = useMemo(() => ({
        modalVisible,
        modalContent,
        showModal,
        hideModal,
        modalTitle
    }), [modalVisible, modalContent, modalTitle]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};
