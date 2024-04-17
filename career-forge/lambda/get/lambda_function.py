import json
import sys
import logging
import psycopg2
import os

def lambda_handler(event, context):
    user_name='cs5224'
    password='adminpassword'
    rds_host='careerforge-db-1.crywows4qz3l.us-east-1.rds.amazonaws.com'
    rds_port='5432'
    db_name='careerforge_job'

    logger = logging.getLogger(__name__)
    logging.basicConfig(filename='example.log', encoding='utf-8', level=logging.DEBUG)

    try:
        conn = psycopg2.connect(host=rds_host, user=user_name, password=password, dbname=db_name, port=rds_port)
    except psycopg2.Error as e:
        logging.error("ERROR: Unexpected error: Could not connect to Postgres instance.")
        logging.error(e)
        sys.exit()
        
    logging.info("SUCCESS: Connection to RDS Postgres instance succeeded")
    items = []
    count = 0
    with conn.cursor() as cur:
        cur.execute("select * from detail")
        logging.info("The following items have been found in the db:")
        for row in cur.fetchall():
            count += 1
            logging.info(row)
            items.append(row)
    conn.commit()
    
    logging.info("Found %d items in RDS Postgres table details" %(count))
    return {
        "statusCode":200,
        "job_details":items
    }
print(lambda_handler(1,1))


# Upload Resume [user_id, resume] -> S3/resume -> Textract [user_id, textract output] -> S3/resume_textract

# Fetch Job Recommendations -> user_id/resume_textract -> Personalize -> FE -> Job Recommendations