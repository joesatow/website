from helper_funcs.fileFunctions import getData
from helper_funcs.filter import filterData
from helper_funcs.dataFunctions import getCurrentValue
from helper_funcs.contractDictFunctions import createNewDictEntry
from helper_funcs.contractDictUpdate import getContractDictUpdate
from helper_funcs.tradeListFunctions import getTradeDictUpdate
from helper_funcs.outputFunctions import writeCSV
from aws_jserver import generate_presigned_url_get
import tempfile
import os
import json

def lambda_handler(event, context):
  try:
    event_body = json.loads(event['body'])
    csv_file_name = "72f0aba9-6281-5007-acf2-d720dfe3a54c.csv"
    
    # Get account activity list
    accountActivityList = getData(csv_file_name) 

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

    new_xlsx_object_name = csv_file_name.split(".csv")[0] + ".xlsx"
    upload_status = writeCSV(tradeList, new_xlsx_object_name)
    download_url = generate_presigned_url_get(os.environ['XLSX_BUCKET'], new_xlsx_object_name)
    
    return {
          "statusCode": 200,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": json.dumps({
              "download_url": download_url
          }),
      }
  except Exception as e:
        return {
            'statusCode': 500,
            "headers": {
              "Content-Type": "application/json"
            },
            'body': json.dumps({'error': str(e)})
        }
  