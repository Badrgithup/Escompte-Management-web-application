const effects = [];

document.getElementById("addEffectForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const valNominale = parseFloat(document.getElementById("valNominale").value);
    const tauxEscompte = parseFloat(document.getElementById("tauxEscompte").value) / 100;
    const dateEchea = new Date(document.getElementById("dateEchea").value);
    const njB = parseInt(document.getElementById("njB").value);
    const tauxEndoss = parseFloat(document.getElementById("tauxEndoss").value) / 100;

    // Place and Domicile Selection
    const plac = parseInt(document.getElementById("plac").value);
    const dom = parseInt(document.getElementById("dom").value);
    const montantPlace = parseFloat(document.getElementById("montantPlace").value);
    const montantDomicilie = parseFloat(document.getElementById("montantDomicilie").value);

    const dateToday = new Date();
    const daysDifference = Math.floor((dateEchea - dateToday) / (1000 * 60 * 60 * 24));

    const AgjE = (valNominale * tauxEscompte * daysDifference) / 36000;
    const AgjB = (valNominale * tauxEscompte * njB) / 36000;
    const AgE1 = AgjB + AgjE;
    const njCE = daysDifference + njB;
    const AgCe = (valNominale * tauxEndoss * njCE) / 36000;
    const AgE2 = AgCe + AgE1;

    // Calculating AgCd based on Place and Domicile
    let agCd = 0;
    if (plac === 0) {
        agCd += montantPlace;
    } else if (plac === 1) {
        agCd += montantPlace * 1.5; // Example multiplier for Placed
    }

    if (dom === 0) {
        agCd += montantDomicilie;
    } else if (dom === 1) {
        agCd += montantDomicilie * 1.2; // Example multiplier for Domiciled
    }

    const totAGht = agCd + AgE2;
    const tva = agCd * 0.2; // Example VAT rate (20%)
    const totAGTTC = totAGht + tva;
    const netEscompte = valNominale - totAGTTC;

    const effect = {
        valNominale,
        dateEchea,
        daysDifference,
        AgjE,
        njB,
        AgjB,
        AgE1,
        njCE,
        AgCe,
        AgE2,
        agCd,
        totAGht,
        tva,
        totAGTTC,
        netEscompte,
    };

    effects.push(effect);
    updateEffectsTable();
    updateSummary();

    // Clear form fields
    document.getElementById("addEffectForm").reset();
});

function updateEffectsTable() {
    const tableBody = document.getElementById("effectsTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    effects.forEach((effect) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = effect.valNominale.toFixed(2);
        row.insertCell(1).textContent = formatDate(effect.dateEchea);
        row.insertCell(2).textContent = effect.daysDifference;
        row.insertCell(3).textContent = effect.AgjE.toFixed(2);
        row.insertCell(4).textContent = effect.njB;
        row.insertCell(5).textContent = effect.AgjB.toFixed(2);
        row.insertCell(6).textContent = effect.AgE1.toFixed(2);
        row.insertCell(7).textContent = effect.njCE;
        row.insertCell(8).textContent = effect.AgCe.toFixed(2);
        row.insertCell(9).textContent = effect.AgE2.toFixed(2);
        row.insertCell(10).textContent = effect.agCd.toFixed(2);
        row.insertCell(11).textContent = effect.totAGht.toFixed(2);
        row.insertCell(12).textContent = effect.tva.toFixed(2);
        row.insertCell(13).textContent = effect.totAGTTC.toFixed(2);
        row.insertCell(14).textContent = effect.netEscompte.toFixed(2);
    });
}

function updateSummary() {
    let totalValNominale = 0,
        totalNjE = 0,
        totalAgjE = 0,
        totalNjB = 0,
        totalAgjB = 0,
        totalAgE1 = 0;
    let totalNjCE = 0,
        totalAgCe = 0,
        totalAgE2 = 0,
        totalAgCd = 0,
        totalTotAGht = 0,
        totalTva = 0;
    let totalTotAGTTC = 0,
        totalNetEscompte = 0;

    effects.forEach((effect) => {
        totalValNominale += effect.valNominale;
        totalNjE += effect.daysDifference;
        totalAgjE += effect.AgjE;
        totalNjB += effect.njB;
        totalAgjB += effect.AgjB;
        totalAgE1 += effect.AgE1;
        totalNjCE += effect.njCE;
        totalAgCe += effect.AgCe;
        totalAgE2 += effect.AgE2;
        totalAgCd += effect.agCd;
        totalTotAGht += effect.totAGht;
        totalTva += effect.tva;
        totalTotAGTTC += effect.totAGTTC;
        totalNetEscompte += effect.netEscompte;
    });

    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `
        <h3>Summary</h3>
        <p>Val Nominale Total: ${totalValNominale.toFixed(2)}</p>
        <p>NjE Total: ${totalNjE}</p>
        <p>AgjE Total: ${totalAgjE.toFixed(2)}</p>
        <p>NjB Total: ${totalNjB}</p>
        <p>AgjB Total: ${totalAgjB.toFixed(2)}</p>
        <p>AgE1 Total: ${totalAgE1.toFixed(2)}</p>
        <p>NjCE Total: ${totalNjCE}</p>
        <p>AgCe Total: ${totalAgCe.toFixed(2)}</p>
        <p>AgE2 Total: ${totalAgE2.toFixed(2)}</p>
        <p>AgCd Total: ${totalAgCd.toFixed(2)}</p>
        <p>TotAGht Total: ${totalTotAGht.toFixed(2)}</p>
        <p>TVA Total: ${totalTva.toFixed(2)}</p>
        <p>TotAGTTC Total: ${totalTotAGTTC.toFixed(2)}</p>
        <p>Net Escompte Total: ${totalNetEscompte.toFixed(2)}</p>
    `;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
