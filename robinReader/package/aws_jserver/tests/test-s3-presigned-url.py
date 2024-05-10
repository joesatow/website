from aws_jserver import generate_presigned_url

bucket_name = "chart-stamp"
object_name = "2024-02-20_15-11-52.png"

url = generate_presigned_url(bucket_name, object_name)
print(url)