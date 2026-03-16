package com.sneakerhub.service;

import com.sneakerhub.model.Order;
import com.sneakerhub.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@sneakerhub.com}")
    private String fromEmail;

    @Value("${app.admin.email:admin@sneakerhub.com}")
    private String adminEmail;

    // ─────────────────────────────────────────────────────────────────────────
    // Existing methods (unchanged)
    // ─────────────────────────────────────────────────────────────────────────

    @Async
    public void sendOrderConfirmationEmail(Order order) {
        String subject = "Order Confirmed - " + order.getOrderNumber();
        String content = "<h1>Order Confirmed</h1>" +
                "<p>Hi " + order.getUser().getFirstName() + ",</p>" +
                "<p>Your order " + order.getOrderNumber() + " has been confirmed.</p>" +
                "<p>Total Amount: $" + order.getTotalAmount() + "</p>" +
                "<p>Thank you for shopping with us!</p>";

        sendEmail(order.getUser().getEmail(), subject, content);
    }

    @Async
    public void sendOrderDeliveredEmail(Order order) {
        String subject = "Order Delivered - " + order.getOrderNumber();
        String content = "<h1>Order Delivered</h1>" +
                "<p>Hi " + order.getUser().getFirstName() + ",</p>" +
                "<p>Your order " + order.getOrderNumber() + " has been delivered.</p>" +
                "<p>Enjoy your purchase!</p>";

        sendEmail(order.getUser().getEmail(), subject, content);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // New post-payment notification methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Send order confirmation email to the customer after successful payment.
     */
    @Async
    public void sendUserOrderConfirmationEmail(String userEmail, Order order) {
        try {
            String subject = "Your SneakerHub Order is Confirmed 🎉";

            StringBuilder itemRows = new StringBuilder();
            for (OrderItem item : order.getOrderItems()) {
                itemRows.append(String.format(
                        "<tr><td style='padding:6px 12px;border-bottom:1px solid #eee;'>%s</td>" +
                                "<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center;'>%s</td>" +
                                "<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center;'>%d</td></tr>",
                        item.getSneakerName(), item.getSize(), item.getQuantity()));
            }

            String content = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;'>" +
                    "<h2 style='color:#111;'>Hi " + order.getUser().getFirstName()
                    + ", your order is confirmed! 🎉</h2>" +
                    "<p>Thank you for shopping at <strong>SneakerHub</strong>. " +
                    "Your payment was successful and your order is being processed.</p>" +
                    "<hr style='border:none;border-top:1px solid #eee;'/>" +
                    "<p><strong>Order ID:</strong> " + order.getOrderNumber() + "</p>" +
                    "<h3 style='color:#333;'>Items Ordered</h3>" +
                    "<table style='width:100%;border-collapse:collapse;'>" +
                    "<thead><tr style='background:#f5f5f5;'>" +
                    "<th style='padding:8px 12px;text-align:left;'>Product</th>" +
                    "<th style='padding:8px 12px;text-align:center;'>Size</th>" +
                    "<th style='padding:8px 12px;text-align:center;'>Qty</th>" +
                    "</tr></thead><tbody>" + itemRows.toString() + "</tbody></table>" +
                    "<hr style='border:none;border-top:1px solid #eee;margin-top:16px;'/>" +
                    "<p><strong>Total Amount:</strong> ₹" + order.getTotalAmount() + "</p>" +
                    "<p><strong>Payment Status:</strong> <span style='color:green;'>PAID</span></p>" +
                    "<br/><p>Thank you for choosing SneakerHub. We hope you love your new pair!</p>" +
                    "<p style='color:#888;font-size:12px;'>— The SneakerHub Team</p>" +
                    "</div>";

            sendEmail(userEmail, subject, content);
        } catch (Exception e) {
            logger.error("Failed to construct user confirmation email for order {}: {}",
                    order.getOrderNumber(), e.getMessage());
        }
    }

    /**
     * Send new order alert email to the admin after successful payment.
     */
    @Async
    public void sendAdminNewOrderNotification(Order order) {
        try {
            String subject = "New Order Received on SneakerHub";
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
            String orderTime = order.getCreatedAt() != null
                    ? order.getCreatedAt().format(formatter)
                    : "N/A";

            String content = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;'>" +
                    "<h2 style='color:#111;'>New Order Received 🛒</h2>" +
                    "<p>A new order has been successfully placed and paid on SneakerHub.</p>" +
                    "<hr style='border:none;border-top:1px solid #eee;'/>" +
                    "<p><strong>Order ID:</strong> " + order.getOrderNumber() + "</p>" +
                    "<p><strong>Customer Name:</strong> " + order.getUser().getFirstName() + " "
                    + order.getUser().getLastName() + "</p>" +
                    "<p><strong>Customer Email:</strong> " + order.getUser().getEmail() + "</p>" +
                    "<p><strong>Total Amount:</strong> ₹" + order.getTotalAmount() + "</p>" +
                    "<p><strong>Number of Items:</strong> " + order.getTotalItems() + "</p>" +
                    "<p><strong>Order Status:</strong> " + order.getStatus() + "</p>" +
                    "<p><strong>Time of Order:</strong> " + orderTime + "</p>" +
                    "<hr style='border:none;border-top:1px solid #eee;'/>" +
                    "<p style='color:#888;font-size:12px;'>— SneakerHub Automated Notification</p>" +
                    "</div>";

            sendEmail(adminEmail, subject, content);
        } catch (Exception e) {
            logger.error("Failed to construct admin notification email for order {}: {}",
                    order.getOrderNumber(), e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helper
    // ─────────────────────────────────────────────────────────────────────────

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error sending email to {}: {}", to, e.getMessage());
        }
    }
}
