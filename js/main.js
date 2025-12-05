// Main initialization and event listeners

// Set today's date as default
const dateField = document.getElementById('date');
if (dateField) {
    dateField.valueAsDate = new Date();
    // Add change listener for date field
    dateField.addEventListener('change', () => {
        updatePreview();
        updatePDFButtonState();
    });
}

// Add change listener for bill of lading date field
const billOfLadingDateField = document.getElementById('billOfLadingDate');
if (billOfLadingDateField) {
    billOfLadingDateField.addEventListener('change', () => {
        updatePreview();
        updatePDFButtonState();
    });
}

// Map section IDs to their input field IDs
const sectionFields = {
    'headerDetails': ['date', 'ownersName', 'ownersAdress', 'vesselName'],
    'blDetails': ['shipper', 'consignee', 'loadPort', 'dischargePort', 'cargoQuantity', 'cargoName', 'billOfLadingNumbers', 'billOfLadingDate', 'billOfLadingPlace'],
    'deliveryDetails': ['requestingParty', 'deliveryParty', 'deliveryPlace'],
    'requestorDetails': ['companyRequestor', 'companyRequestorAddress', 'representativeName', 'representativePosition', 'includeHeader']
};

// Check if a section has any data
function hasSectionData(sectionId) {
    const fieldsToCheck = sectionFields[sectionId];
    if (!fieldsToCheck) return false;

    return fieldsToCheck.some(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return false;
        
        if (field.type === 'checkbox') {
            return field.checked;
        } else {
            return field.value.trim() !== '';
        }
    });
}

// Update clear button states for all sections
function updateClearButtonStates() {
    Object.keys(sectionFields).forEach(sectionId => {
        const button = document.querySelector(`button[onclick="clearSection('${sectionId}')"]`);
        if (button) {
            const hasData = hasSectionData(sectionId);
            button.disabled = !hasData;
        }
    });
}

// Get all input fields
const inputs = document.querySelectorAll('input, textarea');

// Update preview on any input change and remove warning state
inputs.forEach(input => {
    input.addEventListener('input', () => {
        updatePreview();
        updateClearButtonStates();
        updateUpdateButtonStates();
        updatePDFButtonState();
        updateLetterheadCheckboxState();
        // Remove warning state when field is filled
        if (input.value.trim()) {
            input.classList.remove('field-warning');
        }
    });
});

// Update preview on checkbox change
const includeHeaderCheckbox = document.getElementById('includeHeader');
if (includeHeaderCheckbox) {
    includeHeaderCheckbox.addEventListener('change', () => {
        updatePreview();
        updateClearButtonStates();
    });
}

// Toggle preview visibility
const togglePreviewCheckbox = document.getElementById('togglePreview');
if (togglePreviewCheckbox) {
    togglePreviewCheckbox.addEventListener('change', () => {
        const previewSection = document.querySelector('.preview-section');
        if (previewSection) {
            if (togglePreviewCheckbox.checked) {
                previewSection.style.display = 'block';
            } else {
                previewSection.style.display = 'none';
            }
        }
    });
}

// Initial preview update and button state update
updatePreview();
updateClearButtonStates();
updateUpdateButtonStates();
updatePDFButtonState();
updateLetterheadCheckboxState();

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('validationModal');
    if (e.target === modal) {
        cancelAction();
    }
});

// Clear all inputs in a specific section
function clearSection(sectionId) {
    const fieldsToClear = sectionFields[sectionId];
    if (!fieldsToClear) return;

    fieldsToClear.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = false;
            } else {
                field.value = '';
            }
            // Remove field classes
            field.classList.remove('field-warning');
            // Trigger input event to update preview
            field.dispatchEvent(new Event('input'));
        }
    });

    // Update preview after clearing
    updatePreview();
    // Update button states after clearing
    updateClearButtonStates();
    updateUpdateButtonStates();
    updatePDFButtonState();
    updateLetterheadCheckboxState();
}

// Update PDF button state based on field completion
function updatePDFButtonState() {
    const btnPDF = document.getElementById('btnDownloadPDF');
    if (!btnPDF) return;
    
    // Check if all input fields (excluding checkboxes) are filled
    const emptyFields = checkEmptyInputFields();
    btnPDF.disabled = emptyFields.length > 0;
    
    // Add tooltip when disabled
    if (btnPDF.disabled) {
        btnPDF.title = 'Please fill all input fields to be able to download pdf document';
    } else {
        btnPDF.title = '';
    }
}

