import json
import os
from aws_jserver import generate_presigned_url_post
# import requests


def lambda_handler(event, context):
    print("event")
    print(event)
    print("end event")
    try: 
        bucket_name = os.environ['CSV_BUCKET']  # S3 bucket name from environment variable
        event_body = json.loads(event['body'])
        object_name = event_body['csv_file_name']
        expiration = 3600  # URL expiration time

        # Generate pre-signed URL
        presigned_url = generate_presigned_url_post(bucket_name, object_name, expiration)
        presigned_url = json.dumps(presigned_url)
        
        # return {
        #     'statusCode': 200,
        #     # 'headers': {
        #     #     "Access-Control-Allow-Origin": "*", # Required for CORS support to work
        #     #     "Access-Control-Allow-Credentials": "true", # Required for cookies, authorization headers with HTTPS
        #     # },
        #     'body': presigned_url
        # }
        return {
            'statusCode': 200,
            # 'headers': {
            #     "Access-Control-Allow-Origin": "*", # Required for CORS support to work
            #     "Access-Control-Allow-Credentials": "true", # Required for cookies, authorization headers with HTTPS
            # },
            'body': presigned_url
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*", # Required for CORS support to work
                "Access-Control-Allow-Credentials": "true", # Required for cookies, authorization headers with HTTPS
            },
            'body': json.dumps({'error': str(e)})
        }
    