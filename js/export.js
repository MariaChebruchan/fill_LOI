// Export functions (PDF, DOC, Copy)

function downloadPDF() {
    const emptyFields = checkEmptyInputFields();
    
    if (emptyFields.length > 0) {
        // Show validation modal with empty fields - no callback means download is blocked
        showValidationModal(emptyFields, null, 'PDF download requires all fields to be filled.');
        return;
    }
    
    executeDownloadPDF();
}

// Check empty input fields (excluding checkboxes)
function checkEmptyInputFields() {
    const requiredFields = [
        'date', 'ownersName', 'ownersAdress', 'vesselName', 'shipper',
        'consignee', 'loadPort', 'dischargePort', 'cargoQuantity', 'cargoName', 'billOfLadingNumbers', 'billOfLadingDate', 'billOfLadingPlace',
        'deliveryParty', 'deliveryPartyAddress', 'companyRequestor',
        'companyRequestorAddress', 'representativeName', 'representativePosition'
    ];
    
    const emptyFields = [];
    requiredFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            // Skip checkboxes - only check inputs and textareas
            if (element.type !== 'checkbox') {
                const value = getFieldValue(fieldId);
                if (!value) {
                    emptyFields.push({
                        id: fieldId,
                        label: fieldLabels[fieldId] || fieldId
                    });
                }
            }
        }
    });
    
    return emptyFields;
}

function executeDownloadPDF() {
    const element = document.getElementById('preview');
    
    if (!element) {
        console.error('Preview element not found');
        alert('Error: Preview element not found. Please refresh the page and try again.');
        return;
    }
    
    // Ensure preview is visible and updated
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        previewSection.style.display = 'block';
    }
    
    // Ensure preview content is updated
    updatePreview();
    
    // Get vessel name and company requestor for filename
    const vesselName = getFieldValue('vesselName') || 'vessel-NAME';
    const companyRequestor = getFieldValue('companyRequestor') || 'company';
    
    const sanitizedVesselName = sanitizeFilename(vesselName);
    const sanitizedCompany = sanitizeFilename(companyRequestor);
    
    // Generate filename: mv [vessel-NAME] - LOI for cargo delivery - requestor {name of company}.pdf
    const filename = `mv ${sanitizedVesselName} - LOI for cargo delivery - requestor ${sanitizedCompany}.pdf`;
    
    // Check if header should be included
    const includeHeader = document.getElementById('includeHeader')?.checked || false;
    const companyRequestorName = getFieldValue('companyRequestor') || '';
    const companyRequestorAddress = getFieldValue('companyRequestorAddress') || '';
    
    // Store original styles
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    
    // Ensure element is visible for PDF generation
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    element.style.display = 'block';
    element.style.visibility = 'visible';
    
    // Create wrapper element for PDF generation
    let elementToConvert = element;
    let wrapperCreated = false;
    
    if (includeHeader && companyRequestorName) {
        // Create a wrapper with header
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
        wrapper.style.width = '210mm';
        wrapper.style.padding = '15mm';
        wrapper.style.fontFamily = "'Times New Roman', serif";
        wrapper.style.backgroundColor = 'white';
        wrapper.style.visibility = 'visible';
        wrapper.style.display = 'block';
        
        // Create header div
        const headerDiv = document.createElement('div');
        headerDiv.style.textAlign = 'center';
        headerDiv.style.marginBottom = '15mm';
        headerDiv.style.paddingBottom = '5mm';
        headerDiv.style.borderBottom = '1px solid #ddd';
        
        const companyNameDiv = document.createElement('div');
        companyNameDiv.style.fontSize = '10pt';
        companyNameDiv.style.fontWeight = 'bold';
        companyNameDiv.style.marginBottom = '3mm';
        companyNameDiv.textContent = companyRequestorName;
        
        const addressDiv = document.createElement('div');
        addressDiv.style.fontSize = '8pt';
        addressDiv.style.color = '#666';
        addressDiv.style.lineHeight = '1.4';
        if (companyRequestorAddress) {
            addressDiv.textContent = companyRequestorAddress;
        }
        
        headerDiv.appendChild(companyNameDiv);
        if (companyRequestorAddress) {
            headerDiv.appendChild(addressDiv);
        }
        
        // Clone the preview content with all styles
        const clonedContent = element.cloneNode(true);
        clonedContent.style.margin = '0';
        clonedContent.style.padding = '0';
        clonedContent.style.maxHeight = 'none';
        clonedContent.style.overflow = 'visible';
        clonedContent.style.display = 'block';
        clonedContent.style.visibility = 'visible';
        clonedContent.style.width = '100%';
        
        wrapper.appendChild(headerDiv);
        wrapper.appendChild(clonedContent);
        document.body.appendChild(wrapper);
        
        elementToConvert = wrapper;
        wrapperCreated = true;
    }
    
    // Wait a bit to ensure content is rendered
    setTimeout(() => {
        const opt = {
            margin: [15, 15, 15, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: elementToConvert.scrollWidth,
                windowHeight: elementToConvert.scrollHeight,
                allowTaint: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                avoid: ['h3', 'p']
            }
        };

        html2pdf()
            .set(opt)
            .from(elementToConvert)
            .save()
            .then(() => {
                // Restore original styles
                element.style.maxHeight = originalMaxHeight;
                element.style.overflow = originalOverflow;
                element.style.display = originalDisplay;
                element.style.visibility = originalVisibility;
                
                // Remove wrapper if created
                if (wrapperCreated && elementToConvert.parentNode) {
                    elementToConvert.parentNode.removeChild(elementToConvert);
                }
            })
            .catch((error) => {
                console.error('PDF generation error:', error);
                alert('Error generating PDF: ' + error.message);
                
                // Restore original styles even on error
                element.style.maxHeight = originalMaxHeight;
                element.style.overflow = originalOverflow;
                element.style.display = originalDisplay;
                element.style.visibility = originalVisibility;
                
                // Remove wrapper if created
                if (wrapperCreated && elementToConvert.parentNode) {
                    elementToConvert.parentNode.removeChild(elementToConvert);
                }
            });
    }, 100);
}

