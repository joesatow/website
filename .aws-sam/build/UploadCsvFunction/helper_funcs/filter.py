def filterData(list):
    filteredAccountActivityList = [x for x in list if not determine(x)]
    return filteredAccountActivityList

# function for use in filtering accountActivityList.
# get rid of anything that isnt BTO or STC or OEXP
def determine(str):
    transactionCode = str['Trans Code']
    if transactionCode != 'BTO' and transactionCode != 'STC' and transactionCode != 'OEXP':
        return True

