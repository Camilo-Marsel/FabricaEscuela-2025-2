package com.FabricaEscuela.Feature1Back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.name}")
    private String fromName;

    /**
     * Envía el código de verificación por email
     */
    public void enviarCodigoVerificacion(String destinatario, String codigo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromName + " <" + fromEmail + ">");
            message.setTo(destinatario);
            message.setSubject("Código de verificación - FleetGuard360");
            message.setText(construirMensajeCodigo(codigo));

            mailSender.send(message);
            System.out.println("✅ Email enviado a: " + destinatario);

        } catch (Exception e) {
            System.err.println("❌ Error al enviar email: " + e.getMessage());
            throw new RuntimeException("No se pudo enviar el email de verificación", e);
        }
    }

    /**
     * Construye el mensaje del email
     */
    private String construirMensajeCodigo(String codigo) {
        return String.format("""
            Hola,
            
            Tu código de verificación para FleetGuard360 es:
            
            %s
            
            Este código expirará en 5 minutos.
            
            Si no solicitaste este código, ignora este mensaje.
            
            Saludos,
            Equipo FleetGuard360
            """, codigo);
    }
}