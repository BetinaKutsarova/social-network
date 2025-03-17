import React from 'react';
import { Button } from '../../components/ui/button';
import { useLogout } from '../../hooks/useLogout';

export const Dashboard: React.FC = () => {
    const { logout } = useLogout();


    return (
        <>
            Hallo
            <Button onClick={logout}>
                Logout
            </Button>
        </>
    )
}