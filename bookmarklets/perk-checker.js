javascript:(function()%7Basync%20function%20getRewards()%7Bvar%20e%3Dnew%20Headers%3Breturn%20e.append(%22Authorization%22%2C%22Bearer%20%22%2BlocalStorage.id_token)%2Cawait%20fetch(%22https%3A%2F%2Fapi.plutus.it%2Fplatform%2Ftransactions%2Fpluton%22%2C%7Bmethod%3A%22GET%22%2Cheaders%3Ae%2Credirect%3A%22follow%22%7D).then(e%3D%3Ee.json()).then(e%3D%3Ee).catch(e%3D%3Econsole.warn(e))%7Dasync%20function%20getUserPerks()%7Bvar%20e%3Dnew%20Headers%3Breturn%20e.append(%22Authorization%22%2C%22Bearer%20%22%2BlocalStorage.id_token)%2Cawait%20fetch(%22https%3A%2F%2Fapi.plutus.it%2Fplatform%2Fperks%22%2C%7Bmethod%3A%22GET%22%2Cheaders%3Ae%2Credirect%3A%22follow%22%7D).then(e%3D%3Ee.json()).then(e%3D%3Ee).catch(e%3D%3Econsole.warn(e))%7Dfunction%20getFirstDayCurrentMonth()%7Blet%20e%3Dnew%20Date%3Breturn%20new%20Date(e.getFullYear()%2Ce.getMonth()%2C1)%7Dfunction%20checkPerks(e)%7Blet%20t%3D%5B%5D%2Cr%3De.perks%2Cn%3D%5B%5D%2Ca%3D%5B%5D%3BgetRewards().then(e%3D%3E(e.forEach(e%3D%3E%7Bnew%20Date(e.createdAt)%3E%3DgetFirstDayCurrentMonth()%26%26e.reference_type.indexOf(%22perk%22)%3E%3D0%26%26t.push(e)%7D)%2Ct)).then(e%3D%3E%7Br.forEach(t%3D%3E%7Be.forEach(e%3D%3E%7Be.reference_type.indexOf(%60perk_%24%7Bt.id%7D_reward%60)%3E%3D0%26%26n.push(t.label)%7D)%7D)%2Cconsole.log(%22used%20perks%3A%20%22%2Bn)%2Cr.forEach(e%3D%3E%7B-1%3D%3D%3Dn.indexOf(e.label)%26%26a.push(e.label)%7D)%2Cconsole.log(%22unused%20perks%3A%20%22%2Ba)%2Calert(%22unused%20perks%3A%20%22%2Ba)%7D)%7DgetUserPerks().then(e%3D%3EcheckPerks(e))%3B%7D)()%3B