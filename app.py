# -*- coding: utf-8 -*-
"""
Created on Sun Sep 13 15:13:55 2020

@author: MUKESH
"""

from flask import Flask, request
from flask_restful import Api, Resource

from service import Service 

app = Flask(__name__)
api = Api(app)


class CreateContact(Resource):
    def post(self):
        print(Resource)
        request_body = request.get_json()
        service = Service()
        return service.addNewContact(request_body)
             
class UpdateContact(Resource):
    def post(self):
        request_body = request.get_json()
        service = Service()
        return service.updateContact(request_body)
        
class DeleteContact(Resource):
    def delete(self,firstname):
        print(firstname)
        service = Service()
        return service.deleteContact(firstname)
        
class GetAllContacts(Resource):
    def get(self):
        service = Service()
        return service.getAllContacts()
        
class GetContactByName(Resource):
    def get(self, firstname):
        print(firstname)
        service = Service()
        return service.getContactByName(firstname)


api.add_resource(CreateContact, '/createcontact')
api.add_resource(UpdateContact, '/updateContact')
api.add_resource(DeleteContact, '/deletecontact/<string:firstname>')
api.add_resource(GetAllContacts, '/getallcontacts')
api.add_resource(GetContactByName, '/getcontact/<string:firstname>')


if __name__ == '__main__':
    app.run()