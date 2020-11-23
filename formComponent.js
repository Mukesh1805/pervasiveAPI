import React, { Component } from 'react';
import { Row, Button } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from 'axios';
import { baseURL } from './baseURL';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val)) && (val.length === 10);
const validEmail = (val) => { if(val) { if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)){ return true}; } else{ return true; } };

class Form extends Component{
    constructor(props){
        super(props);

        //modify to accept props
        this.state = {
            contactDetails: {},
            firstname: props.firstname ? props.firstname : '',
            lastname: '',
            mobile: '',
            email: '',
            dob: '',
            notes: '',
            validDate: true,
            isNew: props.isNew,
            isNewFormModalOpen: false,
            isEditFormModalOpen: false
        };


        if(this.props.isNew === "true"){
            this.state.isNewFormModalOpen = true;
        }
        else{
            this.state.isEditFormModalOpen = true;
            var url = baseURL;
            url = url.concat('getcontact/');
            url = url.concat(props.firstname);

            axios.get(url)
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        contactDetails: res.data
                    });
                    this.setState({
                        lastname: this.state.contactDetails.lastname ? this.state.contactDetails.lastname : '',
                        mobile: this.state.contactDetails.mobile ? this.state.contactDetails.mobile : '',
                        email: this.state.contactDetails.email ? this.state.contactDetails.email : '',
                        notes: this.state.contactDetails.notes ? this.state.contactDetails.notes : '',
                        dob: this.state.contactDetails.dob ? this.state.contactDetails.dob : '',
                    });
                }
                else{
                    alert(res.statusText);
                }
            });
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.toggleNewFormModal = this.toggleNewFormModal.bind(this);
        this.toggleEditFormModal = this.toggleEditFormModal.bind(this);
    }

    toggleEditFormModal(){
        this.setState({
            isEditFormModalOpen: !this.state.isEditFormModalOpen
        });
    }

    toggleNewFormModal(){
        this.setState({
            isNewFormModalOpen: !this.state.isNewFormModalOpen
        });
    }

    handleSubmit(values){
        var url = baseURL;
        if(this.props.isNew === "true"){
            //create api
            url = url.concat('createcontact');

            axios.post(url, values)
            .then(res => {
                if(res.status === 200){
                    //res.data has the value
                    this.props.getAllContacts();
                    this.toggleNewFormModal();
                }
                else{
                    alert(res.statusText);
                }
            });
        }
        else{
            //update api
            url = url.concat('updateContact');

            var prev_data = this.state.contactDetails; 
            var new_data = values;

            axios.post(url, { prev_data , new_data })
            .then(res => {
                if(res.status === 200){
                    //res.data has the value
                    console.log(res.data);
                    this.props.getAllContacts();
                    this.toggleEditFormModal();
                }
                else{
                    alert(res.statusText);
                }
            });
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleChange(date){
        if(new Date() > date){
            this.setState({
                dob: date,
                validDate: true
            });
        }
        else{
            this.setState({
                validDate: false
            });
            alert('Please pick a valid date of birth');
        }
    }

    render(){
        var contactForm = <div className="container">
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Control.text model=".firstname" id="firstname" name="firstname" 
                                        placeholder="First Name*" className="form-control"
                                        value={this.state.firstname} onChange={this.handleInputChange}
                                        validators={{ required, minLength: minLength(3), maxLength: maxLength(15), }} />
                                    <Errors className="text-danger" model=".firstname"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }} />
                                </Row>
            
                                <Row className="form-group">
                                    <Control.text model=".lastname" id="lastname" name="lastname" 
                                        placeholder="Last Name" className="form-control"
                                        value={this.state.lastname} onChange={this.handleInputChange}
                                        validators={{ maxLength: maxLength(15), }} />
                                    <Errors className="text-danger" model=".lastname"
                                        show="touched"
                                        messages={{
                                            maxLength: 'Must be 15 characters or less'
                                        }} />
                                </Row>
            
                                <Row className="form-group">
                                    <Control.text model=".mobile" id="mobile" name="mobile" 
                                        placeholder="Mobile Number*" className="form-control"  
                                        validators={{
                                            required, isNumber
                                        }} value={this.state.mobile} onChange={this.handleInputChange}/>
                                    <Errors 
                                        className="text-danger"
                                        model=".mobile"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            isNumber: 'Must be a number of 10 digits'
                                        }} />
                                </Row>
            
                                <Row className="form-group">
                                    <Control.text model=".email" id="email" name="email" 
                                        placeholder="E-mail" className="form-control" 
                                        validators={{ validEmail }} value={this.state.email} 
                                        onChange={this.handleInputChange}/>
                                    <Errors className="text-danger" model=".email"
                                        show="touched"
                                        messages={{
                                            validEmail: 'Invalid Email Address'
                                        }} />
                                </Row>
            
                                <Row className="form-group">
                                    <DatePicker
                                        selected={this.state.dob}
                                        onChange={this.handleChange}
                                    />
                                </Row>
            
                                <Row className="form-group">
                                    <Control.textarea model=".notes" id="notes" name="notes" rows="4" 
                                        placeholder="Notes" className="form-control" value={this.state.notes}
                                        onChange={this.handleInputChange}/>
                                </Row>
            
                                {this.props.isNew === "true" ? 
                                    <Button type="submit" value="submit" color="primary"> Add to Contacts </Button> :
                                    <Button type="submit" value="submit" color="primary"> Update Existing Contact </Button> 
                                }

                            </LocalForm>
                        </div>;

        var renderNewFormModal = <div className="container">
                                    <Modal isOpen={this.state.isNewFormModalOpen} toggle={this.toggleNewFormModal}>
                                        <ModalHeader toggle={this.toggleNewFormModal}> Add new Contact! </ModalHeader>
                                        <ModalBody> 
                                            {contactForm}
                                        </ModalBody>
                                    </Modal>
                                </div>;

        var renderEditFormModal = <div className="container">
                                    <Modal isOpen={this.state.isEditFormModalOpen} toggle={this.toggleEditFormModal}>
                                        <ModalHeader toggle={this.toggleEditFormModal}> Edit Existing Contact! </ModalHeader>
                                        <ModalBody> 
                                            {contactForm}
                                            <p className="text-danger"> Should alter the firstname and mobile number fields! (Can have same values)</p>
                                        </ModalBody>
                                    </Modal>
                                </div>;
        
        return(
            <div>
                {this.props.isNew === "true" ? renderNewFormModal : renderEditFormModal}
            </div>
        );
    }
}

export default Form;