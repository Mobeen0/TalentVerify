from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utility import getFaceEmotion, initIdentity, checkIdentity

import os
import numpy as np
import cv2
import base64

app = FastAPI()

class ImageRequest(BaseModel):
    img: str
    
class ImageListRequest(BaseModel):
    images: list[str]

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
    
    
    
@app.post('/initializeIdentity')
async def init_identity(image_list_request: ImageListRequest):
    if len(image_list_request.images) > 2:
        return JSONResponse(content={'message': 'Too many images'}, status_code=400)
    elif len(image_list_request.images) == 1:
        return JSONResponse(content={'message': 'Single image received'}, status_code=400)
    elif len(image_list_request.images) == 0:
        return JSONResponse(content={'message': 'No images received'}, status_code=400)
    
    img_src_1 = image_list_request.images[0]
    img_src_2 = image_list_request.images[1]

    if img_src_1 is not None and img_src_2 is not None:
        base64_encoded_data_1 = img_src_1.split(',')[1]
        decoded_data_1 = base64.b64decode(base64_encoded_data_1)
        np_data_1 = np.frombuffer(decoded_data_1, np.uint8)
        cv_image_1 = cv2.imdecode(np_data_1, cv2.IMREAD_COLOR)
        
        base64_encoded_data_2 = img_src_2.split(',')[1]
        decoded_data_2 = base64.b64decode(base64_encoded_data_2)
        np_data_2 = np.frombuffer(decoded_data_2, np.uint8)
        cv_image_2 = cv2.imdecode(np_data_2, cv2.IMREAD_COLOR)

        success_status = initIdentity(cv_image_1, cv_image_2)
        return JSONResponse(content={'status': str(success_status)}, status_code=200)
    else:
        return JSONResponse(content={'message': 'No imgs'}, status_code=400)
    
@app.post('/checkIdentity')
async def check_identity(image_request: ImageRequest):
    img_src = image_request.img

    if img_src is not None:
        base64_encoded_data = img_src.split(',')[1]
        decoded_data = base64.b64decode(base64_encoded_data)
        np_data = np.frombuffer(decoded_data, np.uint8)

        cv_image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        
        success_status = checkIdentity(cv_image)
        return JSONResponse(content={'status': str(success_status)}, status_code=200)
    else:
        return JSONResponse(content={'message': 'No img'}, status_code=400)
    
