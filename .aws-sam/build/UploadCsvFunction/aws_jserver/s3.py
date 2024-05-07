import boto3
import logging
from botocore.exceptions import ClientError

def upload_object_to_s3(file_content, bucket_name, object_name):
    """
    Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket_name: Bucket to upload to
    :param object_name: S3 object name. If not specified, file_name is used
    :return: True if file was uploaded, else False
    """

    # Create an S3 client
    s3_client = boto3.client('s3')
    
    try:
        # Upload the file
        s3_client.put_object(Bucket=bucket_name, Key=object_name, Body=file_content)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def generate_presigned_url(bucket_name, object_name):
    # Create an S3 client
    s3_client = boto3.client('s3')
    
    # Generate a presigned URL for the uploaded object
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=3600)  # Expires in 1 hour
        return response
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None