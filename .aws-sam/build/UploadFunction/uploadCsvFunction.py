import boto3
import os

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = os.environ['BUCKET_NAME']  # S3 bucket name from environment variable
    object_name = event['queryStringParameters']['file_name']  # File name from query parameters
    expiration = 3600  # URL expiration time

    # Generate pre-signed URL
    presigned_url = s3.generate_presigned_url('put_object',
                                              Params={'Bucket': bucket_name, 'Key': object_name},
                                              ExpiresIn=expiration)
    print("peen")
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*"
        },
        'body': presigned_url
    }