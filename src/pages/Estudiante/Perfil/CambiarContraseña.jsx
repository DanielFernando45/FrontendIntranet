import React, { useEffect, useState } from 'react'
import LayoutApp from '../../../layout/LayoutApp'

const CambiarContraseña = () => {
    const [userId, setUserId] = useState(null);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cliente = localStorage.getItem('user');
        if (cliente) {
            const user = JSON.parse(cliente);
            setUserId(user.id);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Las contraseñas nuevas no coinciden');
            return;
        }
        
        if (passwords.oldPassword === passwords.newPassword) {
            alert('La nueva contraseña no puede ser igual a la anterior');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_PORT_ENV}/auth/change-password/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al cambiar la contraseña');
            }

            alert('¡Contraseña cambiada exitosamente!');
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        } catch (error) {
            alert(error.message || 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutApp>
            <main className="m-32 flex justify-center">
                <form onSubmit={handleSubmit} className='flex flex-col items-center w-[493px] h-[515px] bg-white rounded-2xl px-6 py-[39px] gap-9 sombra'>
                    <h1 className='text-xl font-medium'>CAMBIAR LA CONTRASEÑA</h1>
                    <div className='flex flex-col gap-5'>
                        <div className='flex justify-between'>
                            <label htmlFor="oldPassword" className='py-4 w-[163px]'>Contraseña Actual</label>
                            <input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                value={passwords.oldPassword}
                                onChange={handleChange}
                                className='p-4 w-[231px] h-full rounded-lg border-black border'
                                required
                            />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="newPassword" className='py-4 w-[163px]'>Nueva Contraseña</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                className='p-4 w-[231px] h-full rounded-lg border-black border'
                                required
                            />
                        </div>
                        <div className='flex justify-between py-4 h-[94px] items-center'>
                            <label htmlFor="confirmPassword" className='py-4 w-[163px]'>Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                className='p-4 w-[231px] h-full rounded-lg border-black border'
                                required
                            />
                        </div>                  
                    </div>
                    <div className='flex w-full h-[65px] justify-between'>
                        <button 
                            type="button" 
                            className='text-[20px] w-[180px] flex justify-center items-center p-4 rounded-lg border border-black'
                            onClick={() => setPasswords({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            })}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className='text-[20px] w-[180px] flex justify-center items-center fondo_login text-white p-4 rounded-lg'
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Cambiar'}
                        </button>   
                    </div>
                </form>
            </main>
        </LayoutApp>
    )
}

export default CambiarContraseña