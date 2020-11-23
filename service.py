# -*- coding: utf-8 -*-
"""
Created on Sun Sep 13 16:46:27 2020

@author: MUKESH
"""


from db import Database

class Service():
    
    def __init__(self):
        self.myDb = Database()

    def updateContact(self, request_body):
        try:
            self.myDb.updateExistingContact(request_body['prev_data'], request_body['new_data'])
            return "Successfully updated"
        except Exception as error:
            return "Updation Failed - " + str(error)
        
    def addNewContact(self, data):
        try:
            self.myDb.addNewContact(data)
            return "Successfully added"
        except Exception as error:
            return "Updation Failed - " + str(error)
        
    def deleteContact(self, data):
        try:
            print(data)
            self.myDb.deleteContact(data)
            return "Succesfully deleted"
        except Exception as error:
            return "Deletion Failed - " + str(error)
        
    def getAllContacts(self):
        try:
            return self.myDb.getAllContacts()
        except Exception as error:
            return "Get All Contacts Failed - " + str(error)
    
    def getContactByName(self, data):
        try:
            return self.myDb.getContactByName(data)
        except Exception as error:
            return "Get All Contacts Failed - " + str(error)