from pydantic import BaseModel
from datetime import date
from typing import List


class Employer(BaseModel):
    FirstName:str
    LastName:str
    DateOfBirth:str
    UserName:str
    Password:str
    Email:str
    Organization:str
    PicFlag:int=0 # 0 tells default picture
    
class Interviewee(BaseModel):
    FirstName:str
    LastName:str
    DateOfBirth:str
    UserName:str
    Password:str
    Email:str
    Domains:List
    PicFlag:int=0
    
class Interview(BaseModel):
    Title:str
    ShortlistNum:int # must be > 0
    Domains:List[str]
    Completed:bool # employer can set time limit or mark it as done
    
    
    
    