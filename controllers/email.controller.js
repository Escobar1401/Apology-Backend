/* Controlador de correo electrónico
En este archivo se definen las operaciones de correo electrónico.
Este código sirve para que el usuario pueda iniciar sesión, verificar si un correo existe,
solicitar recuperación de contraseña, validar el token de recuperación y restablecer la contraseña.
*/

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (req, res) => {
    try {
        const { to, subject, html } = req.body;

        // Configurar el transporter de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Configurar el correo electrónico
        const mailOptions = {
            from: `"Apology" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: 'success',
            message: 'Correo electrónico enviado correctamente'
        });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al enviar el correo electrónico',
            error: error.message
        });
    }
};
