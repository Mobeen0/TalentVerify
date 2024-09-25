from pydantic import BaseModel

class User(BaseModel):
    FullName:str
    UserName:str
    UserPass:str
    Schedule:str="None"