// Update letterhead checkbox state
function updateLetterheadCheckboxState() {
    const companyRequestor = document.getElementById('companyRequestor');
    const companyRequestorAddress = document.getElementById('companyRequestorAddress');
    const includeHeaderCheckbox = document.getElementById('includeHeader');
    
    if (includeHeaderCheckbox && companyRequestor && companyRequestorAddress) {
        const hasCompanyData = companyRequestor.value.trim() !== '' && companyRequestorAddress.value.trim() !== '';
        
        // Disable checkbox if company name or address is empty
        includeHeaderCheckbox.disabled = !hasCompanyData;
        
        // Uncheck checkbox if it's checked but fields are empty
        if (!hasCompanyData && includeHeaderCheckbox.checked) {
            includeHeaderCheckbox.checked = false;
            updatePreview();
        }
    }
}

// Update button states for update buttons
function updateUpdateButtonStates() {
    // Check if requestor fields are filled (for sub-Charterers button)
    const requestorName = document.getElementById('companyRequestor');
    const requestorAddress = document.getElementById('companyRequestorAddress');
    const btnSubCharterers = document.getElementById('btnUpdateSubCharterers');
    
    if (btnSubCharterers && requestorName && requestorAddress) {
        const hasRequestorData = requestorName.value.trim() !== '' && requestorAddress.value.trim() !== '';
        btnSubCharterers.disabled = !hasRequestorData;
    }
    
    // Check if Owners fields are filled (for Head Owners button)
    const ownersName = document.getElementById('ownersName');
    const ownersAddress = document.getElementById('ownersAdress');
    const btnHeadOwners = document.getElementById('btnUpdateHeadOwners');
    
    if (btnHeadOwners && ownersName && ownersAddress) {
        const hasOwnersData = ownersName.value.trim() !== '' && ownersAddress.value.trim() !== '';
        btnHeadOwners.disabled = !hasOwnersData;
    }
}

// Update for sub-Charterers: cut from requestor to Owners
function updateForSubCharterers() {
    const requestorName = document.getElementById('companyRequestor');
    const requestorAddress = document.getElementById('companyRequestorAddress');
    const ownersName = document.getElementById('ownersName');
    const ownersAddress = document.getElementById('ownersAdress');
    
    if (requestorName && requestorAddress && ownersName && ownersAddress) {
        // Cut name and address from requestor to Owners
        ownersName.value = requestorName.value;
        ownersAddress.value = requestorAddress.value;
        
        // Clear source fields (cut operation)
        requestorName.value = '';
        requestorAddress.value = '';
        
        // Trigger input event to update preview
        ownersName.dispatchEvent(new Event('input'));
        ownersAddress.dispatchEvent(new Event('input'));
        requestorName.dispatchEvent(new Event('input'));
        requestorAddress.dispatchEvent(new Event('input'));
        
        // Update button states
        updateUpdateButtonStates();
        updateLetterheadCheckboxState();
    }
}

// Update for Head Owners: cut from Owners to requestor
function updateForHeadOwners() {
    const ownersName = document.getElementById('ownersName');
    const ownersAddress = document.getElementById('ownersAdress');
    const requestorName = document.getElementById('companyRequestor');
    const requestorAddress = document.getElementById('companyRequestorAddress');
    
    if (ownersName && ownersAddress && requestorName && requestorAddress) {
        // Cut name and address from Owners to requestor
        requestorName.value = ownersName.value;
        requestorAddress.value = ownersAddress.value;
        
        // Clear source fields (cut operation)
        ownersName.value = '';
        ownersAddress.value = '';
        
        // Trigger input event to update preview
        requestorName.dispatchEvent(new Event('input'));
        requestorAddress.dispatchEvent(new Event('input'));
        ownersName.dispatchEvent(new Event('input'));
        ownersAddress.dispatchEvent(new Event('input'));
        
        // Update button states
        updateUpdateButtonStates();
        updateLetterheadCheckboxState();
    }
}

