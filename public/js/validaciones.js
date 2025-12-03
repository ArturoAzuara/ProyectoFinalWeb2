document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const correo = form.querySelector('input[name="correo"]').value.trim();
        const password = form.querySelector('input[name="password"]').value.trim();
        const usuario = form.querySelector('input[name="usuario"]').value.trim();

        let mensaje = '';

        if(!usuario || !correo || !password) {
            mensaje = 'Todos los campos son obligatorios';
        }

        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;

        if(!correoRegex.test(correo)) {
            mensaje = 'El correo debe tener formato: usuario@dominio.com';
        }

        else if(!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            mensaje = 'Contraseña debe tener mínimo 8 caracteres, incluir una mayúscula y un número';
        }

        else if(!/^[a-zA-Z0-9]{3,20}$/.test(usuario)) {
            mensaje = 'El usuario debe tener entre 3 y 20 caracteres (solo letras y números)';
        }

        if(mensaje) {
            alert(mensaje);
            return;
        }
        form.submit();
    });
});