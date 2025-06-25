export default function validarCambioContraseña(req, res, next) {
    const { contraseñaActual, nuevaContraseña } = req.body;
    if (!contraseñaActual || !nuevaContraseña) {
        return res.status(400).json({ mensaje: 'Debes ingresar la contraseña actual y la nueva contraseña.' });
    }

    const requirements = {
        length: nuevaContraseña.length >= 8,
        lowercase: /[a-z]/.test(nuevaContraseña),
        uppercase: /[A-Z]/.test(nuevaContraseña),
        number: /\d/.test(nuevaContraseña),
        special: /[@$!%*?&]/.test(nuevaContraseña)
    };

    const missingRequirements = [];
    if (!requirements.length) missingRequirements.push('al menos 8 caracteres');
    if (!requirements.lowercase) missingRequirements.push('una letra minúscula');
    if (!requirements.uppercase) missingRequirements.push('una letra mayúscula');
    if (!requirements.number) missingRequirements.push('un número');
    if (!requirements.special) missingRequirements.push('un carácter especial (@$!%*?&)');

    if (missingRequirements.length > 0) {
        return res.status(400).json({
            mensaje: '‼️ La nueva contraseña no cumple con los requisitos mínimos. Debe contener ' + missingRequirements.join(', '),
        });
    }

    next();
}