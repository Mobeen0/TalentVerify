import feat as ft
import numpy as np

video_model="resmasknet"

emo_names={
    0:'Angry',
    1:'Disgusted',
    2:'Afraid',
    3:'Happy',
    4:'Sad',
    5:'Surprised',
    6:'Neutral'
}


detector = ft.Detector(
    face_model="retinaface",
    landmark_model="mobilefacenet",
    au_model='svm',
    emotion_model=video_model,
    facepose_model="img2pose",
    )

def getFaceEmotion(frame_video):
    
    try:
        faces = detector.detect_faces(frame_video)
        landmarks = detector.detect_landmarks(frame_video, faces)
        emotions=detector.detect_emotions(frame_video,faces,landmarks)
        return emo_names[np.argmax(emotions[0][0])]
    except:
        return "None"