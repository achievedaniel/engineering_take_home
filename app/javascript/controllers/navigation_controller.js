import { Controller } from "@hotwired/stimulus"
import React from "react";
import ReactDOM from "react-dom";
import Home from "../components/BuildingsList";
import New from "../components/BuildingForm";
import Update from "../components/BuildingUpdate";

export default class extends Controller {
  static targets = ["container"]

  static values = {
    clientid: Number,
    buildingid: Number
  }

  connect() {
    this.renderHome();
  }

  renderHome() {
    ReactDOM.render(<Home />, this.containerTarget);
  }


  renderNew() {
    const clientid = event.target.dataset.client
    ReactDOM.render(<New clientid={clientid} />, this.containerTarget);
  }

  renderUpdate() {
    const building = event.target.dataset.building
    const clientid = event.target.dataset.client
    console.log(building)
    console.log(clientid)
    ReactDOM.render(<Update clientid={clientid} buildingid={building}  onSubmit={this.Update}/>, this.containerTarget);
  }

  renderDestroy() {
    const building = event.target.dataset.building
    const clientid = event.target.dataset.client
    console.log(building)
      fetch(`/buildings/${building}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ building })
    })
    .then(response => {
      if (response.ok) {
          console.log(`Building ${building} deleted successfully`);
          window.location.reload();
      } else {
          console.error('Failed to delete the building');
      }
  })
  .catch(error => {
      console.error('Error during deletion:', error);
  });
  }

  disconnect() {
    ReactDOM.unmountComponentAtNode(this.containerTarget);
  }
}