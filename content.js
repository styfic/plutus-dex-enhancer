/*
DO NOT REMOVE, KEEP REFERENCE TO THE AUTHOR.
---
MIT License

Copyright (c) 2022 Breaking IT - Sebastian Stohr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

async function getStatements() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);
    myHeaders.append("Content-Type", "application/json");

    var raw = "{\"operationName\":\"transactions_view\",\"variables\":{\"offset\":0,\"limit\":null,\"from\":null,\"to\":null},\"query\":\"query transactions_view($offset: Int, $limit: Int, $from: timestamptz, $to: timestamptz) {\\n  transactions_view_aggregate(\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    aggregate {\\n      totalCount: count\\n      __typename\\n    }\\n    __typename\\n  }\\n  transactions_view(\\n    order_by: {date: desc}\\n    limit: $limit\\n    offset: $offset\\n    where: {_and: [{date: {_gte: $from}}, {date: {_lte: $to}}]}\\n  ) {\\n    id\\n    model\\n    user_id\\n    currency\\n    amount\\n    date\\n    type\\n    is_debit\\n    description\\n    __typename\\n  }\\n}\\n\"}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://hasura.plutus.it/v1alpha1/graphql", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.data.transactions_view; })
        .catch(err => console.warn(err));
}

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

async function getOrders() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);
    myHeaders.append("Content-Type", "application/json");

    var raw = "{\"variables\":{},\"extensions\":{},\"operationName\":null,\"query\":\"query { crypto_orders_view(\\n    order_by: {created_at: desc}\\n) {\\n    id\\n    model\\n    wallet\\n    status\\n    crypto_amount\\n    crypto_currency\\n    fiat_amount\\n    fiat_currency\\n    created_at\\n    updated_at\\n    __typename\\n  }\\n}\\n\"}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://hasura.plutus.it/v1alpha1/graphql", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.data.crypto_orders_view; })
        .catch(err => console.warn(err));
}

async function getWithdrawals() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);
    myHeaders.append("Content-Type", "application/json");

    var raw = "{\"operationName\":\"withdrawals\",\"variables\":{},\"query\":\"query withdrawals($status: enum_pluton_withdraw_requests_status) {\\n  pluton_withdraw_requests(\\n    order_by: {created_at: desc}\\n    where: {status: {_eq: $status}}\\n  ) {\\n    id\\n    address\\n    amount\\n    status\\n    payout_destination_type\\n    created_at\\n    clear_junction_transfer {\\n      amount\\n      currency\\n      __typename\\n    }\\n    card_transfer {\\n      amount\\n      currency\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch("https://hasura.plutus.it/v1alpha1/graphql", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse.data.pluton_withdraw_requests; })
        .catch(err => console.warn(err));
}

async function getTransactions() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://api.plutus.it/platform/transactions/contis", requestOptions)
        .then(response => response.json())
        .then(jsonResponse => { return jsonResponse; })
        .catch(err => console.warn(err));
}

async function getPerks() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage['id_token']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://api.plutus.it/platform/configurations/perks", requestOptions)
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


function fixStatements(json) {
    json.forEach(function(record) {
        switch (record.type) {
            case "0":
                record.type = "PENDING";
                break;
            case "5":
                record.type = "DECLINED_POS_CHARGE";
                break;
            case "29":
                record.type = "CARD_DEPOSIT";
                break;
            case "31":
                record.type = "PURCHASE";
                break;
            case "45":
                record.type = "REFUND";
                break;
        }
    });
    return json
}

function getFirstDayCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

async function checkPerks() {

    const isPerkTransaction = transaction => new Date(transaction.createdAt) >= getFirstDayCurrentMonth() && transaction.reference_type.indexOf('perk') >= 0;
    const perkTransactionsOfCurrentMonth = await getRewards().then(result => result.filter(isPerkTransaction));
    const [userPerks, perksGranted] = await getUserPerks().then(userPerks => [userPerks.perks, userPerks.total_perks_granted]);
    const isUsedPerk = (transaction, perk) => transaction.reference_type === `perk_${perk.id}_reward`;
    const usedPerks = userPerks.filter(perk => perkTransactionsOfCurrentMonth.some(transaction => isUsedPerk(transaction, perk)));
    const unusedPerks = userPerks.filter(perk => perkTransactionsOfCurrentMonth.every(transaction => !isUsedPerk(transaction, perk)));

    window.alert(`Unused perks: ${unusedPerks.map(perk => perk.label)} \nUsed perks: ${usedPerks.map(perk => perk.label)} \n${userPerks.length}/${perksGranted} perks selected`);
}

function flattenJson(json) {
    // Source: https://stackoverflow.com/a/61602592
    const flatten = (obj, roots = [], sep = '.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : {
        [roots.concat([prop]).join(sep)]: obj[prop]
    }), {})
    resultJson = []
    json.forEach(function(record) {
        var flatRecord = flatten(record);
        resultJson.push(flatRecord);
    });
    return resultJson
}

function jsonToCsv(json) {
    var fields = []
    for (let i = 0; i < json.length; i++) {
        let new_fields = Object.keys(json[i])
        new_fields.forEach(item => {
            if (fields.indexOf(item) === -1) {
                if (json[i][item] !== null) {
                    fields.push(item);
                }
            }
        });
    }

    // Source: https://stackoverflow.com/a/31536517
    var replacer = function(key, value) { return value === null ? '' : value }
    var csv = json.map(function(row) {
        return fields.map(function(fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(','))
    csv = csv.join('\r\n');
    return csv
}

function downloadCSV(csv, filename) {
    // Source: https://www.javatpoint.com/javascript-create-and-download-csv-file
    var downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    downloadLink.target = '_blank';

    downloadLink.download = filename + '.csv';
    downloadLink.click();
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    const action = msg.action;
    if (action === "statement") {
        getStatements().then(response => fixStatements(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "account_statement")).then(sendResponse({ action: "statement", status: "done" }));
    } else if (action === "rewards") {
        getRewards().then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "pluton_rewards")).then(sendResponse({ action: "rewards", status: "done" }));
    } else if (action === "orders") {
        getOrders().then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "crypto_orders")).then(sendResponse({ action: "orders", status: "done" }));
    } else if (action === "withdrawals") {
        getWithdrawals().then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "withdrawals")).then(sendResponse({ action: "withdrawals", status: "done" }));
    } else if (action === "transactions") {
        getTransactions().then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "transactions")).then(sendResponse({ action: "transactions", status: "done" }));
    } else if (action === "blockpit") {
        // Rewards Export
        getRewards().then(response => convertForBlockpit(response)).then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "blockpit_rewards")).then(sendResponse({ action: "blockpit", status: "done" }));
        // Orders Export
        getOrders().then(response => convertForBlockpit(response)).then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "blockpit_orders")).then(sendResponse({ action: "blockpit", status: "done" }));
        // Withdrawals Export
        getWithdrawals().then(response => convertForBlockpit(response)).then(response => flattenJson(response)).then(result => jsonToCsv(result)).then(csv => downloadCSV(csv, "blockpit_withdrawals")).then(sendResponse({ action: "blockpit", status: "done" }));
    } else if (action === "perks") {
        getUserPerks().then(response => checkPerks(response)).then(sendResponse({ action: "perks", status: "done" }))
    } else {
        sendResponse({ action: action, status: "done" })
    }
});