import React, { Component } from 'react';
import { Card, CardBody, Button,
     Modal, ModalBody, ModalHeader } from 'reactstrap';

import Form from './formComponent';
import ViewContact from './viewContactComponent';

import axios from 'axios';
import { baseURL } from './baseURL';

class Home extends Component{
    constructor(props){
        super(props);

        this.state = {
            selectedFirstName: '',
            selectedLastName: '',
            isNewFormModalOpen: false,
            isViewModalOpen: false,
            isConfirmationModalOpen: false,
            isEditFormModalOpen: false,
            contacts: []
        };

        var url = baseURL;
        url = url.concat('getallcontacts');

        axios.get(url)
        .then(res => {
            if(res.status === 200){
                //res.data has the value
                console.log(res.data);
                this.setState({
                    contacts : res.data,
                });
                //return this.state.contacts.length;
            }
            else{
                alert(res.statusText);
                //return 0;
            }
        });

        this.toggleNewFormModal = this.toggleNewFormModal.bind(this);
        this.toggleDisplayModal = this.toggleDisplayModal.bind(this);
        this.toggleConfirmationModal = this.toggleConfirmationModal.bind(this);
        this.toggleEditFormModal = this.toggleEditFormModal.bind(this);

        this.deleteContact = this.deleteContact.bind(this);
        this.getAllContacts = this.getAllContacts.bind(this);
        this.getParticularContactDetails = this.getParticularContactDetails.bind(this);
    }
    
    //Dummy variable to send as props for form component based on edit or add new option
    contact = {
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        dob: new Date(),
        notes: '',
    };

    //To get all contacts
    getAllContacts(){
        var url = baseURL;
        url = url.concat('getallcontacts');

        axios.get(url)
        .then(res => {
            if(res.status === 200){
                //res.data has the value
                this.setState({
                    contacts: res.data
                });
                return this.state.contacts.length;
            }
            else{
                alert(res.statusText);
                return 0;
            }
        });
    }

    getParticularContactDetails(dummy){
        var url = baseURL;
        url = url.concat('getcontact/');
        url = url.concat(dummy.firstname);

        axios.get(url)
        .then(res => {
            if(res.status === 200){
                //console.log(res.data);
                this.contact.mobile = res.data.mobile ? res.data.mobile : "";
                this.contact.email = res.data.email ? res.data.email : "";
                this.contact.notes = res.data.notes ? res.data.notes : "";
                this.contact.dob = res.data.dob ? res.data.dob : "";
            }
            else{
                alert(res.statusText);
            }
        });
    }

    //Modal to add new contact
    toggleNewFormModal(){
        this.setState({
            isNewFormModalOpen: !this.state.isNewFormModalOpen
        });
        this.contact = {
            firstname: '',
            lastname: '',
            mobile: '',
            email: '',
            dob: new Date(),
            notes: '',
        };
    }

    //Modal to display contact details
    toggleDisplayModal(firstname, lastname){
        this.contact.firstname = firstname;
        //this.contact.lastname = lastname;
        this.setState({
            isViewModalOpen: !this.state.isViewModalOpen
        });
    }

    //Confirmation modal to delete values
    toggleConfirmationModal(firstname, lastname){
        this.setState({
            isConfirmationModalOpen: !this.state.isConfirmationModalOpen,
            selectedFirstName: firstname,
            selectedLastName: lastname
        });
    }
    //Editable form with filled values
    toggleEditFormModal(firstname, lastname){
        this.contact.firstname = firstname;
        this.setState({
            isEditFormModalOpen: !this.state.isEditFormModalOpen
        });
    }

    deleteContact(){
        var url = baseURL;
        url = url.concat('deletecontact/');
        url =url.concat(this.state.selectedFirstName);

        axios.delete(url)
        .then(res => {
            if(res.status === 200){
                this.toggleConfirmationModal();
                this.getAllContacts();
            }
            else{
                alert(res.statusText);
            }
        });
    }

    render(){
        var renderCard = this.state.contacts.length > 0 ? this.state.contacts.map((contacts) => {
            return (
                <div key={contacts.id} className="row">
                    <Card className="contact-card">
                        <CardBody>
                                <div className="row"> 
                                    <div className="col-3"> 
                                        <p onClick={() => this.toggleDisplayModal(contacts.firstname, contacts.lastname)}> {contacts.firstname} </p>
                                    </div>
                                    <div className="col-3"> {contacts.lastname} </div>
                                    <div className="col-3"> 
                                        <span className="fa fa-pencil-square-o" onClick={() => this.toggleEditFormModal(contacts.firstname, contacts.lastname)}> </span>
                                    </div>
                                    <div className="col-3">
                                        <span className="fa fa-trash" onClick={() => this.toggleConfirmationModal(contacts.firstname, contacts.lastname)}> </span>
                                    </div>
                                </div>
                        </CardBody>
                    </Card>
                </div>
            );
        }) : null ;

        var renderConfirmationModal = <div className="container">
                                        <Modal  isOpen={this.state.isConfirmationModalOpen} toggle={this.toggleConfirmationModal}>
                                            <ModalHeader toggle={this.toggleConfirmationModal}> Delete Contact! </ModalHeader>
                                            <ModalBody>
                                                <p> Are you sure to delete contact ? </p>
                                                <Button outline onClick={this.toggleConfirmationModal}> Cancel </Button>
                                                <Button outline onClick={this.deleteContact}> OK </Button> 
                                            </ModalBody>
                                        </Modal>
                                    </div>;
        return(
            <div className="container">
                <div className="app">
                    <div  className="row">
                        <div className="mr-auto">
                            <h1> Contacts </h1>
                        </div>
                        <div className="ml-auto">
                            <br/>
                            <Button outline className="fa fa-plus" aria-hidden="true" onClick={this.toggleNewFormModal}> Create New Contact </Button>
                        </div>
                    </div>
                    <hr/>
                </div>
                {renderCard}

                {this.state.isNewFormModalOpen ? <Form contact={this.contact} isNew="true" getAllContacts={this.getAllContacts}/> : null}
                {this.state.isViewModalOpen ? <ViewContact firstname={this.contact.firstname} isOpen = {true} /> : null}
                {this.state.isConfirmationModalOpen ? renderConfirmationModal : null}
                {this.state.isEditFormModalOpen ? <Form firstname={this.contact.firstname} isNew="false" getAllContacts={this.getAllContacts}/> : null}
            </div>
        );
    }
}

export default Home;