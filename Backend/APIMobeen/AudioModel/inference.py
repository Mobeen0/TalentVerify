import os
from speechbrain.inference.interfaces import foreign_class
classifier = foreign_class(source="speechbrain/emotion-recognition-wav2vec2-IEMOCAP", pymodule_file="custom_interface.py", classname="CustomEncoderWav2vec2Classifier")

def get_emotion():
    out_prob, score, index, text_lab = classifier.classify_file("speechbrain/emotion-recognition-wav2vec2-IEMOCAP/anger.wav")
    #print(text_lab)
    return text_lab


def get_emotion_from_path(FilePath):
    out_prob, score, index, text_lab = classifier.classify_file(FilePath)
    #print(text_lab)
    return text_lab

def iterate_emotion_file():
    ParentDir = os.path.join("AudioModel","SampleRecordings")
    print(ParentDir)
    for FileName in os.listdir(ParentDir):
        out_prob, score, index, text_lab = classifier.classify_file(os.path.join(ParentDir,FileName))
        print(FileName)
        print(text_lab)
