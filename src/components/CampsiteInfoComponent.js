import React, { Component } from "react";
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle,
     Breadcrumb, BreadcrumbItem, Button, Modal, Row, Label, Col, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from "react-router-dom"
import { Control, LocalForm, Errors } from "react-redux-form"
import { Loading } from "./LoadingComponent";
import {baseUrl} from "../shared/baseUrl"
import {FadeTransform, Fade, Stagger} from "react-animation-components"

const required = val => val && val.length
const maxLength = len => val => !val || (val.length <= len)
const minLength = len => val => val && (val.length >= len)

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
        <div className="container">
            <div className="row">
                <Loading/>
            </div>
        </div>
        )
    }
    if (props.errMess) {
        return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        </div>
        )
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        )
        }
        else {
            return (<div></div>)
        }
    }


function RenderCampsite({campsite}) {
    return(
        <div className="col-md-5 m-1">
            <FadeTransform 
            in
            transformProps ={{
                exitTransform: 'scale(0.5) translateY(50%)'
            }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    )
}

function RenderComments({comments, postComment, campsiteId}) {
    if(comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                {comments.map(comment => {
                    return(
                        <Fade in key={comment.id}>
                            <div>
                                <p>{comment.text}</p>
                                <p>
                                    {comment.author}
                                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                </p>
                            </div>
                        </Fade>
                    )
                })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment}/>
            </div>
        )
    }
    <div></div>
}

class CommentForm extends Component{
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this) 
        this.toggleModal = this.toggleModal.bind(this)
        this.state={
            isModalOpen: false,
            author: "",
            rating: 5,
            touched: {
                author: false
                }
        }

    }    
    handleSubmit(values) {
        this.toggleModal()
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text)
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    render() {
        return (
                <>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <Label htmlFor="rating" md={12}>Rating</Label>
                                            <Control.select
                                                className="form-control"
                                                model=".rating"
                                                id="rating" 
                                                name="rating"
                                                defaultValue={1}>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                    </div>
                                    <div className="form-group">
                                        <Label htmlFor="author" md={12}>Your Name</Label>
                                            <Control.text model=".author" id="author" name="author"
                                                placeholder="Your Name"
                                                className="form-control"
                                                validators={{
                                                    required,
                                                    minLength: minLength(2),
                                                    maxLength: maxLength(15)
                                                }}
                                            />
                                            <Errors
                                                className='text-danger'
                                                model=".author"
                                                show="touched"
                                                component="div"
                                                messages ={{
                                                    required: "Required",
                                                    minLength: "Must be at least 2 characters.",
                                                    maxLength: "Must be 15 characters or less."
                                                }} />
                                        </div>
                                    <div className="form-group">
                                        <Label htmlFor="text" md={12}>Comment</Label>
                                            <Control.textarea model=".text" id="text" name="text"
                                                rows="6"
                                                className="form-control"/>
                                    </div>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                    </Modal>
                    <Button type="submit" value="submit" outline className="fa fa-lg fa-pencil"
                     onClick={this.toggleModal}>
                        Submit Comment
                    </Button>
                </>
        )
    }
}




export default CampsiteInfo;

