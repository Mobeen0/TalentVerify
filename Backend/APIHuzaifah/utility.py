import feat as ft
import numpy as np
from deepface import DeepFace

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
    

    
def initIdentity(frame1,frame2):
    global identity_vectors
    identity_vectors = None
    try:
        faces1 = detector.detect_faces(frame1)
        faces2 = detector.detect_faces(frame2)
        
        if len(faces1[0])==0 or len(faces2[0])==0:
            return "Error: No face detected"
        
        if len(faces1[0])>1:
            msg=len(faces1[0])+" faces found in frame 1"
            return msg
        
        if len(faces2[0])>1:
            msg=len(faces2[0])+" faces found in frame 2"
            return msg
        
        iden1=detector.detect_identity(frame1,faces1)[0][0]
        iden2=detector.detect_identity(frame2,faces2)[0][0]
        
        similarity=np.dot(iden1,iden2)/(np.linalg.norm(iden1)*np.linalg.norm(iden2)) #cosine similarity formula
        
        if(similarity>0.5): #Threshold is subject to change
            
            identity_vectors=[iden1,iden2]
            return "Face Identity has been established"
        else:
            return "Error: Faces provided dont match"
        
    except:
        return "None"
    
    
def checkIdentity(frame):
    try:
        faces = detector.detect_faces(frame)
        
        if identity_vectors == None:
            return "Identity has yet note been established"
        
        if len(faces[0])==0:
            return "Error: No face detected"
        
        if len(faces[0])>1:
            msg=len(faces[0])+" faces found in frame"
            return msg
        
        
        iden=detector.detect_identity(frame,faces)[0][0]
        
        similarity1=np.dot(identity_vectors[0],iden)/(np.linalg.norm(identity_vectors[0])*np.linalg.norm(iden)) #cosine similarity formula
        similarity2=np.dot(identity_vectors[1],iden)/(np.linalg.norm(identity_vectors[1])*np.linalg.norm(iden))
        
        deepfake_check = DeepFace.extract_faces(img_path=frame, anti_spoofing = True)[0]['is_real']
        if(deepfake_check=='False'):
            return 'Deepfake detected'
        
        
        
        if(similarity1>0.5) and similarity2>0.5: #Threshold is subject to change
            return "Success"
        else:
            return "Error: Faces provided dont match"
        
    except:
        return "None"
    