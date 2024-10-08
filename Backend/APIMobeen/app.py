import os
import Database.utility as DB
import DataModels.classes as DBClasses
import AudioModel.inference as Audio


from dotenv import load_dotenv
from fastapi import FastAPI, Form, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from requests import Request
from datetime import date
from typing import List, Optional

load_dotenv()
CONNECTION_URI = os.getenv('CONNECTION_URI')


@asynccontextmanager
async def lifespan(app: FastAPI):
    # adding events to configure before the server start
    # can be models loading in the future as well
    DB.connect_server(CONNECTION_URI)
    yield
    # adding events to configure after server has shut down
    # such as db connection closing
    DB.disconnect_server()
    
app = FastAPI(lifespan=lifespan)

@app.get('/')
def home():
    JSONResponse(content={"Message": "Hello World"}, status_code = 200)



@app.post('/SignUpEmployer')
def signup_employer(FirstName:str,LastName:str,DateOfBirth:str,UserName:str, 
                    Password:str, Email:str ,Organization:str, PicFlag:int):
    
    EmployerData = DBClasses.Employer(FirstName = FirstName,LastName = LastName,DateOfBirth = DateOfBirth,
                                        UserName = UserName, Password = Password, Email = Email,
                                        Organization = Organization, PicFlag = PicFlag)
    try:
        print("Attempting Signing Up Employer")
        RetVal = DB.add_employer(EmployerData)
        if(type(RetVal) == str):
            return JSONResponse(content={"message": "Sign Up unsuccessful"}, status_code = 400)
        else:
            return JSONResponse(content={"message": "Successfully added to Database"}, status_code = 200)
    except:
        print("Could not register Employer")
        return JSONResponse(content={"message": "Sign Up unsuccessful"}, status_code = 400)


@app.post('/SignUpInterviewee')
def signup_interviewee(FirstName:str,LastName:str,DateOfBirth:str,UserName:str, 
                    Password:str, Email:str, PicFlag:int,Domains: List[str]):
    
    IntervieweeData = DBClasses.Interviewee(FirstName = FirstName,LastName = LastName,DateOfBirth = DateOfBirth,
                                       UserName = UserName, Password = Password, Email = Email,
                                       Domains = Domains, PicFlag = PicFlag)
    
    try:
        print("Attempting Signing Up Interviewee")
        RetVal = DB.add_interviewee(IntervieweeData)
        if(type(RetVal) == str):
            return JSONResponse(content={"message": "Sign Up unsuccessful"}, status_code = 400)
        else:
            return JSONResponse(content={"message": "Successfully added to Database"}, status_code = 200)
    except:
        print("Could not register Interviewee")
        return JSONResponse(content={"message": "Sign Up unsuccessful"}, status_code = 400)
        

@app.post('/Login')
def login(UserName:str, Password:str):
    EmployerData = DB.employer_login(UserName,Password)
    if(EmployerData):# info found in UserName
        print("EmployerFound")
        EmployerData.pop("_id")
        return JSONResponse(content={"UserInfo": EmployerData,"Type":"Employer"}, status_code = 200)
    else:
        IntervieweeData = DB.interviewee_login(UserName,Password)
        if(IntervieweeData):
            IntervieweeData.pop("_id")
            return JSONResponse(content={"UserInfo": IntervieweeData,"Type":"Interviewee"}, status_code = 200)
    return JSONResponse(content={"Message": "User Not Found"}, status_code = 404)
        

@app.get('/audio')
def get_emotion():
    response = Audio.get_emotion()
    print(response)
    print(type(response))
    return JSONResponse(content={"Message": f"Emotion = {response[0]}"}, status_code = 200)

