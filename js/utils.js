// Utility functions

function getFieldValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function highlightPlaceholder(text) {
    if (!text) return text;
    
    // Replace all placeholder patterns [text] with highlighted spans
    return text.replace(/\[([^\]]+)\]/g, '<span class="field-placeholder">[$1]</span>');
}

function sanitizeFilename(str) {
    return str.replace(/[<>:"/\\|?*]/g, '').trim();
}

// Field labels mapping for display
const fieldLabels = {
    'date': 'Date',
    'ownersName': 'Name of Owners',
    'ownersAdress': 'Address of the Owners',
    'vesselName': 'Name of vessel',
    'shipper': 'Name of shipper',
    'consignee': 'Name of Consignee',
    'loadPort': 'Load Port as per BL',
    'dischargePort': 'Discharge Port as per BL',
    'cargo': 'Cargo Description',
    'billOfLading': 'Bill of Lading',
    'requestingParty': 'Name of Party Requesting Delivery',
    'deliveryParty': 'Name of Party to Whom Delivery is to be Made',
    'deliveryPlace': 'Place Where Delivery is to be Made',
    'companyRequestor': 'Company Requestor',
    'companyRequestorAddress': 'Address of Company Requestor',
    'representativeName': 'Name and Surname of Company Representative Signing',
    'representativePosition': 'Position of Representative of Company'
};

