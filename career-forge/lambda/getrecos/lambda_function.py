import sys
import boto3
import urllib
import psycopg2
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
personalize = boto3.client(service_name='personalize')
personalize_runtime = boto3.client(service_name='personalize-runtime')
personalize_events = boto3.client(service_name='personalize-events')
campaign_arn = "arn:aws:personalize:us-east-1:471112722408:campaign/reco"

def get_new_recommendations_df_users(user_id, context):
    
    get_recommendations_response = personalize_runtime.get_recommendations(
        campaignArn = campaign_arn,
        userId = str(user_id),
        context = {
            "resume" : context
        }
    )
    # Build a new dataframe of recommendations
    item_list = get_recommendations_response['itemList']
    print(item_list)
    recommendation_list = []
    for item in item_list:
        recommendation_list.append(item['itemId'])

    return recommendation_list

def lambda_handler(event, context):
    # TODO implement
    # Get the bucket and object key from the Event
    user_name='cs5224'
    password='adminpassword'
    rds_host='careerforge-db-1.crywows4qz3l.us-east-1.rds.amazonaws.com'
    rds_port='5432'
    db_name='careerforge_job'
    user_id = event["user_id"]
    filepath = 'textract/' + str(user_id) + '.pdf.txt'
    
    try:
        conn = psycopg2.connect(host=rds_host, user=user_name, password=password, dbname=db_name, port=rds_port)
    except psycopg2.Error as e:
        print("ERROR: Unexpected error: Could not connect to Postgres instance.")
        print(e)
        sys.exit()
        
    try:
        resume_info = s3.get_object(Bucket='careerforge-stub', Key=filepath)
        data = resume_info['Body'].read()
        context = str(data)[:1000]
        recommendations_df_users = get_new_recommendations_df_users(user_id, context)
    except Exception as e:
        print(e)
        sys.exit()

    jobs = []
    with conn.cursor() as cur:
        for id in recommendations_df_users:
            cur.execute("select * from detail where ID={}".format(id))
            row = cur.fetchall()
            print(row)
            jobs.append(row)
    conn.commit()
    return {
        'statusCode': 200,
        'user_id': user_id,
        'body': jobs
    }