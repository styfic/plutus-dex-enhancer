function blockpitDate(string) {
    let date = new Date(string);
    let dd = ('0' + date.getDate()).slice(-2);
    let mm = ('0' + (date.getMonth() + 1)).slice(-2);
    let yyyy = date.getFullYear();
    let hh = ('0' + date.getHours()).slice(-2);
    let min = ('0' + date.getMinutes()).slice(-2);
    let ss = ('0' + date.getSeconds()).slice(-2);
    let blockpitDate = `${dd}.${mm}.${yyyy} ${hh}:${min}:${ss}`
    return blockpitDate;
}

function convertForBlockpit(arr) {
    return arr.reduce(
        (transactions, transaction, index) => {
            const row = getBlockpitTemplate(transaction, index)
            if (typeof row !== 'undefined') transactions.push(row)
            return transactions
        }, []
    )
}

function getBlockpitTemplate(element, index) {

    // Case Rewards
    if (typeof element.reason !== 'undefined' && element.reason !== "Rejected by admin" && element.available === true) {
        let template = {
            id: index,
            exchange_name: 'Plutus DEX',
            depot_name: 'Plutus',
            transaction_date: blockpitDate(element.updatedAt),
            buy_asset: 'PLU',
            buy_amount: element.amount,
            sell_asset: '',
            sell_amount: '',
            fee_asset: '',
            fee_amount: '',
            transaction_type: 'bounty',
            note: `${element.contis_transaction ? element.contis_transaction.description : ''} ${element.reason || ''}`,
            linked_transaction: ''
        }
        return template
    }

    // Case Withdrawal to Card
    else if (element.payout_destination_type === "plutus_card" && element.status === "COMPLETED") {
        let template = {
            id: index,
            exchange_name: 'Plutus DEX',
            depot_name: 'Plutus',
            transaction_date: blockpitDate(element.created_at),
            buy_asset: 'EUR',
            buy_amount: element.card_transfer.amount,
            sell_asset: 'PLU',
            sell_amount: element.amount,
            fee_asset: '',
            fee_amount: '',
            transaction_type: 'trade',
            note: element.payout_destination_type,
            linked_transaction: ''
        }
        return template
    }

    // Case Withdrawal to Wallet
    else if (element.payout_destination_type === "crypto_wallet" && element.status === "COMPLETED") {
        let template = {
            id: index,
            exchange_name: 'Plutus DEX',
            depot_name: 'Plutus',
            transaction_date: blockpitDate(element.created_at),
            buy_asset: '',
            buy_amount: '',
            sell_asset: 'PLU',
            sell_amount: element.amount,
            fee_asset: '',
            fee_amount: '',
            transaction_type: 'withdrawal',
            note: element.payout_destination_type,
            linked_transaction: ''
        }
        return template
    }

    // Case Buy order
    else if (element.__typename === "crypto_orders_view" && element.model === "BuyOrder" && element.status === "FULFILLED") {
        let template = {
            id: index,
            exchange_name: 'Plutus DEX',
            depot_name: 'Plutus',
            transaction_date: blockpitDate(element.created_at),
            buy_asset: 'PLU',
            buy_amount: element.crypto_amount,
            sell_asset: 'EUR',
            sell_amount: element.fiat_amount,
            fee_asset: '',
            fee_amount: '',
            transaction_type: 'trade',
            note: '',
            linked_transaction: ''
        }
        return template
    }

}