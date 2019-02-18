import _ from 'lodash';
import React from 'react';
import Video from '../components/video';
import '../styles/index.scss';
import { Modal, Alert } from 'react-bootstrap';
import firebase from 'firebase';
import firebaseApp from '../firebase-config';
import Head from 'next/head'
class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleSubmitFor = this.handleSubmitFor.bind(this);

    this.state = this.initialState;
  }

  get initialState() {
    return {
      show: false,
      error: null,
      knowWhatTheyWant: null,
      name: null,
      contactNumber: null,
      email: null,
      showFinal: false,
      carType: null,
      purchaseType: null,
      year: null,
      make: null,
      model: null,
      miles: null,
      color: null,
      exteriorColor: null,
      interiorColor: null,
      options: null,
      usedCarPath: null,
      fromYear: null,
      toYear: null,
      maxMiles: null,
      image: null,
      preview: null
    };
  }

  handleClose() {
    this.setState(this.initialState);
  }

  handleShow(type) {
    this.setState({ show: type });
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleFile(e) {
    this.setState({
      image: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0])
    });
  }

  handleSubmitFor(e, resource) {
    const { state } = this;
    e.preventDefault();
    const resourceRef = firebaseApp.database().ref(resource);
    const resourcePackage = _.omitBy(state, _.isNil);
    const cleanResourcePackage = _.omit(resourcePackage, [
      'show',
      'showFinal',
      'image',
      'preview'
    ]);

    resourceRef
      .push({
        ...cleanResourcePackage,
        sent: firebase.database.ServerValue.TIMESTAMP
      })
      .then(res => {
        this.setState({
          show: 'success',
          error: null
        });
      })
      // not sure how to test whether or not this works
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  render() {
    let videos = [
      { label: 'Eight rules', src: 'https://www.youtube.com/embed/Hj8GA85ANz8'},
      { label: 'Eight rules', src: 'https://www.youtube.com/embed/Hj8GA85ANz8'},
      { label: 'Eight rules', src: 'https://www.youtube.com/embed/Hj8GA85ANz8'},
      { label: 'Eight rules', src: 'https://www.youtube.com/embed/Hj8GA85ANz8'}
    ];

    const { error, showFinal } = this.state;
    let bottomInfo;

    if (error) {
      ErrorAlert = (
        <React.Fragment>
          <Alert variant="danger">
            Uh oh, there's been a problem. Please check your responses or try
            again shortly.
          </Alert>
        </React.Fragment>
      );
    }

    if (showFinal) {
      bottomInfo = (
        <React.Fragment>
          <br />
          <p>We will respond within 5 minutes</p>
          <p>
            Hours of operation
            <br />
            M-F: 8-6
            <br />
            Saturday: 9-5
            <br />
            Sunday: 10-2
          </p>
        </React.Fragment>
      );
    }

    const { show } = this.state;
    let modalHeaderText;
    let modalForm;

    if (show == 'buy') {
      modalHeaderText = 'Buying a car?';
      const { knowWhatTheyWant } = this.state;
      let buyFields;
      if (knowWhatTheyWant === 'no') {
        let button;
        const { name, contactNumber, email } = this.state;
        if ((name, contactNumber, email)) {
          button = (
            <button
              className="btn btn-custom btn-block"
              onClick={e => this.handleSubmitFor(e, 'buyers')}
            >
              Submit
            </button>
          );
        }
        buyFields = (
          <React.Fragment>
           
            <div className="form-group row">
            
              {/* <div className="col-sm-12">
               <p className="first-btn-para">Editable content box:<br/>
               Not sure what you want ? That's ok! We'll go <br/>
               Our all the options so you can choose the<br/> right car that fits your needs.
               <br/>We do 1 of 1</p>
            </div> */}

              <label for="name" className="col-sm-2 control-label">
                Enter something
              </label>
              <div className="col-sm-10">
                <textarea
                  className=""
                  type="text"
                  id="options"
                  name="options"
                  value={this.state.options}
                  onChange={this.handleInput}
                />{' '}
                <br />
              </div>
              <br />
              <br />
              <br />

              <label for="name" className="col-sm-2 control-label ">
                Same 
              </label>
              <div className="col-sm-10">
                <input
                  className=""
                  type="text"
                  id="nameInput"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInput}
                />
              </div>
            </div>
            <div className="form-group row">
              <label for="contactNumber" className="col-sm-2 control-label">
                Contact Number
              </label>
              <div className="col-sm-10 ">
                <input
                  className=""
                  type="number"
                  id="contactNumberInput"
                  name="contactNumber"
                  value={this.state.contactNumber}
                  onChange={this.handleInput}
                />
              </div>
            </div>
            <div className="form-group row">
              <label for="email" className="col-sm-2 control-label">
                Email
              </label>
              <div className="col-sm-10">
                <input
                  className=""
                  type="email"
                  id="emailInput"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleInput}
                />
              </div>
            </div>
           
            {button}
        
          </React.Fragment>
        );
      } else if (knowWhatTheyWant === 'yes') {
        const { carType, purchaseType } = this.state;
        let purchaseTypeFields;
        let carFields;

        if (carType === 'new') {
          if (purchaseType) {
            let button;
            const {
              name,
              contactNumber,
              email,
              make,
              model,
              exteriorColor,
              interiorColor,
              options
            } = this.state;
            if (
              _.every(
                [
                  name,
                  contactNumber,
                  email,
                  make,
                  model,
                  exteriorColor,
                  interiorColor
                ],
                Boolean
              )
            ) {
              button = (
                <button
                  className="btn btn-custom btn-block mt-2"
                  onClick={e => this.handleSubmitFor(e, 'buyers')}
                >
                  Submit
                </button>
              );
            }
            carFields = (
              <React.Fragment>
                <div className="form-group row">
                  <label for="name" className="col-sm-2 control-label">
                    Enter something
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />{' '}
                    <br />
                  </div>
                  <br />
                  <br />
                  <br />

                  <label for="name" className="col-sm-2 col-form-label">
                    Make
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="makeInput"
                      name="make"
                      value={this.state.make}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Model
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="modelInput"
                      name="model"
                      value={this.state.model}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Exterior Color
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="exteriorColorInput"
                      name="exteriorColor"
                      value={this.state.exteriorColor}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Interior Color
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="interiorColorInput"
                      name="interiorColor"
                      value={this.state.interiorColor}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Options
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row ">
                  <label for="name" className="col-sm-2 col-form-label">
                    Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="nameInput"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Contact Number
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="number"
                      id="contactNumberInput"
                      name="contactNumber"
                      value={this.state.contactNumber}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="email"
                      id="emailInput"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">{button}</div>
              </React.Fragment>
            );
          }

          purchaseTypeFields = (
            <React.Fragment>
              <label className="form-check-label">
                How do you want to purchase it?
              </label>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="buyRadio"
                  name="purchaseType"
                  value="buy"
                  defaultChecked={this.purchaseType === 'buy'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">Buy</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="leaseRadio"
                  name="purchaseType"
                  value="lease"
                  defaultChecked={this.purchaseType === 'lease'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">Lease</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="financeRadio"
                  name="purchaseType"
                  value="finance"
                  defaultChecked={this.purchaseType === 'finance'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">Finance</label>
              </div>
              {carFields}
            </React.Fragment>
          );
        } else if (carType === 'used') {
          const { usedCarPath } = this.state;
          let usedCarFields;

          if (usedCarPath === 'inspectCar') {
            let button;
            const {
              name,
              contactNumber,
              email,
              year,
              make,
              model,
              miles,
              options
            } = this.state;
            if (
              _.every(
                [name, contactNumber, email, year, make, model, miles],
                Boolean
              )
            ) {
              button = (
                <button
                  className="btn btn-custom btn-block"
                  onClick={e => this.handleSubmitFor(e, 'buyers')}
                >
                  Submit
                </button>
              );
            }

            usedCarFields = (
              <React.Fragment>
                <div className="form-group row">
                  {/* <div className="col-sm-12">
                <p className="first-btn-para">
                Editable Content:<br/>
                A professional mechanik will go out and inspect<br/> the vehicle with you or on your behalf.<br/>
                -Computer hock up (making sure the systems ready and nothing has been reset
                -Test drive<br/>
                -Brakes,suspension,transmission,engine,(all fluids) <br/>
                -Body/paint work<br/>
                -History report INCLUDD
                
                  </p>
                  </div> */}

                  <label for="name" className="col-sm-2 col-form-label">
                    Enter something
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />{' '}
                    <br />
                  </div>
                  <br />
                  <br />
                  <br />

                  <label for="name" className="col-sm-2 col-form-label">
                    Add vin here
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="number"
                      id="makeInput"
                      name="year"
                      value={this.state.year}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="name" className="col-sm-2 col-form-label">
                    Make
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="makeInput"
                      name="make"
                      value={this.state.make}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Model
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="modelInput"
                      name="model"
                      value={this.state.model}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Miles
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="exteriorColorInput"
                      name="miles"
                      value={this.state.miles}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Other Info
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      placeholder="Link to site?"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row mt-2">
                  <label for="name" className="col-sm-2 col-form-label">
                    Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="nameInput"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Contact Number
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="number"
                      id="contactNumberInput"
                      name="contactNumber"
                      value={this.state.contactNumber}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="email"
                      id="emailInput"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                {button}
              </React.Fragment>
            );
          } else if (usedCarPath === 'findCar') {
            let button;
            const {
              name,
              contactNumber,
              email,
              fromYear,
              toYear,
              make,
              model,
              maxMiles,
              exteriorColor,
              interiorColor,
              budget,
              options
            } = this.state;
            if (
              _.every(
                [
                  name,
                  contactNumber,
                  email,
                  fromYear,
                  toYear,
                  make,
                  model,
                  maxMiles,
                  exteriorColor,
                  interiorColor,
                  budget
                ],
                Boolean
              )
            ) {
              button = (
                <button
                  className="btn btn-custom btn-block"
                  onClick={e => this.handleSubmitFor(e, 'buyers')}
                >
                  Submit
                </button>
              );
            }

            usedCarFields = (
              <React.Fragment>
                <div className="form-group row">
                  {/* <div className="col-sm-12">
                <p className="first-btn-para">
                Editable Content:<br/>
                Why waste time and money hunting for the car? Let us do it for<br/>
                you. Let us know what you are looking for and we'll go out<br/>
                Brakes,suspension,transmission,engine,(all fluids) <br/>
                and find it<br/>
                We work with dealers,wholesalers,auctions (We'll even find<br/>
                your car privately).Ask you will recieve!
                
                  </p>
                  <span> Year </span> <br/> 
                  </div> */}

                  <label for="name" className="col-sm-2 col-form-label">
                    Enter something
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />{' '}
                    <br />
                  </div>
                  <br />

                  <br />

                  {/* <span> Year </span> */}
                  <label for="name" className="col-sm-12 col-form-label">
                    {' '}
                    Year
                  </label>

                  <label for="name" className="col-sm-2 col-form-label">
                    {' '}
                    From
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      placeholder="2009"
                      type="number"
                      id="fromYearInput"
                      name="fromYear"
                      value={this.state.fromYear}
                      onChange={this.handleInput}
                    />
                  </div>
                  <label for="name" className="col-sm-2 col-form-label">
                    To
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      placeholder="2015"
                      type="number"
                      id="toYearInput"
                      name="toYear"
                      value={this.state.toYear}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="name" className="col-sm-2 col-form-label">
                    Make
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="makeInput"
                      name="make"
                      value={this.state.make}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Model
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="modelInput"
                      name="model"
                      value={this.state.model}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Max Miles
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="number"
                      id="exteriorColorInput"
                      name="maxMiles"
                      value={this.state.maxMiles}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Exterior Color
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="exteriorColorInput"
                      name="exteriorColor"
                      value={this.state.exteriorColor}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Interior Color
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="interiorColorInput"
                      name="interiorColor"
                      value={this.state.interiorColor}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Budget
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="budget"
                      name="budget"
                      value={this.state.budget}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Options Info
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      className=""
                      type="text"
                      id="options"
                      name="options"
                      placeholder="Additional info?"
                      value={this.state.options}
                      onChange={this.handleInput}
                    />
                  </div>
                </div> 
                {/* mt-5 */}
                <div className="form-group row">
                  <label for="name" className="col-sm-2 col-form-label">
                    Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="text"
                      id="nameInput"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    for="contactNumber"
                    className="col-sm-2 col-form-label"
                  >
                    Contact Number
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="number"
                      id="contactNumberInput"
                      name="contactNumber"
                      value={this.state.contactNumber}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="email" className="col-sm-2 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      className=""
                      type="email"
                      id="emailInput"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleInput}
                    />
                  </div>
                </div>
                {button}
              </React.Fragment>
            );
          }

          purchaseTypeFields = (
            <React.Fragment>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="buyRadio"
                  name="usedCarPath"
                  value="inspectCar"
                  defaultChecked={this.usedCarPath === 'inspectCar'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">
                  Have a used car in mind and want us to inspect?
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="leaseRadio"
                  name="usedCarPath"
                  value="findCar"
                  defaultChecked={this.usedCarPath === 'findCar'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">
                  Want us to find you the car?
                </label>
              </div>
              {usedCarFields}
            </React.Fragment>
          );
        }

        buyFields = (
          <React.Fragment>
            <div className="form-group">
              <label className=" form-check-label">
                What kind of car do you want to buy?
              </label>
              <br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="usedRadio"
                  name="carType"
                  value="used"
                  defaultChecked={this.carType === 'used'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">Used</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="newRadio"
                  name="carType"
                  value="new"
                  defaultChecked={this.carType === 'new'}
                  onChange={this.handleInput}
                />
                <label className="form-check-label">New</label>
              </div>
              <br />
              {purchaseTypeFields}
            </div>
          </React.Fragment>
        );
      }
      modalForm = (
        <React.Fragment>
          {error}
          
          <div className="form-group">
            <label className=" form-check-label">Know what you want?</label>
            <br />
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="inlineCheckbox1"
                name="knowWhatTheyWant"
                value="yes"
                defaultChecked={this.knowWhatTheyWant === 'yes'}
                onChange={this.handleInput}
              />
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="inlineCheckbox2"
                name="knowWhatTheyWant"
                value="no"
                defaultChecked={this.knowWhatTheyWant === 'no'}
                onChange={this.handleInput}
              />
              <label className="form-check-label">No</label>
            </div>
            {buyFields}
            {bottomInfo}
          </div>
        </React.Fragment>
      );
    } else if (show === 'sell') {
      modalHeaderText = 'Selling your car?';
      let sellBottomInfo;
      const {
        name,
        contactNumber,
        email,
        year,
        make,
        model,
        miles,
        image,
        options
      } = this.state;
      if (
        _.every([name, contactNumber, email, year, make, model, miles], Boolean)
      ) {
        sellBottomInfo = (
          <React.Fragment>
            <p>How it works:</p>
            <span>1. We will call you within 5 MINUTES</span>
            <br />
            <span>2. We will pick up the car TODAY</span>
            <button
              className="btn btn-custom btn-block"
              onClick={e => this.handleSubmitFor(e, 'sell')}
            >
              Submit
            </button>
          </React.Fragment>
        );
      }
      modalForm = (
        <React.Fragment>
          {error}
          <div className="form-group row">
            <label for="name" className="col-sm-2 col-form-label">
              Year
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="number"
                id="makeInput"
                name="year"
                value={this.state.year}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="name" className="col-sm-2 col-form-label">
              Make
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="text"
                id="makeInput"
                name="make"
                value={this.state.make}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="contactNumber" className="col-sm-2 col-form-label">
              Model
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="text"
                id="modelInput"
                name="model"
                value={this.state.model}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="email" className="col-sm-2 col-form-label">
              Miles
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="number"
                id="exteriorColorInput"
                name="miles"
                value={this.state.miles}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="email" className="col-sm-2 col-form-label">
              Upload Picture
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="file"
                id="exteriorColorInput"
                name="image"
                onChange={this.handleFile}
              />
            </div>
            <div className="col-sm-10">
              <img class="img-fluid" src={this.state.preview} />
            </div>
          </div>
          <div className="form-group row">
            <label for="email" className="col-sm-2 col-form-label">
              Other Info
            </label>
            <div className="col-sm-10">
              <textarea
                className=""
                type="text"
                id="options"
                name="options"
                placeholder="Notes"
                value={this.state.options}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="name" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="text"
                id="nameInput"
                name="name"
                value={this.state.name}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="contactNumber" className="col-sm-2 col-form-label">
              Contact Number
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="number"
                id="contactNumberInput"
                name="contactNumber"
                value={this.state.contactNumber}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="email" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                className=""
                type="email"
                id="emailInput"
                name="email"
                value={this.state.email}
                onChange={this.handleInput}
              />
            </div>
          </div>
          {sellBottomInfo}
        </React.Fragment>
      );
    } else if (show === 'repair') {
      modalHeaderText = 'Need auto repair/body work?';
      const { name, contactNumber, email, showFinal } = this.state;
      let repairCopy;
      if (name && contactNumber && email && !showFinal) {
        this.setState({
          showFinal: true
        });
      }
      if (name && contactNumber && email) {
        repairCopy = (
          <React.Fragment>
            <button
              className="btn btn-custom btn-block"
              onClick={e => this.handleSubmitFor(e, 'repairs')}
            >
              Submit
            </button>
          </React.Fragment>
        );
      }
      modalForm = (
        <React.Fragment>
          {error}
          <p>
            We live in a capitalist society. Make as much money as quickly as
            possible. SELL SELL SELL!
          </p>

          <p>
            Dealership service departments have commission based employees. The
            more they sell (whether you need it or not, the more they make).
            Show owners/managers do the same thing to maximize their profits. If
            you don’t know cars, you’re most likely overpaying (in most cases,
            by ALOT). These shops are not your friends, I repeat they are not
            your friends. A 20 year relationship and someone being nice to you
            does not make them friends. Don’t believe me? Go in for work, send
            me the receipt and I’ll prove they’re not your friends.
          </p>

          <p>
            How the service works: You bring your car in and get a receipt for
            work that needs to be done. We’ll confirm the parts costs and labor
            hours are correct.
          </p>
          <div className=" form-group row">
            <label for="name" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                className="form-check-input"
                type="text"
                id="nameInput"
                name="name"
                value={this.state.name}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="contactNumber" className="col-sm-2 col-form-label">
              Contact Number
            </label>
            <div className="col-sm-10">
              <input
                className="form-check-input res"
                type="number"
                id="contactNumberInput"
                name="contactNumber"
                value={this.state.contactNumber}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="email" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                className="form-check-input res"
                type="email"
                id="emailInput"
                name="email"
                value={this.state.email}
                onChange={this.handleInput}
              />
            </div>
          </div>
          {repairCopy}
          {bottomInfo}
        </React.Fragment>
      );
    } else if (show === 'success') {
      modalForm = (
        <React.Fragment>
          <Alert variant="success">
            <strong>Your request has been submitted!</strong>
            <br />
            Thank you for contacting us. We'll get back to you ASAP :)
          </Alert>
        </React.Fragment>
      );
    }

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        {/*home section*/}
        <section className="back-img ">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-xl-3 offset-xl-2 sm-12 offset-sm-3">
                <div className="home-contain">
                  <div className="fadeInLeft-land-caption">
                    <img
                      src="/static/images/what-what-auto-logo.png"
                      alt="logo"
                      className="main-logo img-fluid"
                    />
                    <div className="row">
                      <div className="col">
                        <button
                          onClick={() => this.handleShow('buy')}
                          className="btn btn-custom btn-block" 
                        >
                          I need to buy a car
                        </button>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col">
                        <button
                          onClick={() => this.handleShow('sell')}
                          className="btn btn-custom btn-block"
                        >
                          I need to sell my car
                        </button>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col">
                        <button
                          onClick={() => this.handleShow('repair')}
                          className="btn btn-custom btn-block"
                        >
                          I need auto repair/body work{' '}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-6 offset-xl-1">
                <div className="home-contain fadeIn-mac">
                  <div className="embed-responsive embed-responsive-16by9">
                    {/* <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/Hj8GA85ANz8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                  </div>
                </div>
              </div>
            </div>

            {/* modal */}
            <div className="dep">
            <Modal 
          
            size="lg"
            show={this.state.show} 
            onHide={this.handleClose}
            // dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title-lg"
           >
              <Modal.Header closeButton>
                <Modal.Title
                size="lg" 
                id="example-custom-modal-styling-title-lg">
                 {modalHeaderText} 
                 </Modal.Title>
              </Modal.Header>
              <Modal.Body
              size="lg">
                <form>{modalForm}</form>
              </Modal.Body>
            </Modal>
            </div>
            {/* modal end */}
          </div>
        </section>

        <Video videos={videos} />            
      </div>
    );
  }
}

export default App;
