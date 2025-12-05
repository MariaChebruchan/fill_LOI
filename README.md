# Letter of Indemnity Generator

A web application that helps generate standard form Letters of Indemnity (LOI) for cargo release without production of Bills of Lading (BLs). This tool simplifies the process of creating legally compliant LOI documents by providing an intuitive form-based interface.

## Description

This application generates **INT GROUP A Standard Form Letters of Indemnity** that are used in maritime shipping when cargo needs to be delivered without the original Bill of Lading being presented. The tool ensures all required information is collected and formatted correctly according to industry standards.

### Key Features

- **Form-Based Input**: Organized sections for all required information:
  - Header Details (Date, Owners, Vessel)
  - Bill of Lading Details (Shipper, Consignee, Ports, Cargo Quantity & Name, BL Numbers)
  - Delivery Details (Requesting Party, Delivery Party, Delivery Place)
  - Requestor Details (Company, Address, Representative)

- **Real-Time Preview**: See the generated LOI document as you fill in the form

- **Export Options**:
  - Download as PDF (requires all fields to be filled)
  - Download as DOC (Word document format)
  - Copy text to clipboard

- **Validation**: Ensures all required fields are completed before PDF generation

- **Letterhead Support**: Optional company letterhead inclusion in the document

- **Quick Actions**: 
  - Update fields for sub-Charterers
  - Update fields for Head Owners
  - Clear individual sections

## Usage

1. Fill in all required fields in the form sections
2. Review the preview on the right side
3. Click "Download .PDF" to generate and download the PDF document (all fields must be filled)
4. Alternatively, use "Download .DOC" or "Copy Text" options

## Technology

- Pure HTML, CSS, and JavaScript
- Uses html2pdf.js for PDF generation
- No backend required - runs entirely in the browser

## Developer

Developed by Dmytro Chebruchan

Contact: [chebruchan2707@gmail.com](mailto:chebruchan2707@gmail.com)
