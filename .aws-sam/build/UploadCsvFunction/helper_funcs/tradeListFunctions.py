from .dataFunctions import getAverages
import datetime

def getTradeDictUpdate(currentContract, description, lineBuyDate):
    averageBuy, averageSell, pctChange = getAverages(currentContract).values() # get averages of final trade info
    
    buyDate = lineBuyDate
    sellDate = currentContract['sellDate']

    buyDateObject = getDateObject(buyDate)
    sellDateObject = getDateObject(sellDate)

    buyDateDayOfWeek = buyDateObject.strftime('%A')
    sellDateDayOfWeek = sellDateObject.strftime('%A')
    daysHeld = (sellDateObject - buyDateObject).days
    
    cons = currentContract['cons']
    ticker = currentContract['ticker']
    net = currentContract['net']

    letExpire = "Yes" if currentContract['letExpire'] else "No"

    return {
        "ticker": ticker,
        "contractDescription": description,
        "contracts": cons,
        "averageBuy": averageBuy,
        "totalBuy": averageBuy * cons * 100,
        "averageSell": averageSell,
        "totalSell": averageSell * cons * 100,
        "pctChange": pctChange,
        "net": net,
        "buyDate": buyDate,
        "buyDateDayOfWeek": buyDateDayOfWeek,
        "sellDate": sellDate,
        "sellDateDayOfWeek": sellDateDayOfWeek,
        "daysHeld": daysHeld,
        "letExpire": letExpire
    }

def getDateObject(date):
    dateSplit = date.split('/')
    dateDay, dateMonth, dateYear = int(dateSplit[1]), int(dateSplit[0]), int(dateSplit[2])
    dateObj = datetime.datetime(dateYear, dateMonth, dateDay)
    return dateObj
    