import boto3
import os
# from aws_jserver import upload_object_to_s3
# import requests


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = os.environ['BUCKET_NAME']  # S3 bucket name from environment variable
    object_name = event['queryStringParameters']['file_name']  # File name from query parameters
    expiration = 3600  # URL expiration time

    # Generate pre-signed URL
    presigned_url = s3.generate_presigned_url('put_object',
                                              Params={'Bucket': bucket_name, 'Key': object_name},
                                              ExpiresIn=expiration)
    
    # url = presigned_url
    # payload = event["body"]
    # headers = {
    #     'Content-Type': 'text/csv'
    # }

    # requests.request("PUT", url, headers=headers, data=payload)

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*", # Required for CORS support to work
            "Access-Control-Allow-Credentials": "true", # Required for cookies, authorization headers with HTTPS
        },
        'body': presigned_url
    }