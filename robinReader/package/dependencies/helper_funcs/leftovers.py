from .tradeListFunctions import getTradeDictUpdate
from datetime import datetime

def get_leftovers_list(contract_dict: dict):
    leftover_list = []
    for item in contract_dict:
        dict_object: dict = contract_dict[item]

        # get rid of trades in the list that only captured the sells.
        # the buys were before the beginning date of the report
        if dict_object['currentQuantity'] < 0:
            continue

        dict_object.update({
            "cons": dict_object['currentQuantity']
        })

        description = item
        buyDate = dict_object['sellDate']
        trade = getTradeDictUpdate(dict_object, description, buyDate)
        
        # change sell date to blank since these positions are actually still open. 
        # theyre only initialized with a sell date because the csv report goes backward in time,
        # therefore sells come first and we can initialize the contract item in the dictionary
        # with a sell date of the process date from that first transaction found.
        trade.update({
            "sellDate": '',
            "sellDateDayOfWeek": '',
            "averageSell": '',
            "totalSell": '',
            "pctChange": '',
            "daysHeld": '',
            "letExpire": '',
            "net": ''
        })

        leftover_list.append(trade)
    
    # sort newest to oldest
    sorted_list = sorted(leftover_list, key=lambda x: datetime.strptime(x['buyDate'], '%m/%d/%Y'), reverse=True)
    return sorted_list