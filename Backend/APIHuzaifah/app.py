from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel,conlist
from utility import getFaceEmotion

import os
import numpy as np
import cv2
import base64

app = FastAPI()

class ImageRequest(BaseModel):
    img: str
    
class ImageListRequest(BaseModel):
    images: conlist(str, min_items=5, max_items=5)

app.add_middleware( # allow requests from the frontend
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post('/getVideoEmotion')
async def ret_video_emotion(image_request:ImageRequest):
    #data = await request.json()
    img_src = image_request.img

    if img_src is not None:
        base64_encoded_data = img_src.split(',')[1]
        decoded_data = base64.b64decode(base64_encoded_data)

        np_data = np.frombuffer(decoded_data, np.uint8)

        cv_image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        emotion = getFaceEmotion(cv_image)
        return JSONResponse(content = {'emotion': emotion}, status_code = 200)
    else:
        return JSONResponse(content={'emotion': 'None'}, status_code = 400)
    
    
    
@app.post('/record Identity')
async def validate_and_store_identity(image_list_request:ImageListRequest):
    #data = await request.json()
    img_src = image_list_request.images

    if img_src is not None:
        base64_encoded_data = img_src.split(',')[1]
        decoded_data = base64.b64decode(base64_encoded_data)

        np_data = np.frombuffer(decoded_data, np.uint8)

        cv_image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        emotion = getFaceEmotion(cv_image)
        return JSONResponse(content = {'emotion': emotion}, status_code = 200)
    else:
        return JSONResponse(content={'emotion': 'None'}, status_code = 400)
