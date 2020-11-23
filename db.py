# -*- coding: utf-8 -*-
"""
Created on Sun Sep 13 10:19:38 2020

@author: MUKESH
"""


import pymongo
from flask import jsonify

class Database:
        
    def __init__(self):
        self.establish_connection()
        
    def establish_connection(self):
        self.conn = pymongo.MongoClient('localhost', 27017)
        #self.conn = pymongo.MongoClient('mongodb+srv://mukesh:9600867918m@cluster0.j3b3g.mongodb.net/contacts?retryWrites=true&w=majority')

        self.db = self.conn['contacts']
        
    def getAllContacts(self):
        try:
            collection = self.db["contacts"]
            contacts = []
            for x in collection.find({}, {"_id": 0, "firstname": 1, "lastname": 1}):
                contacts.append(x)
            print(contacts)
            return jsonify(contacts)
        except Exception as error:
            return "Get All Contacts Failed from dB - " + str(error)
            
    def addNewContact(self,data):
        try:
            collection = self.db["contacts"]
            x = collection.insert_one(data)
            print(x.inserted_id)
        except Exception as error:
            return "Add Contacts Failed from dB - " + str(error)
        
    def deleteContact(self,data):
        try:
            myQuery = {"firstname": data}
            collection = self.db["contacts"]
            collection.delete_one(myQuery)
        except Exception as error:
            return "Delete Contacts Failed from dB - " + str(error)
        
    def updateExistingContact(self,prev_data, new_data):
        try:
            collection = self.db["contacts"]
            new_data = { "$set": new_data }
            collection.update_one(prev_data, new_data)
        except Exception as error:
            return "Update Contacts Failed from dB - " + str(error)
        
    def getContactByName(self, data):
        try:
            myQuery = {"firstname": data}
            collection = self.db["contacts"]
            for x in collection.find(myQuery, {"_id": 0}):
                return x
        except Exception as error:
            return "Get Contact by Name Failed from dB - " + str(error)
        
d = Database()
d.getAllContacts()
