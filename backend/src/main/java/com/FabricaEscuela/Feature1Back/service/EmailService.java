package com.FabricaEscuela.Feature1Back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoVerificacion(String destinatario, String codigo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("FleetGuard360 - Código de Verificación");
        mensaje.setText(
                "¡Hola!\n\n" +
                        "Tu código de verificación para iniciar sesión en FleetGuard360 es:\n\n" +
                        codigo + "\n\n" +
                        "Este código es válido por 5 minutos.\n\n" +
                        "Si no solicitaste este código, ignora este mensaje.\n\n" +
                        "Saludos,\n" +
                        "Equipo FleetGuard360"
        );

        try {
            mailSender.send(mensaje);
            System.out.println("✅ Email enviado a: " + destinatario + " con código: " + codigo);
        } catch (Exception e) {
            System.err.println("❌ Error al enviar email: " + e.getMessage());
            // En desarrollo, puedes mostrar el código en consola
            System.out.println("📧 CÓDIGO DE VERIFICACIÓN (consola): " + codigo);
        }
    }
}