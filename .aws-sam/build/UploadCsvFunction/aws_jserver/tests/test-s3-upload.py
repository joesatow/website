from aws_jserver import upload_object_to_s3

test_load = b'This is a test object to upload.'
upload_object_to_s3(test_load, "chart-stamp", "test.txt")