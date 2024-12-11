from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime


    
def connect_server(uri):
    print("Connecting to the server...")
    global Client
    Client = MongoClient(uri, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        Client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

def disconnect_server():
    print("Disconnecting from the server...")
    Client.close()
    

def add_employer(EmployerData):
    """Adds a new employer to the database.

    Args:
        EmployerData (class): A class containing the employer's data.

    Returns:
        int: EmployerData if the employer was added successfully, string error otherwise.
    """
    try:
        Db = Client["TalentVerify"]
        Collection = Db["Employer"]
        Collection2 = Db["Interviewee"]
        EmployerData = EmployerData.dict()
        # Check for duplicate username
        if Collection.find_one({"UserName": EmployerData["UserName"]}):
            print("Username already exists.")
            return "Username already exists."
        if Collection2.find_one({"UserName": EmployerData["UserName"]}):
            print("Username already exists.")
            return "Username already exists."

        # Check for duplicate email
        if Collection.find_one({"Email": EmployerData["Email"]}):
            print("Email already exists.")
            return "Email already exists."
        if Collection2.find_one({"Email": EmployerData["Email"]}):
            print("Email already exists.")
            return "Email already exists."

        # Add the employer to the database
        Collection.insert_one(EmployerData)
        print("Employer added successfully.")
        return 1

    except Exception as e:
        print("Error adding employer:", e)
        return "Error adding employer"
    
    
def add_interviewee(IntervieweeData):
    """Adds a new interviewee to the database.

    Args:
        IntervieweeData (dict): A dictionary containing the interviewee's data.

    Returns:
        int: 1 if the interviewee was added successfully, 0 otherwise.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Interviewee"]
        Collection2 = Db["Employer"]
        
        IntervieweeData = IntervieweeData.dict()
        # Check for duplicate username
        if Collection.find_one({"UserName": IntervieweeData["UserName"]}):
            print("Username already exists.")
            return "Username already exists."
        if Collection2.find_one({"UserName": IntervieweeData["UserName"]}):
            print("Username already exists.")
            return "Username already exists."

        # Check for duplicate email
        if Collection.find_one({"Email": IntervieweeData["Email"]}):
            print("Email already exists.")
            return "Email already exists."
        if Collection2.find_one({"Email": IntervieweeData["Email"]}):
            print("Email already exists.")
            return "Email already exists."

        # Add the interviewee to the database
        Collection.insert_one(IntervieweeData)
        print("Interviewee added successfully.")
        return 1

    except Exception as e:
        print("Error adding interviewee:", e)
        return "Error adding interviewee"
    
def employer_login(username, password):
    """Verifies the login credentials of an employer.

    Args:
        username (str): The employer's username.
        password (str): The employer's password.

    Returns:
        dict: The employer's data if login is successful, None otherwise.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Employer"]
        EmployerData = Collection.find_one({"UserName": username, "Password": password})
        if EmployerData:
            return EmployerData
        else:
            print("Invalid login credentials.")
            return None

    except Exception as e:
        print("Error during employer login:", e)
        return None

def interviewee_login(username, password):
    """Verifies the login credentials of an interviewee.

    Args:
        username (str): The interviewee's username.
        password (str): The interviewee's password.

    Returns:
        dict: The interviewee's data if login is successful, None otherwise.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Interviewee"]
        IntervieweeData = Collection.find_one({"UserName": username, "Password": password})
        if IntervieweeData:
            return IntervieweeData
        else:
            print("Invalid login credentials.")
            return None

    except Exception as e:
        print("Error during interviewee login:", e)
        return None
    
def add_job_posting(username, job_title, job_description, job_skills):
    """Adds a new job posting by an employer.

    Args:
        username (str): The employer's username.
        job_title (str): The title of the job.
        job_description (str): The description of the job.
        job_skills (str): Required skills for the job (stored as a single string).

    Returns:
        bool: True if the job was added successfully, False otherwise.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Interview"]
        job_posting = {
            "Username": username,
            "JobTitle": job_title,
            "JobDescription": job_description,
            "JobSkills": job_skills,
            "JobDate": datetime.now()
        }
        Collection.insert_one(job_posting)
        print("Job posting added successfully.")
        return True

    except Exception as e:
        print("Error adding job posting:", e)
        return False
    
def return_all_postings(username):
    """Returns all job postings for a specific employer.

    Args:
        username (str): The employer's username.

    Returns:
        list: A list of job postings.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Interview"]
        postings = list(Collection.find({"Username": username}))
        postings = [dict(posting) for posting in postings]
        count = 0
        ReturnDict = {}
        for post in postings:
            post.pop('_id')
            post['JobDate'] = post['JobDate'].strftime("%m/%d/%Y")
            ReturnDict.update({str(count):post})
            count+=1
            
        print(ReturnDict)
        return ReturnDict

    except Exception as e:
        print("Error retrieving job postings:", e)
        return []
    
def view_all_postings():
    """Returns all job postings for a specific employer.

    Args:
        username (str): The employer's username.

    Returns:
        list: A list of job postings.
    """

    try:
        Db = Client["TalentVerify"]
        Collection = Db["Interview"]
        postings = list(Collection.find())
        postings = [dict(posting) for posting in postings]
        count = 0
        ReturnDict = {}
        for post in postings:
            post.pop('_id')
            post['JobDate'] = post['JobDate'].strftime("%m/%d/%Y")
            ReturnDict.update({str(count):post})
            count+=1
            
        print(ReturnDict)
        return ReturnDict

    except Exception as e:
        print("Error retrieving job postings:", e)
        return []
