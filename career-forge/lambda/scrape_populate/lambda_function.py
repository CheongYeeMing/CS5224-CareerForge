import json
import sys
import logging
import psycopg2
import os
import requests
from bs4 import BeautifulSoup
import math
import json

def get_first_job_id(keywords, location):
    target_url=f'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=ios&location=singapore'
    res = requests.get(target_url)
    soup=BeautifulSoup(res.text,'html.parser')
    list=soup.find_all("li")[0]
    first_job_id = list.find("div",{"class":"base-card"}).get('data-entity-urn').split(":")[3]
    return first_job_id

def get_job_ids(keywords, location, max_number_to_get):
    keywords = keywords.replace(" ", "%20")
    location = location.replace(" ", "%20")
    currentJobId = get_first_job_id(keywords, location)
    number_of_loops=math.ceil(max_number_to_get/25)

    target_url=f'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords}&location={location}&currentJobId={currentJobId}&start=' + '{}'

    job_ids = set()

    for i in range(0, number_of_loops):

        res = requests.get(target_url.format(i))
        soup=BeautifulSoup(res.text,'html.parser')
        alljobs_on_this_page=soup.find_all("li")

        for x in range(1,len(alljobs_on_this_page)):
            job_card = alljobs_on_this_page[x].find("div",{"class":"base-card"})
            if job_card is None:
                continue
            job_id = job_card.get('data-entity-urn').split(":")[3]
            job_ids.add(job_id)
    
    return job_ids

def lambda_handler(event, context):
    try:
        job_ids = get_job_ids("software","singapore", 1000)
    except:
        logging.error("ERROR: Unexpected error: Could not get job ids")
        sys.exit()

    keywords=["backend", "frontend", "javascript", "python", "java", "ui", "ux", "sql", "react", "algorithm", "problem solving", 
          "devops", "defensive", "git", "anaylse", "design", "team player", "computer science", "cloud", "artificial intelligence",
         "ai", "secure", "ci", "cd", "deployment", "api", "rest", "soap", "product", "management", "organizational", "agile", "scrum",
         "api","testing", "mobile", "architecture", "infrastructure", "lead"]
    c = ['Seniority level', 'Employment type', 'Job function', 'Industries']
    target_url='https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{}'
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
    
    
    jobs = []
    print(len(job_ids))
    for job_id in job_ids:
        resp = requests.get(target_url.format(job_id))
        soup=BeautifulSoup(resp.text,'html.parser')
        if soup is not None:
        
            job = {}

            try:
                job["ID"]=job_id
            except:
                job["ID"]=None

            try:
                job["company"]=soup.find("div",{"class":"top-card-layout__card"}).find("a").find("img").get('alt')
            except Exception as e:
                print(e)
                job["company"]=None

            try:
                job["job-title"]=soup.find("div",{"class":"top-card-layout__entity-info"}).find("a").text.strip()
            except:
                job["job-title"]=None

            pt=0
            criterias = soup.find("ul",{"class":"description__job-criteria-list"})
            if criterias is not None:
                for crit in criterias.find_all("li"):

                    try:
                        job[c[pt]]=crit.text.replace(c[pt],"").strip()
                    except:
                        job[c[pt]]=None
                    pt +=1

            try:
                job["job description"]=soup.find("div",{"class":"core-section-container__content break-words"}).text.strip().replace("\n", " ").replace("'", "")
            except:
                try:
                    job["job description"]==soup.find("div",{"class":"description__text description__text--rich"}).text.strip().replace("\n", " ").replace("'", "")
                except:
                    job["job description"]=None

            try:
                found=set()
                for word in keywords:
                    if word in job["job description"].lower():
                        found.add(word)
                job["keywords"] = found
            except:
                job["keywords"] = {}

            # TODO: find more fields to extract
            if job["company"] is not None and job["job-title"] is not None and job["Seniority level"] is not None and job["job description"] is not None:
                print(job)
                jobs.append(job)

    inserted =[]
    for job in jobs:
        with conn.cursor() as cur:
            keywords = str(job["keywords"])
            keywords = keywords.replace("'", '"')
            print(keywords)
            insertstring = "INSERT INTO detail VALUES('{}','{}','{}','{}','{}','{}','{}','{}','{}')".format(job["ID"], job["company"], job["job-title"], job["Seniority level"], job["Employment type"],job["Job function"],job["Industries"],job["job description"], keywords)
            try:
                cur.execute(insertstring)
                print(f'{job["ID"]} inserted')
                inserted.append(job["ID"])
            except Exception as e:
                print(e)
        conn.commit()
    conn.close()
    return {
        "statusCode":200,
        "inserted": inserted
    } 
print(lambda_handler(0,0))