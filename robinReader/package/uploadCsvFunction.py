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
import base64

def lambda_handler(event, context):
  try:
    body = json.loads(event['body'])
    
    csv_file_name = body['csv_file_name']
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

    new_xlsx_object_name = csv_file_name.split(".csv")[0] + ".xlsx"
    upload_status = writeCSV(tradeList, new_xlsx_object_name)
    output = writeCSV(tradeList, new_xlsx_object_name)
    encoded_content = base64.b64encode(output.getvalue()).decode()
    download_url = generate_presigned_url_get(os.environ['XLSX_BUCKET'], new_xlsx_object_name)
    
    # return {
    #   "statusCode": 200,
    #   "headers": {
    #     "Content-Type": "application/json",
    #   },
    #   "body": json.dumps({
    #       "download_url": download_url,
    #   }),
    # }
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
        'body': json.dumps({'error': str(e)})
    }
  