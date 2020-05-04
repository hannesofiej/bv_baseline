import React, { Component } from "react";
import Response from "../Response/Response.js";
import PropTypes from "prop-types";
import "./Statement.scss";

class Statement extends Component {
  _isMounted = false;

  constructor(props, context) {
    super(props, context);
    this.myRef = React.createRef();

    this.state = {
      id: this.props.id,
      text: this.props.text,
      displayTime: new Date(),
      selectedResponse: null,
      finalResponse: null,
      initialChoice: null,
      finalChoice: null,
      changeOccured: false,
      chatting: true
    };
    this.collectResponse = this.collectResponse.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onClickOk = this.onClickOk.bind(this);
    this.onClick = this.onClick.bind(this);
    this.progress = this.progress.bind(this);
    this.scrollToMyRef = this.scrollToMyRef.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;
    const component = this;
    setTimeout(function() {
      component.setState(
        {
          chatting: false
        },
        () => {
          component.scrollToMyRef();
        }
      );
    }, 3000);
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  collectResponse = () => {
    const responseObject = {
      statementId: this.state.id,
      displayTime: this.state.displayTime,
      initialChoice: this.state.initialChoice,
      initialTimestamp: this.state.initialTimestamp,
      finalChoice: this.state.finalResponse.id,
      finalTimestamp: this.state.finalTimestamp,
      changeOccured: this.state.changeOccured
    };
    this.props.onResponseSelected(responseObject);
  };

  scrollToMyRef = () => {
    this.myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  onClickBack = () => {
    if (this._isMounted) {
      this.setState(
        {
          selectedResponse: null,
          changeOccured: true
        },
        () => {}
      );
    }
  };

  onClickOk = response => {
    if (this._isMounted) {
      this.setState(
        {
          finalResponse: response,
          finalTimestamp: new Date()
        },
        () => {
          this.collectResponse();
        }
      );
    }
  };

  onClick = id => {
    if (this._isMounted) {
      this.setState(
        {
          selectedResponse: id
        },
        () => {}
      );
      if (this.state.initialChoice === null) {
        this.setState(
          {
            initialChoice: id,
            initialTimestamp: new Date()
          },
          () => {}
        );
      }
    }
  };

  progress = () => {
    this.props.progress();
  };

  render() {
    const sectionClass = this.state.selectedResponse
      ? "row statement-section statement-section--selected"
      : this.state.changeOccured
      ? "row statement-section statement-section--changed"
      : "row statement-section  statement-section--init";

    return (
      <div className={sectionClass} ref={this.myRef}>
        {this.state.chatting ? (
          <div className="chat-dots-wrap">
            <b>Bruger skriver:</b>
            <div className="chat-dots">
              <div className="chat-dot"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="statement">{this.state.text}</div>
            <div className="responses">
              {this.props.responses.map((item, i) => (
                <Response
                  onClick={this.onClick}
                  onClickBack={this.onClickBack}
                  onClickOk={this.onClickOk}
                  progress={this.progress}
                  id={item.id}
                  lock={this.state.finalResponse != null}
                  selected={item.id === this.state.selectedResponse}
                  key={item.id}
                  text={item.text}
                  feedback={item.feedback}
                  change={this.state.changeOccured}
                ></Response>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

Statement.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  responses: PropTypes.array.isRequired,
  progress: PropTypes.func.isRequired,
  onResponseSelected: PropTypes.func.isRequired
};

export default Statement;
