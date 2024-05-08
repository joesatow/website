from aws_jserver import GetSecret, ListSecrets

print(GetSecret("TDAmeritrade-API"))

for key in ListSecrets()['SecretList']:
    print("Key name: " + key['Name'])
    print("Description: " + key['Description'])