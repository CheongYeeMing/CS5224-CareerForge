import json
import sys
import boto3
import urllib
import psycopg2

def lambda_handler(event, context):
    # TODO implement
    # Get the bucket and object key from the Event
    user_name='cs5224'
    password='adminpassword'
    rds_host='careerforge-db-1.crywows4qz3l.us-east-1.rds.amazonaws.com'
    rds_port='5432'
    db_name='careerforge_job'
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    s3_client = boto3.client("s3")
    file_content = s3_client.get_object(Bucket=bucket, Key=key)["Body"].read()
    ids = file_content.decode("utf-8").split(",")
    
    try:
        conn = psycopg2.connect(host=rds_host, user=user_name, password=password, dbname=db_name, port=rds_port)
    except psycopg2.Error as e:
        print("ERROR: Unexpected error: Could not connect to Postgres instance.")
        print(e)
        sys.exit()
        
    jobs = []
    with conn.cursor() as cur:
        for id in ids:
            cur.execute("select * from detail where ID={}".format(id))
            row = cur.fetchall()
            print(row)
            jobs.append(row)
    conn.commit()
    userid = key.replace(".txt","")
    return {
        'statusCode': 200,
        'userID': userid,
        'body': jobs
    }