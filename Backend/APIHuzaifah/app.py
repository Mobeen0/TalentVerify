from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utility import getFaceEmotion

import os
import numpy as np
import cv2
import base64

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post('/getVideoEmotion')
async def ret_video_emotion(request:Request):
    data = await request.json()
    img_src = data.get('img')

    if img_src is not None:
        base64_encoded_data = img_src.split(',')[1]
        decoded_data = base64.b64decode(base64_encoded_data)

        np_data = np.frombuffer(decoded_data, np.uint8)

        cv_image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        emotion = getFaceEmotion(cv_image)
        return JSONResponse(content = {'emotion': emotion}, status_code = 200)
    else:
        return JSONResponse(content={'emotion': 'None'}, status_code = 400)