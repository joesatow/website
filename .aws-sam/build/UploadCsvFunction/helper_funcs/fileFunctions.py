import csv
import os
import glob

def getData():
    path = os.getcwd()
    extension = 'csv'
    os.chdir(path)
    result = glob.glob('*.{}'.format(extension))
    activityFile = result[0]

    with open(activityFile) as f:
        reader = csv.DictReader(f)
        data = list(reader)

    # Return everything but first row and last 2 rows
    # First row is headers, last two rows are robinhood text, not data we want 
    return data[0:-2] 