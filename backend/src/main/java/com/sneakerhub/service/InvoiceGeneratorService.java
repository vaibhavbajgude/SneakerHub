package com.sneakerhub.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.sneakerhub.dto.response.OrderItemResponse;
import com.sneakerhub.dto.response.OrderResponse;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

/**
 * Service for generating PDF invoices
 */
@Service
public class InvoiceGeneratorService {

    public byte[] generateInvoice(OrderResponse order) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);

            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);

            // 1. Header (Logo & Company Name)
            Paragraph companyName = new Paragraph("SNEAKERHUB", titleFont);
            companyName.setAlignment(Element.ALIGN_CENTER);
            companyName.setSpacingAfter(20);
            document.add(companyName);

            // 2. Order Details & Customer Info Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[] { 1, 1 });

            // Order Info
            PdfPCell orderInfoCell = new PdfPCell();
            orderInfoCell.setBorder(Rectangle.NO_BORDER);
            orderInfoCell.addElement(new Paragraph("INVOICE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
            orderInfoCell.addElement(new Paragraph("Order #: " + order.getOrderNumber(), bodyFont));
            orderInfoCell.addElement(new Paragraph(
                    "Date: " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), bodyFont));
            orderInfoCell.addElement(new Paragraph("Status: " + order.getStatus(), bodyFont));
            orderInfoCell.addElement(new Paragraph("Payment Method: Razorpay", bodyFont));
            infoTable.addCell(orderInfoCell);

            // Customer Info
            PdfPCell customerInfoCell = new PdfPCell();
            customerInfoCell.setBorder(Rectangle.NO_BORDER);
            customerInfoCell.addElement(new Paragraph("BILL TO:", headerFont));
            customerInfoCell.addElement(new Paragraph(order.getShippingName(), bodyFont));
            customerInfoCell.addElement(new Paragraph(order.getShippingAddressLine1(), bodyFont));
            if (order.getShippingAddressLine2() != null && !order.getShippingAddressLine2().isEmpty()) {
                customerInfoCell.addElement(new Paragraph(order.getShippingAddressLine2(), bodyFont));
            }
            customerInfoCell.addElement(new Paragraph(
                    order.getShippingCity() + ", " + order.getShippingState() + " " + order.getShippingPostalCode(),
                    bodyFont));
            customerInfoCell.addElement(new Paragraph(order.getShippingCountry(), bodyFont));
            customerInfoCell.addElement(new Paragraph("Phone: " + order.getShippingPhone(), bodyFont));
            infoTable.addCell(customerInfoCell);

            document.add(infoTable);
            document.add(new Paragraph("\n"));

            // 3. Items Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 4, 1, 1, 2, 2 });
            table.setSpacingBefore(10);

            // Table Headers
            String[] headers = { "Item", "Size", "Qty", "Price", "Total" };
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);
                cell.setBackgroundColor(new Color(240, 240, 240));
                table.addCell(cell);
            }

            // Table Rows
            for (OrderItemResponse item : order.getItems()) {
                // Item Name & Brand
                PdfPCell nameCell = new PdfPCell();
                nameCell.setPadding(8);
                nameCell.addElement(new Paragraph(item.getSneakerBrand() + " " + item.getSneakerName(), bodyFont));
                nameCell.addElement(new Paragraph("Color: " + item.getColorVariant(), smallFont));
                table.addCell(nameCell);

                // Size
                PdfPCell sizeCell = new PdfPCell(new Paragraph(item.getSize(), bodyFont));
                sizeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                sizeCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                sizeCell.setPadding(8);
                table.addCell(sizeCell);

                // Quantity
                PdfPCell qtyCell = new PdfPCell(new Paragraph(String.valueOf(item.getQuantity()), bodyFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                qtyCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                qtyCell.setPadding(8);
                table.addCell(qtyCell);

                // Price
                PdfPCell priceCell = new PdfPCell(new Paragraph("₹" + item.getPrice(), bodyFont));
                priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                priceCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                priceCell.setPadding(8);
                table.addCell(priceCell);

                // Total
                BigDecimal lineTotal = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
                PdfPCell totalCell = new PdfPCell(new Paragraph("₹" + lineTotal, bodyFont));
                totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                totalCell.setPadding(8);
                table.addCell(totalCell);
            }

            document.add(table);

            // 4. Totals
            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(100);
            totalsTable.setWidths(new float[] { 4, 1 });
            totalsTable.setSpacingBefore(5);

            addTotalRow(totalsTable, "Subtotal:", "₹" + order.getSubtotal(), bodyFont);
            addTotalRow(totalsTable, "Tax (18%):", "₹" + order.getTax(), bodyFont);
            addTotalRow(totalsTable, "Shipping:", "₹" + order.getShippingFee(), bodyFont);
            addTotalRow(totalsTable, "Total Amount:", "₹" + order.getTotalAmount(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));

            document.add(totalsTable);

            // 5. Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Thank you for shopping with SneakerHub!", headerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, font));
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPaddingRight(10);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value, font));
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPaddingRight(8); // Match table padding
        table.addCell(valueCell);
    }
}
