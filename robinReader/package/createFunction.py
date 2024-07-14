from dependencies.helper_funcs.fileFunctions import getData
from dependencies.helper_funcs.filter import filterData
from dependencies.helper_funcs.dataFunctions import getCurrentValue
from dependencies.helper_funcs.contractDictFunctions import createNewDictEntry
from dependencies.helper_funcs.contractDictUpdate import getContractDictUpdate
from dependencies.helper_funcs.tradeListFunctions import getTradeDictUpdate
from dependencies.helper_funcs.outputFunctions import writeCSV
from dependencies.helper_funcs.leftovers import get_leftovers_list
import json
import base64

def lambda_handler(event, context):
  try:
    body = json.loads(event['body'])
    csv_content = body['csv_content']
    csv_content = base64.b64decode(csv_content).decode('utf-8')
    
    # Get account activity list
    accountActivityList = getData(csv_content) 

    # Filter data
    accountActivityList = filterData(accountActivityList)

    # contract dictionary to track positions until closed
    # using a dictionary is a good way to track because sometimes you open multiple options at once.
    contractDict = {}

    # trade List to keep track of closed trades
    tradeList = []

    for line in accountActivityList:
      description = getCurrentValue(0, line)

      if description not in contractDict:
        contractDict[description] = createNewDictEntry(line)

      currentContract = contractDict[description]

      contractDict[description].update(getContractDictUpdate(currentContract, line))

      if currentContract['currentQuantity'] == 0:
        tradeList.append(getTradeDictUpdate(currentContract, description, line['Process Date'])) # use process date to get buy date
        del contractDict[description]

    leftovers_list = get_leftovers_list(contractDict)
    tradeList = leftovers_list + tradeList

    output = writeCSV(tradeList)
    encoded_content = base64.b64encode(output.getvalue()).decode()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="modified_file.txt"'
        },
        'body': encoded_content,
        'isBase64Encoded': True
    }
  except Exception as e:
    return {
        'statusCode': 500,
        "headers": {
          "Content-Type": "application/json"
        },
        'body': json.dumps({'peen error': str(e)})
    }
  