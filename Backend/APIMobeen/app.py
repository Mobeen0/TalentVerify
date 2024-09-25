from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import classes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


@app.get('/')
def home():
    
    return JSONResponse(content = {"message": "Ran successfully"})

@app.post('/login')
def login(request:Request):
    # check from database if Uname and pass exist
    # if exist then return otherwise send back failure
    data = request.json()

    uname = data.get('uname')
    upass = data.get('upass')

    return JSONResponse(content = {"message": "user found"})
    
