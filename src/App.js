import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Menu,
  Button,
  Container,
  Label,
  Image,
  Dimmer,
  Header,
  Icon
} from "semantic-ui-react";
import axios from "axios";

import Home from "./pages/home";
import Info from "./pages/info";
import Gallery from "./pages/gallery";
import AboutUs from "./pages/aboutus";
import LoginForm from "./pages/login-signup";
import newPassword from "./pages/newPassword";
import ProfileStudent from "./pages/profileStudent";
import job_details from "./pages/job_details";

class App extends Component {
  state = { activeItem: "home", isAuthenticated: false, passwordWrong: false };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  login = async (email, password) => {
    await axios
      .post(`${process.env.REACT_APP_IMPACTALUMNI}/students/login`, {
        email: email,
        password: password
      })
      .then(res => {
        console.log(res);
        if (res.data.token) {
          localStorage.token = res.data.token;
          localStorage.user_id = res.data.user.id;
          this.setState({
            isAuthenticated: true,
            profile: res.data.user
          });
        } else {
          console.log("error");
          this.setState({
            passwordWrong: true
          });
        }
      });
  };

  componentWillMount = async () => {
    if (localStorage.getItem("token")) {
      await axios
        .post(`${process.env.REACT_APP_IMPACTALUMNI}/students/decode_token`, {
          token: localStorage.getItem("token")
        })
        .then(async res => {
          console.log(res.data);
          if (res.data.user) {
            await this.setState({
              isAuthenticated: true,
              profile: res.data.user
            });
          }
        });
    }
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    this.setState({
      isAuthenticated: false
    });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Router>
        <div>
          <Container>
            {/* navbar */}
            <div className="navbar">
              <Menu secondary>
                <Menu.Item
                  icon="home"
                  as={Link}
                  to="/"
                  name="home"
                  active={activeItem === "home"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  icon="book"
                  as={Link}
                  to="/info"
                  name="Info"
                  active={activeItem === "Info"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  icon="photo"
                  as={Link}
                  to="/gallery"
                  name="Gallery"
                  active={activeItem === "Gallery"}
                  onClick={this.handleItemClick}
                />
                {this.state.isAuthenticated ? (
                  <Menu.Item
                    icon="handshake"
                    as={Link}
                    to="/job_details"
                    name="Job Details"
                    active={activeItem === "Job Details"}
                    onClick={this.handleItemClick}
                  />
                ) : null}
                <Menu.Item
                  icon="users"
                  as={Link}
                  to="/aboutus"
                  name="About Us"
                  active={activeItem === "About Us"}
                  onClick={this.handleItemClick}
                />

                <Menu.Menu position="right">
                  {this.state.isAuthenticated ? (
                    <Label
                      position="right"
                      as={Link}
                      onClick={this.forceUpdate}
                      to={`/profile/${this.state.profile.id}`}
                    >
                      <Image
                        circular
                        spaced="right"
                        src={`${
                          process.env.REACT_APP_IMPACTALUMNI
                        }/assets/foto/${this.state.profile.foto}`}
                      />
                      Welcome 😘 {this.state.profile.fullName}
                    </Label>
                  ) : null}
                  {this.state.isAuthenticated ? (
                    <Button
                      inverted
                      color="red"
                      as={Link}
                      to="/"
                      onClick={this.logout}
                    >
                      logout
                    </Button>
                  ) : (
                    <Button inverted color="red" as={Link} to="/login">
                      Log In / Sign Up
                    </Button>
                  )}
                </Menu.Menu>
              </Menu>
            </div>
          </Container>
          <Route exact path="/" component={Home} />
          <Route path="/info" component={Info} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/aboutus" component={AboutUs} />
          <Route
            path="/login"
            render={props => (
              <LoginForm
                isAuthenticated={this.state.isAuthenticated}
                login={this.login}
                {...props}
              />
            )}
          />
          <Route path="/signup/:token" component={newPassword} />
          <Route
            path="/profile/:id"
            render={props => (
              <ProfileStudent
                isAuthenticated={this.state.isAuthenticated}
                user_id={
                  this.state.isAuthenticated ? this.state.profile.id : null
                }
                {...props}
              />
            )}
          />
          {this.state.isAuthenticated ? (
            <Route path="/job_details" component={job_details} />
          ) : null}
          <Dimmer
            active={this.state.passwordWrong}
            onClickOutside={() => this.setState({ passwordWrong: false })}
            page
          >
            <Header as="h2" icon inverted>
              <Icon name="lock" />
              Password Invalid!
              <Header.Subheader>
                Yoour computer will explode in 5 minutes :(
              </Header.Subheader>
            </Header>
          </Dimmer>
        </div>
      </Router>
    );
  }
}

export default App;
