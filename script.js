// Apartment Unit Usage Calculator
let apartments = [];

function renderApartments() {
    const list = document.getElementById('apartmentList');
    list.innerHTML = '';
    apartments.forEach((apt, idx) => {
        const row = document.createElement('div');
        row.className = 'flex gap-2 mb-2';
        row.innerHTML = `
            <input type="text" class="border rounded px-2 py-1 w-32" placeholder="Apartment" value="${apt.name || ''}" onchange="updateApartment(${idx}, 'name', this.value)">
            <input type="number" class="border rounded px-2 py-1 w-28" min="0" placeholder="Previous" value="${apt.prev || ''}" onchange="updateApartment(${idx}, 'prev', this.value)">
            <input type="number" class="border rounded px-2 py-1 w-28" min="0" placeholder="Current" value="${apt.curr || ''}" onchange="updateApartment(${idx}, 'curr', this.value)">
            <button class="bg-red-500 text-white px-2 rounded" onclick="removeApartment(${idx})">Remove</button>
        `;
        list.appendChild(row);
    });
}

function addApartment() {
    apartments.push({ name: '', prev: '', curr: '' });
    renderApartments();
}

function removeApartment(idx) {
    apartments.splice(idx, 1);
    renderApartments();
}

function updateApartment(idx, field, value) {
    apartments[idx][field] = value;
}

function resetForm() {
    apartments = [];
    document.getElementById('totalBill').value = '';
    document.getElementById('results').innerHTML = '';
    renderApartments();
}

function calculateUsage() {
    const totalBill = parseFloat(document.getElementById('totalBill').value) || 0;
    const costPerUnitInput = parseFloat(document.getElementById('costPerUnit').value);
    let totalUnits = 0;
    let unitsArr = [];
    apartments.forEach(apt => {
        const prev = parseFloat(apt.prev) || 0;
        const curr = parseFloat(apt.curr) || 0;
        const units = curr - prev > 0 ? curr - prev : 0;
        unitsArr.push(units);
        totalUnits += units;
    });
    let costPerUnit = 0;
    let billToShow = totalBill;
    if (!isNaN(costPerUnitInput) && costPerUnitInput > 0) {
        costPerUnit = costPerUnitInput;
        billToShow = costPerUnit * totalUnits;
    } else {
        costPerUnit = totalUnits > 0 ? totalBill / totalUnits : 0;
    }

    let table = `<table class="min-w-full text-sm text-left border">
        <thead class="bg-blue-100">
            <tr>
                <th class="px-2 py-1 border">Apartment</th>
                <th class="px-2 py-1 border">Previous</th>
                <th class="px-2 py-1 border">Current</th>
                <th class="px-2 py-1 border">Units Used</th>
                <th class="px-2 py-1 border">Amount to Pay (₦)</th>
            </tr>
        </thead>
        <tbody>`;
    apartments.forEach((apt, idx) => {
        const amount = (unitsArr[idx] * costPerUnit).toFixed(2);
        table += `<tr>
            <td class="px-2 py-1 border">${apt.name || 'Apartment ' + (idx+1)}</td>
            <td class="px-2 py-1 border">${apt.prev || ''}</td>
            <td class="px-2 py-1 border">${apt.curr || ''}</td>
            <td class="px-2 py-1 border">${unitsArr[idx]}</td>
            <td class="px-2 py-1 border">${amount}</td>
        </tr>`;
    });
    table += `<tr class="font-bold bg-green-100">
        <td class="px-2 py-1 border">Total</td>
        <td class="px-2 py-1 border"></td>
        <td class="px-2 py-1 border"></td>
        <td class="px-2 py-1 border">${totalUnits}</td>
        <td class="px-2 py-1 border">₦${billToShow.toLocaleString()}</td>
    </tr>`;
    table += '</tbody></table>';

    document.getElementById('results').innerHTML = table;
}

document.getElementById('addBtn').onclick = addApartment;
document.getElementById('calcBtn').onclick = calculateUsage;
document.getElementById('resetBtn').onclick = resetForm;

// Initial render
renderApartments();
