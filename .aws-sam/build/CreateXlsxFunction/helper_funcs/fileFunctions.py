import csv
import os
from aws_jserver import get_object_s3
from io import StringIO

def getData(file_name):
    activityFile_bytes = get_object_s3(os.environ['BUCKET_NAME'], file_name)
    activityFile_string = activityFile_bytes.decode('utf-8')
    
    # Use StringIO to simulate a file object from the CSV string
    f = StringIO(activityFile_string)
    reader = csv.DictReader(f)
    data = list(reader)

    # Return everything but first row and last 2 rows
    # First row is headers, last two rows are robinhood text, not data we want 
    return data[0:-2] 