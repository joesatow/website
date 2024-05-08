from helper_funcs.fileFunctions import getData
from helper_funcs.filter import filterData
from helper_funcs.dataFunctions import getCurrentValue
from helper_funcs.contractDictFunctions import createNewDictEntry
from helper_funcs.contractDictUpdate import getContractDictUpdate
from helper_funcs.tradeListFunctions import getTradeDictUpdate
from helper_funcs.outputFunctions import writeCSV
import tempfile
import os
import json

def lambda_handler(event, context):
  event_body = json.loads(event['body'])
  csv_file = event_body['csv_file']
  print(csv_file)

  # # Get account activity list
  # accountActivityList = getData()

  # # Filter data
  # accountActivityList = filterData(accountActivityList)

  # # contract dictionary to track positions until closed
  # # using a dictionary is a good way to track because sometimes you open multiple options at once.
  # contractDict = {}

  # # trade List to keep track of closed trades
  # tradeList = []

  # for line in accountActivityList:
  #   description = getCurrentValue(0, line)

  #   if description not in contractDict:
  #     contractDict[description] = createNewDictEntry(line)

  #   currentContract = contractDict[description]

  #   contractDict[description].update(getContractDictUpdate(currentContract, line))

  #   if currentContract['currentQuantity'] == 0:
  #     tradeList.append(getTradeDictUpdate(currentContract, description, line['Process Date'])) # use process date to get buy date
  #     del contractDict[description]

  # writeCSV(tradeList)
  return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello robin",
            "data": csv_file
        }),
    }
  