function downloadDOC() {
    const emptyFields = checkEmptyFields();
    
    if (emptyFields.length > 0) {
        showValidationModal(emptyFields, () => {
            executeDownloadDOC();
        });
        return;
    }
    
    executeDownloadDOC();
}

function executeDownloadDOC() {
    const preview = document.getElementById('preview');
    const content = preview.innerHTML;
    
    // Get vessel name and company requestor for filename
    const vesselName = getFieldValue('vesselName') || 'vessel-NAME';
    const companyRequestor = getFieldValue('companyRequestor') || 'company';
    
    const sanitizedVesselName = sanitizeFilename(vesselName);
    const sanitizedCompany = sanitizeFilename(companyRequestor);
    
    // Generate filename: mv [vessel-NAME] - LOI for cargo delivery - requestor {name of company}.doc
    const filename = `mv ${sanitizedVesselName} - LOI for cargo delivery - requestor ${sanitizedCompany}.doc`;
    
    // Create HTML content for Word document
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 40px;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            text-align: center;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 15px 0 10px 0;
            text-align: center;
        }
        p {
            margin-bottom: 12px;
            text-align: justify;
        }
        .signature-line {
            margin-top: 40px;
            border-top: 1px solid #000;
            width: 300px;
            margin-left: auto;
            margin-right: 0;
            padding-top: 5px;
        }
        .field-placeholder {
            background-color: #fff3cd;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: 600;
            color: #856404;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyText() {
    const emptyFields = checkEmptyFields();
    
    if (emptyFields.length > 0) {
        showValidationModal(emptyFields, () => {
            executeCopyText();
        });
        return;
    }
    
    executeCopyText();
}

function executeCopyText() {
    const preview = document.getElementById('preview');
    const textContent = preview.innerText || preview.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(textContent).then(() => {
        // Show feedback to user
        const button = document.querySelector('.btn-copy');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try again.');
    });
}

