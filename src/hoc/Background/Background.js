/* eslint-disable no-unused-expressions */
import "./Background.css";
import adglogo from "../../assets/img/adglogo.png";
import adglogo2 from "../../assets/img/adglogo2.png";
import userpic from "../../assets/img/userpic.png";
import React, { Component } from "react";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import moment from 'moment';
import Countdown from "../../components/Countdown/Countdown";
import { Link } from "react-router-dom";

export class Background extends Component {
  state = {
    Token: sessionStorage.getItem("Token"),
    data: false,
    recruitmentStatus: false,
  };
  constructor(props) {
    super(props);
    this.background = null;
    this.state = {
      dateValue: '12-23-2020',
      timeValue: '02:00',
      ampmValue: 'pm',
      countdown: {
        days: '',
        hours: '',
        mins: '',
        secs: ''
      },
      isCountdownSet: true,
    }
    this.timer = null;
    this.countDownDate = {
      dateValue: '12-23-2020',
      timeValue: '02:00',
      ampmValue: 'pm',
      unixEndDate: ""
    };
  }

   renderCountdownDate(countDownDate) {
    countDownDate ? localStorage.setItem('countDownDate', JSON.stringify(countDownDate)): null;
    return JSON.parse(localStorage.getItem('countDownDate')) || this.countDownDate;
  }

  setEndDate() {
    let dateValue= '12-23-2020';
    let timeValue= '02:00';
    let ampmValue= 'pm';
    const unixEndDate = Number(moment(`${dateValue} ${timeValue} ${ampmValue}`, 'MM-DD-YYYY hh:mm A').format('X'));
    this.startCountdown(this.renderCountdownDate({
      dateValue,
      timeValue,
      ampmValue,
      unixEndDate
    }))
    console.log({dateValue},timeValue,ampmValue,unixEndDate);
  }

  startCountdown(endDate) {
    clearInterval(this.timer);
    this.timer = null;

    if (endDate.unixEndDate !== '') {
      this.timer = setInterval(() => this.playTimer(endDate.unixEndDate), 1000);
    }
  }

  playTimer(unixEndDate) {
    const distance = unixEndDate - moment().format('X');
    if (distance > 0) {
      this.setState({
        countdown: {
          days: parseInt(distance / (60 * 60 * 24), 10),
          hours: parseInt(distance % (60 * 60 * 24) / (60 * 60), 10),
          mins: parseInt(distance % (60 * 60) / (60), 10),
          secs: parseInt(distance % 60, 10)
        },
        isCountdownSet: true,
        infoMessage: ''
      });
    }
  }

  componentDidMount() {
    let t = this;
    if (this.state.Token) {
      var config = {
        headers: {
          "auth-token": this.state.Token,
        },
      };
      axios
        .get("https://adgrecruitments.herokuapp.com/user/getuser", config)
        .then(function (response) {
          console.log(response.data);
          t.setState({ data: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    axios
      .get("https://adgrecruitments.herokuapp.com/user/recruitmentstatus")
      .then((recruitmentStatus) =>
        this.setState({ recruitmentStatus: !recruitmentStatus.data.status }),
      );
    this.startCountdown(this.renderCountdownDate());
  }

  handleLogOut = () => {
    sessionStorage.clear();
  };

  render() {
    let background;
    // let profile = null;

    if (this.state.Token) {
      background = (
        <div>
          <div id='adglogo-cont2'>
            <img id='adglogo2' src={adglogo2} alt='ADG Logo' />
            <div className='flex'></div>
            {this.state.data ? (
              <div id='profile-container' className='pf-cr'>
                <div id='profile-wrapper' className='pf-wr'>
                  <div className='uinf'>
                    <div>
                      <img id='userpic' src={userpic} alt='User pic' />
                    </div>
                    <div id='profile-title' className='usr-det'>
                      {this.state.data.userDetails.name}
                    </div>
                  </div>
                  <Link to='/'>
                    <button id='logout-button' onClick={this.handleLogOut}>
                      Logout
                    </button>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          <div className='container'>
            <div id='cont-box'>
              {/*{this.state.recruitmentStatus ? (*/}
              {/*  this.props.children*/}
              {/*) : (*/}
              {/*  <h2 align='center'>Recruitments coming soon</h2>*/}
              {/*)}*/}
              {this.props.children}
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      background = (
        <div>
          <div className='container'>
            <div id='adglogo-cont'>
              <img id='adglogo' src={adglogo} alt='ADG Logo' />
            </div>
            <div id='cont-box'>
              {this.state.recruitmentStatus ? (
                this.props.children
              ) : (
                <>
                <h2 align='center'>Recruitments coming soon</h2>
              {this.setEndDate()}
              {this.state.isCountdownSet ? <Countdown countdown={this.state.countdown} unixEndDate={'\n' + '<Countdown date={\'2020-12-23T14:00:00'} /> : <p className="message info-message"><span className="fa fa-info-circle fa-lg fa-fw"></span> {this.state.infoMessage}</p>}
                </>
              )}
              {/*{this.props.children}*/}
            </div>
          </div>
          <Footer />
        </div>
      );
    }
    return (
      <div>
        <div id='back-img' />
        {background}
      </div>
    );
  }
}

export default Background;
