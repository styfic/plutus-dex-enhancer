javascript:(function()%7Basync%20function%20getWithdrawals()%7Bvar%20t%3Dnew%20Headers%3Breturn%20t.append(%22Authorization%22%2C%22Bearer%20%22%2BlocalStorage.id_token)%2Ct.append(%22Content-Type%22%2C%22application%2Fjson%22)%2Cawait%20fetch(%22https%3A%2F%2Fhasura.plutus.it%2Fv1alpha1%2Fgraphql%22%2C%7Bmethod%3A%22POST%22%2Cheaders%3At%2Cbody%3A'%7B%22operationName%22%3A%22withdrawals%22%2C%22variables%22%3A%7B%7D%2C%22query%22%3A%22query%20withdrawals(%24status%3A%20enum_pluton_withdraw_requests_status)%20%7B%5C%5Cn%20%20pluton_withdraw_requests(%5C%5Cn%20%20%20%20order_by%3A%20%7Bcreated_at%3A%20desc%7D%5C%5Cn%20%20%20%20where%3A%20%7Bstatus%3A%20%7B_eq%3A%20%24status%7D%7D%5C%5Cn%20%20)%20%7B%5C%5Cn%20%20%20%20id%5C%5Cn%20%20%20%20address%5C%5Cn%20%20%20%20amount%5C%5Cn%20%20%20%20status%5C%5Cn%20%20%20%20payout_destination_type%5C%5Cn%20%20%20%20created_at%5C%5Cn%20%20%20%20clear_junction_transfer%20%7B%5C%5Cn%20%20%20%20%20%20amount%5C%5Cn%20%20%20%20%20%20currency%5C%5Cn%20%20%20%20%20%20__typename%5C%5Cn%20%20%20%20%7D%5C%5Cn%20%20%20%20card_transfer%20%7B%5C%5Cn%20%20%20%20%20%20amount%5C%5Cn%20%20%20%20%20%20currency%5C%5Cn%20%20%20%20%20%20__typename%5C%5Cn%20%20%20%20%7D%5C%5Cn%20%20%20%20__typename%5C%5Cn%20%20%7D%5C%5Cn%7D%5C%5Cn%22%7D'%2Credirect%3A%22follow%22%7D).then(t%3D%3Et.json()).then(t%3D%3Et.data.pluton_withdraw_requests).catch(t%3D%3Econsole.warn(t))%7Dfunction%20fixStatements(t)%7Breturn%20t.forEach(function(t)%7Bswitch(t.type)%7Bcase%220%22%3At.type%3D%22PENDING%22%3Bbreak%3Bcase%225%22%3At.type%3D%22DECLINED_POS_CHARGE%22%3Bbreak%3Bcase%2229%22%3At.type%3D%22CARD_DEPOSIT%22%3Bbreak%3Bcase%2231%22%3At.type%3D%22PURCHASE%22%3Bbreak%3Bcase%2245%22%3At.type%3D%22REFUND%22%7D%7D)%2Ct%7Dfunction%20flattenJson(t)%7Blet%20n%3D(t%2Ce%3D%5B%5D%2Ca%3D%22.%22)%3D%3EObject.keys(t).reduce((r%2Co)%3D%3EObject.assign(%7B%7D%2Cr%2C%22%5Bobject%20Object%5D%22%3D%3D%3DObject.prototype.toString.call(t%5Bo%5D)%3Fn(t%5Bo%5D%2Ce.concat(%5Bo%5D)%2Ca)%3A%7B%5Be.concat(%5Bo%5D).join(a)%5D%3At%5Bo%5D%7D)%2C%7B%7D)%3Breturn%20resultJson%3D%5B%5D%2Ct.forEach(function(t)%7Bvar%20e%3Dn(t)%3BresultJson.push(e)%7D)%2CresultJson%7Dfunction%20jsonToCsv(t)%7Bvar%20n%3D%5B%5D%3Bfor(let%20e%3D0%3Be%3Ct.length%3Be%2B%2B)Object.keys(t%5Be%5D).forEach(a%3D%3E%7B-1%3D%3D%3Dn.indexOf(a)%26%26null!%3D%3Dt%5Be%5D%5Ba%5D%26%26n.push(a)%7D)%3Bvar%20a%3Dfunction(t%2Cn)%7Breturn%20null%3D%3D%3Dn%3F%22%22%3An%7D%2Cr%3Dt.map(function(t)%7Breturn%20n.map(function(n)%7Breturn%20JSON.stringify(t%5Bn%5D%2Ca)%7D).join(%22%2C%22)%7D)%3Breturn%20r.unshift(n.join(%22%2C%22))%2Cr%3Dr.join(%22%5Cr%5Cn%22)%7Dfunction%20downloadCSV(t%2Cn)%7Bvar%20e%3Ddocument.createElement(%22a%22)%3Be.href%3D%22data%3Atext%2Fcsv%3Bcharset%3Dutf-8%2C%22%2BencodeURI(t)%2Ce.target%3D%22_blank%22%2Ce.download%3Dn%2B%22.csv%22%2Ce.click()%7DgetWithdrawals().then(t%3D%3EflattenJson(t)).then(t%3D%3EjsonToCsv(t)).then(t%3D%3EdownloadCSV(t%2C%22withdrawals%22))%3B%7D)()%3B