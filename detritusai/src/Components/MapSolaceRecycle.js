/*global google*/

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './NavBar';

import messaging from '../Messaging';
import Paho from 'paho-mqtt';

  export class MapSolaceRecycle extends Component {
    //populate with solace data
    constructor(props){
        super(props);
        this.state = {
            connected: false,
            messages: ''
        }


        messaging.register(this.handleMessage.bind(this));

        messaging.connectWithPromise().then(response => {
            console.log("Succesfully connected to Solace Cloud.", response);
            messaging.subscribe("DetritusAI/UofT/State/RecyclingVol");

            this.setState({
                connected: true,
                messages: this.state.messages
            });
        }).catch(error => {
            console.log("Unable to establish connection with Solace Cloud, see above logs for more details.", error);
        });
    };


    //render the map and markers
    render() {
      return (

         this.state.messages



        //  <div>
        //     {this.state.messages.map((message,index) => {
        //         //var str = message.getText();
        //         return this.state.messages;
        //     })}
             

        //  </div>
      )

    }

    //------------------------------SOLACE FUNCTIONS----------------------------------

    handleMessage(message) {
		this.setState(state => {

        const messages = message.payloadString;
			//const messages = state.messages.concat(message.payloadString);
			return {
				messages,
				connected: state.connected,
			};
		  });
    }
    

	handleSendClick() {
		let message = new Paho.Message(JSON.stringify({text: "Hello"}));
		message.destinationName = "exampletopic";
		messaging.send(message);
	}

	handleConnectClick() {
		if (this.state.connected) {
			messaging.disconnect();
			this.setState({
				connected: false,
				messages: this.state.messages
			});
		} else {
			messaging.connectWithPromise().then(response => {
				console.log("Succesfully connected to Solace Cloud.", response);
				messaging.subscribe("exampletopic");
				this.setState({
					connected: true,
					messages: this.state.messages
				});
			}).catch(error => {
				console.log("Unable to establish connection with Solace Cloud, see above logs for more details.", error);
			});
		}
	}

}

export default MapSolaceRecycle;