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

def upload_file_to_s3(file_name, bucket, object_name=None):
    # Create an S3 client
    s3_client = boto3.client('s3')
    
    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name
    
    # Upload the file
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except Exception as e:
        print(f"Error uploading file: {e}")
        return False
    return True

def upload_fileobj_to_s3(file_obj, bucket, key):
    """
    Uploads a file-like object (BytesIO) to AWS S3.

    Parameters:
        file_obj (io.BytesIO): The file-like object to upload.
        bucket (str): The name of the S3 bucket.
        key (str): The S3 key for the file.

    Returns:
        bool: True if file was uploaded successfully, False otherwise.
    """
    # Create an S3 client
    s3_client = boto3.client('s3')
    try:
        # Seek to the beginning of the file-like object before uploading
        file_obj.seek(0)
        # Upload the file-like object
        s3_client.upload_fileobj(file_obj, bucket, key)
        print("File uploaded successfully.")
        return True
    except Exception as e:
        print(f"Error uploading file: {e}")
        return False

def generate_presigned_url_get(bucket_name, object_name, expiration=3600):
    # Create an S3 client
    s3_client = boto3.client('s3')
    
    # Generate a presigned URL for the uploaded object
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)  # Expires in 1 hour
        return response
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None
    
def generate_presigned_url_post(bucket_name, object_name, expiration=3600):
    s3_client = boto3.client('s3')
    
    try:
        response = s3_client.generate_presigned_post(
                                                    bucket_name,
                                                    object_name,
                                                    ExpiresIn=expiration)  # Expires in 1 hour

        return response
    
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None

def get_object_s3(bucket_name, object_key):
     # Create an S3 client
    s3_client = boto3.client('s3')

    # Get the object from the bucket
    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)

    # The object data is now available as a byte stream in the response['Body']
    # Here's how you can read it into a variable
    data = response['Body'].read()

    # Return the data or do something else with it
    return data