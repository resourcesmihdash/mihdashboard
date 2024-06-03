document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([42.3601, -71.0589], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('/assets/data/MIH Data Mock Up.csv')
        .then(response => response.text())
        .then(csvText => {
            const data = Papa.parse(csvText, { header: true }).data;

            data.forEach(provider => {
                const marker = L.marker([provider.lat, provider.lng]).addTo(map);
                marker.bindPopup(`
                    <b>${provider["Primary Contact Name and Title"]}</b><br>
                    ${provider.Address}<br>
                    ${provider["Phone Number"]}<br>
                    ${provider["Email Address"]}<br>
                    ${provider["Services Provided"]}<br>
                    ${provider.Funding}
                `);
            });

            document.getElementById('private-insurance-filter').addEventListener('change', () => applyFilters(data, map));
            document.getElementById('medicare-medicaid-filter').addEventListener('change', () => applyFilters(data, map));
            document.getElementById('self-referral-filter').addEventListener('change', () => applyFilters(data, map));
            document.getElementById('services-provided-filter').addEventListener('change', () => applyFilters(data, map));
        });

    function applyFilters(data, map) {
        const privateInsuranceFilter = document.getElementById('private-insurance-filter').value;
        const medicareMedicaidFilter = document.getElementById('medicare-medicaid-filter').value;
        const selfReferralFilter = document.getElementById('self-referral-filter').value;
        const servicesProvidedFilter = document.getElementById('services-provided-filter').value;

        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        data.forEach(provider => {
            const matchesPrivateInsurance = !privateInsuranceFilter || provider["Funding"].toLowerCase().includes(privateInsuranceFilter.toLowerCase());
            const matchesMedicareMedicaid = !medicareMedicaidFilter || provider["Funding"].toLowerCase().includes(medicareMedicaidFilter.toLowerCase());
            const matchesSelfReferral = !selfReferralFilter || provider["Self-Referral Allowed (yes/no)"].toLowerCase() === selfReferralFilter.toLowerCase();
            const matchesServicesProvided = !servicesProvidedFilter || provider["Services Provided"].toLowerCase().includes(servicesProvidedFilter.toLowerCase());

            if (matchesPrivateInsurance && matchesMedicareMedicaid && matchesSelfReferral && matchesServicesProvided) {
                const marker = L.marker([provider.lat, provider.lng]).addTo(map);
                marker.bindPopup(`
                    <b>${provider["Primary Contact Name and Title"]}</b><br>
                    ${provider.Address}<br>
                    ${provider["Phone Number"]}<br>
                    ${provider["Email Address"]}<br>
                    ${provider["Services Provided"]}<br>
                    ${provider.Funding}
                `);
            }
        });
    }
});