// Preview generation functions

function updatePreview() {
    const preview = document.getElementById('preview');
    
    const date = formatDate(getFieldValue('date'));
    const ownersName = getFieldValue('ownersName') || '[name of Owners]';
    const vesselName = getFieldValue('vesselName') || '[name of vessel]';
    const ownersAddress = getFieldValue('ownersAdress') || '[Owners Address]';
    
    // Get load port and discharge port
    const loadPort = getFieldValue('loadPort');
    const dischargePort = getFieldValue('dischargePort');
    
    // Generate voyage automatically
    let voyage;
    if (loadPort && dischargePort) {
        voyage = `from ${loadPort} to ${dischargePort}`;
    } else if (loadPort) {
        voyage = `from ${loadPort} to [discharge port(s) as per BL]`;
    } else if (dischargePort) {
        voyage = `from [load port(s) as per BL] to ${dischargePort}`;
    } else {
        voyage = '[load and discharge ports as stated in bill of lading]';
    }
    
    const cargo = getFieldValue('cargo') || '[description of cargo]';
    const billOfLading = getFieldValue('billOfLading') || '[identification numbers, date and place of issue]';
    const shipper = getFieldValue('shipper') || '[name of shipper]';
    const consignee = getFieldValue('consignee') || '[name of consignee or party to whose order the bill of lading is made out, as appropriate]';
    const dischargePortDisplay = dischargePort || '[name of discharge port stated in the bill of lading]';
    const requestingParty = getFieldValue('requestingParty') || '[name of party requesting delivery]';
    const deliveryParty = getFieldValue('deliveryParty') || '[name of party to whom delivery is to be made]';
    const deliveryPlace = getFieldValue('deliveryPlace') || '[place where delivery is to be made]';
    const companyRequestor = getFieldValue('companyRequestor') || '[company requestor]';
    const companyRequestorAddress = getFieldValue('companyRequestorAddress') || '[address of company requestor]';
    const representativeName = getFieldValue('representativeName') || '[name and surname of company person signing]';
    const representativePosition = getFieldValue('representativePosition') || '[position of person signing]';

    const displayDate = date || '[Date]';
    
    // Check if header should be included
    const includeHeader = document.getElementById('includeHeader')?.checked || false;
    const actualCompanyRequestor = getFieldValue('companyRequestor');
    const actualCompanyRequestorAddress = getFieldValue('companyRequestorAddress');
    
    // Build header HTML if checkbox is checked
    let headerHTML = '';
    if (includeHeader && (actualCompanyRequestor || actualCompanyRequestorAddress)) {
        headerHTML = `
        <div class="letterhead-header">
            <div class="letterhead-company">${actualCompanyRequestor || '[company requestor]'}</div>
            <div class="letterhead-address">${actualCompanyRequestorAddress || '[address of company requestor]'}</div>
        </div>
        `;
    }

    preview.innerHTML = `
        ${headerHTML}
        <h3>INT GROUP A</h3>
        <h3>STANDARD FORM LETTER OF INDEMNITY TO BE GIVEN IN RETURN FOR DELIVERING CARGO WITHOUT PRODUCTION OF THE ORIGINAL BILL OF LADING</h3>
        
        <p>${highlightPlaceholder(displayDate)}</p>
        
        <p>To : ${highlightPlaceholder(ownersName)}</p>
        <p>The Owners of the ${highlightPlaceholder(vesselName)}</p>
        <p>${highlightPlaceholder(ownersAddress)}</p>
        
        <p>Dear Sirs</p>
        
        <p>vessel: ${highlightPlaceholder(vesselName)}</p>
        <p>Voyage: ${highlightPlaceholder(voyage)}</p>
        <p>Cargo: ${highlightPlaceholder(cargo)}</p>
        <p>Bill of lading: ${highlightPlaceholder(billOfLading)}</p>
        
        <p>The above cargo was shipped on the above vessel by ${highlightPlaceholder(shipper)} and consigned to ${highlightPlaceholder(consignee)} for delivery at the port of ${highlightPlaceholder(dischargePortDisplay)} but the bill of lading has not arrived and we, ${highlightPlaceholder(requestingParty)}, hereby request you to deliver the said cargo to X ${highlightPlaceholder(deliveryParty)} or to such party as you believe to be or to represent X or to be acting on behalf of X at ${highlightPlaceholder(deliveryPlace)} without production of the original bill of lading.</p>
        
        <p>In consideration of your complying with our above request, we hereby agree as follows :-</p>
        
        <p>1. To indemnify you, your servants and agents and to hold all of you harmless in respect of any liability, loss, damage or expense of whatsoever nature which you may sustain by reason of delivering the cargo in accordance with our request.</p>
        
        <p>2. In the event of any proceedings being commenced against you or any of your servants or agents in connection with the delivery of the cargo as aforesaid, to provide you or them on demand with sufficient funds to defend the same.</p>
        
        <p>3. If, in connection with the delivery of the cargo as aforesaid, the vessel, or any other vessel or property in the same or associated ownership, management or control, should be arrested or detained or should the arrest or detention thereof be threatened, or should there be any interference in the use or trading of the vessel (whether by virtue of a caveat being entered on the vessel's registry or otherwise howsoever), to provide on demand such bail or other security as may be required to prevent such arrest or detention or to secure the release of such vessel or property or to remove such interference and to indemnify you in respect of any liability, loss, damage or expense caused by such arrest or detention or threatened arrest or detention or such interference, whether or not such arrest or detention or threatened arrest or detention or such interference may be justified.</p>
        
        <p>4. If the place at which we have asked you to make delivery is a bulk liquid or gas terminal or facility, or another vessel, lighter or barge, then delivery to such terminal, facility, vessel, lighter or barge shall be deemed to be delivery to the party to whom we have requested you to make such delivery.</p>
        
        <p>5. As soon as all original bills of lading for the above cargo shall have come into our possession, to deliver the same to you, or otherwise to cause all original bills of lading to be delivered to you, whereupon our liability hereunder shall cease.</p>
        
        <p>6. The liability of each and every person under this indemnity shall be joint and several and shall not be conditional upon your proceeding first against any person, whether or not such person is party to or liable under this indemnity.</p>
        
        <p>7. This indemnity shall be governed by and construed in accordance with English law and each and every person liable under this indemnity shall at your request submit to the jurisdiction of the High Court of Justice of England.</p>
        
        <div style="text-align: left; margin-top: 5px;">
            <p style="text-align: left; margin-top: 5px;">Yours faithfully<br>${highlightPlaceholder(companyRequestor)}<br>${highlightPlaceholder(companyRequestorAddress)}</p>
            <div class="signature-line"></div>
            <p style="text-align: left; margin-top: 5px;">${highlightPlaceholder(representativeName)}<br>${highlightPlaceholder(representativePosition)}</p>
        </div>
    `;
}

