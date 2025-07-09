import fitz
import instructor

from groq import Groq
from pydantic import BaseModel,Field
from typing import List


class QuestionsClass(BaseModel):
    Questions: List[str] = Field(..., description="A list of questions")

async def extract_text_from_pdf(file):
    PdfBytes = await file.read()
    
    PdfDocument = fitz.open(stream=PdfBytes,filetype="pdf")
    text = ""
    for page_num in range(len(PdfDocument)):
        page = PdfDocument.load_page(page_num)
        text += page.get_text()

    
    PdfDocument.close()
    
    return text
    


def GenQuestions(API_KEY, OCRText, QuestionType):

    client = Groq(api_key = API_KEY)
    client = instructor.from_groq(client, mode = instructor.Mode.TOOLS)
    
    prompt = """
        You are an interviewer, you will evaluate a candidates Resume and generate 10 interview questions.
        Make sure the questions target {} skills mentioned in the candidates resume.
        Do not ask basic what and how questions.
        ### Resume:
        {}
    
    """
    
    resp = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt.format(QuestionType,OCRText),
        }
    ],
    response_model=QuestionsClass,temperature=0)
    
    print(resp.model_dump_json(indent=2))
    
    return resp.Questions