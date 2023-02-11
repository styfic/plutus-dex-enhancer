async function getRewards() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };


    return await fetch("https://api.plutus.it/platform/transactions/pluton", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse; })
        .catch(err => console.warn(err));
}

async function getUserPerks() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://api.plutus.it/platform/perks", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse; })
        .catch(err => console.warn(err));
}

function getFirstDayCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

async function checkPerks() {

    const perkTransactionsOfCurrentMonth = await getRewards().then(result => result.filter(transaction => new Date(transaction.createdAt) >= getFirstDayCurrentMonth() && transaction.reference_type.indexOf('perk') >= 0));
    const userPerks = await getUserPerks().then(userPerks => userPerks.perks);
    const usedPerks = userPerks.filter(perk => perkTransactionsOfCurrentMonth.some(transaction => transaction.reference_type === `perk_${perk.id}_reward`));
    const unusedPerks = userPerks.filter(perk => perkTransactionsOfCurrentMonth.every(transaction => transaction.reference_type !== `perk_${perk.id}_reward`));

    window.alert('Unused perks: ' + unusedPerks.map(perk => perk.label) + '\nUsed perks: ' + usedPerks.map(perk => perk.label));
}

checkPerks();