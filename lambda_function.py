from pprint import pprint
import boto3
from boto3.dynamodb.conditions import Key
import string
import random
import time
import json
import ast
from botocore.exceptions import ClientError


def retrieveAllUsers(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('usertable')

    try:
        
        response = table.scan (
            ProjectionExpression = "#name,email,lastlogin",
            ExpressionAttributeNames = {'#name' : 'name'}
            )
        return response['Items']
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response
        
def retrieveUser(email, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('usertable')

    try:
        email = email.lower()
        print("email input is ", email)
        
        response = table.query(
            KeyConditionExpression=Key('email').eq(email),
            ProjectionExpression = "#name,email,lastlogin",
            ExpressionAttributeNames = {'#name' : 'name'}
            )
        
    
        print("response-Items", response['Items'])
        return response['Items']
        
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response
        
        
        
def validateUser(email, password, lastlogin, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('usertable')

    try:
        email = email.lower()

        
        response = table.query(
            KeyConditionExpression=Key('email').eq(email),
            ProjectionExpression = "password,email"
            )
        print("validate user response", response["Items"]) 
        
        if (response["Items"]):
            
            updatelastlogin = table.update_item(
                Key={
                    'email': email
                },
                UpdateExpression="set lastlogin=:ll",
                ExpressionAttributeValues={
                    ':ll': lastlogin
                },
                ReturnValues="UPDATED_NEW"
            )
            if updatelastlogin:
                return  response["Items"]
            else:
                return "Unable to udpate lastlogin"
        else:
            return "Unable to fetch details"
        return response["Items"]
        
    except ( ClientError, IndexError, KeyError, ValueError, TypeError ) as e:
        print(e.response['Error']['Message'])
        return ("ERROR verifying the user.")
    else:
        return response
        


def createUser(name, email, password, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('usertable')
    email = email.lower()
    try:
        response = table.put_item(
            Item={
                'name': name,
                'email': email,
                'password' : password
            },
            ConditionExpression='attribute_not_exists(email)'
        )
        return response  
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            print(e.response['Error']['Message'])
            response = e.response['Error']['Message']
            return response
        else:
            raise
    else:
        return response['Item']
        
def updateUser(email, name, password, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')
    try:
        table = dynamodb.Table('usertable')
        readUser = table.query(
            KeyConditionExpression=Key('email').eq(email),
            ProjectionExpression = "email,#name,password",
            ExpressionAttributeNames = {'#name' : 'name'}
            )
        print("readresponse is", readUser.get("Items"))
        
        emaillfromdb = readUser.get("Items")[0].get("email")
        namefromdb = readUser.get("Items")[0].get("email")
        passwordfromdb = readUser.get("Items")[0].get("password")
        
       
        if (email == emaillfromdb):
            print("email matched!!")
        try:
            response = table.update_item(
                Key={
                    'email': email
                },
                UpdateExpression="set #name=:n, password=:p",
                ExpressionAttributeNames = {'#name' : 'name'},
                ExpressionAttributeValues={
                    ':n': name,
                    ':p': password
                },
                ReturnValues="UPDATED_NEW"
            )
            
            
            return response["Attributes"].get("name")
                
        except ClientError as e:
            print(e.response['Error']['Message'])
            return e.response
        
        else:
            print("email not mached!!!")
            return response
    
    except ( ClientError, IndexError, KeyError, TypeError ) as e:
        
        print("ERROR FETCHING EMAIL")
        return "ERROR Fetching Email ID..."
    else:
        return response
        

        
        
def deleteUser(email, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('usertable')
    email = email.lower()

    try:
        email = email.lower()
        retrieveStatus = retrieveUser(email)
        print("retrieveStatus", retrieveStatus)
        if retrieveStatus:
            response = table.delete_item(Key={'email' : email})
            print("delete reponse is", response)
            return response
        else:
            return "Email ID is not valid. "
    except ( ClientError, IndexError, KeyError, TypeError ) as e:
        print(e.response['Error']['Message'])
        return ("Delete action failed. ")
    else:
        return response
        

def lambda_handler(event, context):
    action = "no value"
    

    
    action = event.get("action")

    
    
    
    if (action  == "listusers"):
        readuser = retrieveAllUsers()
        
        
        return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(readuser)
        }
        
        
    
    elif (action  == "PUT"):
        email = event.get("email")
        name = event.get("name")
        password = event.get("password")
  
    
        userCreation = createUser(name,email,password)
        if (userCreation == "The conditional request failed"):

            userCreationResponse = "User already exists!!!"

            return {
        "statusCode": 409,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(userCreationResponse)
        }
            
        else:

            userCreationResponse = "Registration is successful!!!"

            
            return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(userCreationResponse)
        }
        
        pprint(userCreation, sort_dicts=False)
        
    elif (action  == "updateuser"):
        email = event.get("email")
        name = event.get("name")
        password = event.get("password")
        
    
        updateStatus = updateUser(email, name, password)
        

        
        if ( updateStatus == name):
            return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps("User Update is Successful!!!")
            }
        else:
            return {
            "statusCode": 409,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(updateStatus + "User Update has failed!!!")
            }

    
    elif (action == "login"):
        email = event.get("emailid")
        password = event.get("passwordvalue")
        lastlogin = event.get("lastlogin")
        
        validUser = validateUser(email, password, lastlogin)


        
        if validUser == "Unable to fetch details" :
            validUserResponse = "Invalid User!!!"
            return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(validUser + validUserResponse)
            }
        else:
            if ( (email == (validUser[0].get("email"))) and (password == validUser[0].get("password")) ):
            


                validUserResponse = "user exists"
    
                return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(validUserResponse)
                }
    
            else:
                validUserResponse = "Invalid User!!!"
                return {
                "statusCode": 404,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(validUserResponse)
                }

    elif (action == "searchuser"):
        email = event.get("email")

        
        readUser = retrieveUser(email)

        if readUser:

            pprint(readUser, sort_dicts=False)
            
            return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(readUser)
            }
        else:
            searchUserResponse = "Invalid User!!!"
            return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(searchUserResponse)
            }
        
    elif(action == "delete"):
        print("Attempting a conditional delete...")
        email = event.get("email")
        delete_response = deleteUser(email)

        if ((delete_response == "Email ID is not valid. ") or (delete_response == "Delete action failed. ")):
            return {
            "statusCode": 409,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(delete_response)
            }
        elif (delete_response.get("ResponseMetadata").get("HTTPStatusCode") == 200):

            pprint(delete_response, sort_dicts=False)
            return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps("User deletion is successful!!!")
            }
  
        else:
            return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps("User deletion has failed!!!")
            }
            

    else:
        print("nothing to do!")