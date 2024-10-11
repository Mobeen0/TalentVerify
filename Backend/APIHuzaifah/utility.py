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
    
identity_vectors=None
    
def initIdentity(frame1,frame2):
    try:
        faces1 = detector.detect_faces(frame1)
        faces2 = detector.detect_faces(frame2)
        
        if len(faces1[0])==0 or len(faces2[0])==0:
            return "Error: No face detected"
        
        if len(faces1[0])>1 or len(faces2[0])>1:
            return "Error: Multiple faces in image"
        
        iden1=detector.detect_identity(frame1,faces1)[0][0]
        iden2=detector.detect_identity(frame2,faces2)[0][0]
        
        similarity=np.dot(iden1,iden2)/(np.linalg.norm(iden1)*np.linalg.norm(iden2)) #cosine similarity formula
        
        if(similarity>0.5): #Threshold is subject to change
            identity_vectors=[iden1,iden2]
            return "Success"
        else:
            return "Error: Faces provided dont match"
        
    except:
        return "None"
    
    