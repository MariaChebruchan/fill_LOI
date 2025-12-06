// Validation and modal functions

// Store pending action
let pendingAction = null;
let missingFields = [];

function checkEmptyFields() {
    const requiredFields = [
        'date',
        'ownersName', 'ownersAdress',
        'vesselName',
        'shipper', 'consignee',
        'loadPort', 'dischargePort',
        'cargoQuantity', 'cargoName', 
        'billOfLadingNumbers', 'billOfLadingDate', 'billOfLadingPlace',
        'deliveryParty', 'deliveryPartyAddress',
        'companyRequestor', 'companyRequestorAddress',
        'representativeName', 'representativePosition'
    ];
    
    const emptyFields = [];
    requiredFields.forEach(fieldId => {
        const value = getFieldValue(fieldId);
        if (!value) {
            emptyFields.push({
                id: fieldId,
                label: fieldLabels[fieldId] || fieldId
            });
        }
    });
    
    return emptyFields;
}

function showValidationModal(emptyFields, actionCallback, customMessage) {
    missingFields = emptyFields;
    pendingAction = actionCallback;
    
    const modal = document.getElementById('validationModal');
    const list = document.getElementById('missingFieldsList');
    const continueButton = document.querySelector('.btn-continue');
    const modalMessage = modal.querySelector('p');
    
    list.innerHTML = '';
    emptyFields.forEach(field => {
        const li = document.createElement('li');
        li.textContent = field.label;
        list.appendChild(li);
    });
    
    // Update modal message if custom message provided
    if (customMessage && modalMessage) {
        modalMessage.textContent = customMessage;
    } else if (modalMessage) {
        modalMessage.textContent = 'The following fields are not filled:';
    }
    
    // Show/hide "Continue Anyway" button based on whether callback is provided
    if (continueButton) {
        if (actionCallback) {
            continueButton.style.display = 'block';
        } else {
            continueButton.style.display = 'none';
        }
    }
    
    modal.style.display = 'flex';
    
    // Highlight empty fields
    emptyFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.classList.add('field-warning');
        }
    });
}

function hideValidationModal() {
    const modal = document.getElementById('validationModal');
    const modalMessage = modal.querySelector('p');
    modal.style.display = 'none';
    pendingAction = null;
    missingFields = [];
    // Reset modal message to default
    if (modalMessage) {
        modalMessage.textContent = 'The following fields are not filled:';
    }
}

function proceedWithAction() {
    const action = pendingAction; // Save action before hiding modal
    hideValidationModal();
    if (action) {
        action();
    }
}

function cancelAction() {
    hideValidationModal();
    // Warning state will remain on fields until they are filled
}

