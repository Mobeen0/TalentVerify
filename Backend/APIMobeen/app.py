import os
import Database.utility as DB
import DataModels.classes as DBClasses
import AudioModel.inference as Audio
import Parsing
import tempfile
import shutil
import wave


from dotenv import load_dotenv
from fastapi import FastAPI,Request, File, UploadFile,HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from requests import Request
from datetime import date
from typing import List, Optional

import Parsing.ResumeParsing
import Parsing.AnswerEvaluation




load_dotenv()
CONNECTION_URI = os.getenv('CONNECTION_URI')
GROQ_API = os.getenv("GROQ_API_KEY")



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

app.add_middleware( # allow requests from the frontend
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


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
                    Password:str, Email:str, PicFlag:int,Domains: List[str] = []):
    
    IntervieweeData = DBClasses.Interviewee(FirstName = FirstName,LastName = LastName,DateOfBirth = DateOfBirth,
                                       UserName = UserName, Password = Password, Email = Email,
                                       Domains = Domains, PicFlag = PicFlag)
    
    try:
        print("Attempting Signing Up Interviewee")
        RetVal = DB.add_interviewee(IntervieweeData)
        if(type(RetVal) == str):
            return JSONResponse(content={"message": "RetVal"}, status_code = 400)
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


def create_wav_file(raw_data, output_path, channels=1, sample_width=2, frame_rate=44100):
    with wave.open(output_path, 'wb') as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(frame_rate)
        wav_file.writeframes(raw_data)

@app.post("/AudioEmotion")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Read the raw audio data
        raw_audio_data = await file.read()

        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file_path = temp_file.name

        # Convert the raw audio data to a WAV file
        create_wav_file(raw_audio_data, temp_file_path)

        # Process the audio file
        result = Audio.get_emotion_from_path(temp_file_path)

        # Delete the temporary file
        os.unlink(temp_file_path)

        return JSONResponse(content={"message": "File uploaded and processed successfully", "result": result})
    except Exception as e:
        # If a temporary file was created, ensure it's deleted
        if 'temp_file_path' in locals():
            os.unlink(temp_file_path)
        return JSONResponse(content={"message": f"An error occurred: {str(e)}"}, status_code=500)

@app.post('/ResumeQuestionGen')
async def GetQuestions(file:UploadFile):
    OCRText = await Parsing.ResumeParsing.extract_text_from_pdf(file)
    
    HardQuestions = Parsing.ResumeParsing.GenQuestions(GROQ_API,OCRText,"Hard")
    SoftQuestions = Parsing.ResumeParsing.GenQuestions(GROQ_API,OCRText,"Soft")
    
    return JSONResponse(content={"Hard":HardQuestions,"Soft":SoftQuestions}, status_code=200)
    

@app.post('/EvaluateAnswer')
async def GetAnswer(Question:str,Answer:str):
    
    EvaluationResults = Parsing.AnswerEvaluation.get_evaluation(GROQ_API,Question,Answer)
    
    return JSONResponse(content = EvaluationResults, status_code=200)

@app.post('/AddJobPosting')
async def AddJobPosting(Username:str,JobTitle:str, JobDescription:str,JobSkills:str):
    Flag = DB.add_job_posting(Username,JobTitle,JobDescription,JobSkills)
    if Flag:
        return JSONResponse(content = {"message":"Successfully Added"},status_code=200)
    else:
        return JSONResponse(content = {"message":"Error Occured"}, status_code=400)

@app.get('/ShowAllPostings')
async def ShowAllPostings(Username:str):
    listings = DB.return_all_postings(Username)

    return JSONResponse(content = listings,status_code =200)

@app.get('/ViewAllPostings')
async def ViewAllPostings():
    listings = DB.view_all_postings()
    
    return JSONResponse(content = listings,status_code =200)