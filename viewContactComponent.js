import React, { Component } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import axios from 'axios';
import { baseURL } from './baseURL';

class ViewContact extends Component{
    constructor(props){
        super(props);

        this.state = {
            isViewModalOpen: props.isOpen,
            contactDetails: {},
            renderView: false
        };

        var url = baseURL;
        url = url.concat('getcontact/');
        url = url.concat(props.firstname);

        axios.get(url)
        .then(res => {
            if(res.status === 200){
                console.log(res.data);
                this.setState({
                    contactDetails: res.data,
                    renderView: true
                });
            }
            else{
                alert(res.statusText);
            }
        });

        console.log(props);
        console.log(this.state);

        this.toggleDisplayModal = this.toggleDisplayModal.bind(this);
        this.getParticularContactDetails = this.getParticularContactDetails.bind(this);
    }

    contact = {
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        dob: '',
        notes: '',
    };

    getParticularContactDetails(dummy){
        var url = baseURL;
        url = url.concat('getcontact/');
        url = url.concat(dummy.firstname);

        axios.get(url)
        .then(res => {
            if(res.status === 200){
                //console.log(res.data);
                this.setState({
                    contactDetails: res.data,
                    renderView: true
                });
            }
            else{
                alert(res.statusText);
            }
        });
    }

    //Modal to display contact details
    toggleDisplayModal(){
        //this.contact.firstname = this.props.contact.firstname;
        //this.contact.lastname = this.props.contact.lastname;

        var dummy = {"firstname": this.props.firstname};
        this.getParticularContactDetails(dummy);
        
        this.setState({
            isViewModalOpen: !this.state.isViewModalOpen
        });
    }

    render(){
        var contactDetails = <div className="container">
                                    <div className="app">
                                        <div className="row">
                                            <div className="col-6">
                                                <span> First Name : {this.state.contactDetails.firstname ? this.state.contactDetails.firstname : null} </span>
                                            </div>

                                            <div className="col-6">
                                                <p> Last Name :{this.state.contactDetails.lastname ?  this.state.contactDetails.lastname: null} </p>
                                            </div>
                                        </div>
    
                                        <div className="row">
                                            <div className="col">
                                                <p> Email : {this.state.contactDetails.email ? this.state.contactDetails.email : null} </p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <p> Date of Birth : {this.state.contactDetails.dob ? this.state.contactDetails.dob.toISOString().slice(0,10) : null} </p>
                                            </div>
                                        </div>
            
                                        <div className="row">
                                            <div className="col">
                                                <p> Mobile : {this.state.contactDetails.mobile ? this.state.contactDetails.mobile : null} </p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <p> Notes : {this.state.contactDetails.notes ? this.state.contactDetails.notes : null}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>;
        var renderViewModal = <div className="container">
                                <Modal isOpen={this.state.isViewModalOpen} toggle={this.toggleDisplayModal}>
                                    <ModalHeader toggle={this.toggleDisplayModal}> View Contact! </ModalHeader>
                                    <ModalBody> 
                                        {contactDetails}
                                    </ModalBody>
                                </Modal>
                            </div>;
        //console.log(this.state.contactDetails);
        return(
            <div>
                {renderViewModal}
            </div>
        );
    }
}

export default ViewContact;