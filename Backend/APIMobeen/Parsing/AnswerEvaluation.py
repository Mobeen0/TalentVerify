import instructor

from pydantic import BaseModel
from groq import Groq


class EvaluationScore(BaseModel):
    score:int
    remarks:str
    
    
def get_evaluation(API_KEY,Question,Answer):
    client = Groq(api_key = API_KEY)
    client = instructor.from_groq(client,mode = instructor.Mode.TOOLS)
    
    prompt = """
        You are an interviewer, you will evaluate a candidates response to the interview question.
        Make sure the you consider the following points:
            1) Grade the response out of 10
            2) If the user mentions a specific software version do not cut their marks as your knowledge base is not updated.
            3) Do not cut marks for gramatical errors.
            4) Evaluate the quality of response with the relevancy against the Question.
            5) Keep remarks short and to the point.
            6) If the answer is completely irrelevant do give 0 score
            7) If the answer is detailed and relevant do give 10 score
        ### Question:
        {}
        
        ### Answer:
        {}
    """
    
    resp = client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages = [
            {
                "role":"user",
                "content":prompt.format(Question,Answer)
            }
        ],
        response_model = EvaluationScore
    )
    
    print(resp.model_dump_json(indent=2))
    resp = dict(resp)
    return resp