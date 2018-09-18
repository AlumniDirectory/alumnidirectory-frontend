import React, { Component } from "react";
import {
  Container,
  Grid,
  Image,
  state,
  Accordion,
  Icon,
  List
} from "semantic-ui-react";

import axios from "axios";

import JobsList from "./JobsList";
import Footer from "./footer";

class job_details extends Component {
  state = {};

  componentDidMount = async () => {
    await axios.get(`http://localhost:3000/jobDetails`).then(res => {
      console.log(res.data.data);
      this.setState({ jobs: res.data.data });
    });
  };

  render() {
    if (!this.state.jobs) {
      return null;
    }

    return (
      <div className="jobDetails">
        <Container>
          <div>
            <h1 className="jobDetails-title">Avaible Jobs</h1>
          </div>
          <div className="jobDetails-isi">
            {this.state.jobs.map(jobs => (
              <JobsList data={jobs} />
            ))}
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default job_details;