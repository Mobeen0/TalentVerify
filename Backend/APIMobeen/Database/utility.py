from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


    
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