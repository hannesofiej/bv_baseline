import React, { Component } from "react";
import Statement from "../Statement/Statement.js";
import { Link } from "react-router-dom";
//import response from "../../data/data.json";
import * as CONSTANTS from "../../data/constants.js";
import axios from "axios";

import "./statementlist.css";

class StatementList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      statements: [],
      progress: 1,
      //response,
      collectedResponses: [],
      allDone: false
    };

    //this.fetchStatements = this.fetchStatements.bind(this);
    this.onResponseSelected = this.onResponseSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.progress = this.progress.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    //this.fetchStatements();

    this.getPublicData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getPublicData() {
    fetch(process.env.PUBLIC_URL + "/data.json")
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
        this.setState({
          statements: json.data.statements
        });
      });
  }

  /* fetchStatements = () => {
    if (this._isMounted) {
      this.setState({
        statements: response.data.statements
      });
    }
  }; */

  onResponseClicked = response => {
    const collectedResponses = this.state.collectedResponses.concat(response);

    if (this._isMounted) {
      this.setState(
        {
          collectedResponses: collectedResponses
        },
        () => {
          console.log(this.state.collectedResponses);
        }
      );
    }
  };

  onResponseSelected = response => {
    this.postAnswer(response);
    const collectedResponses = this.state.collectedResponses.concat(response);

    if (this._isMounted) {
      if (response.finalResponse) {
        this.setState(
          {
            collectedResponses: collectedResponses
          },
          () => {
            //console.log(this.state.collectedResponses);
          }
        );
      } else {
        this.setState(
          {
            collectedResponses: collectedResponses
          },
          () => {
            //console.log(this.state.collectedResponses);
          }
        );
      }
    }
  };

  progress = () => {
    if (this._isMounted) {
      const progressTo = this.state.progress + 1;
      const allDone = progressTo > this.state.statements.length;
      this.setState({
        progress: progressTo,
        allDone: allDone
      });
    }
  };

  onSubmit = () => {
    /* const print = JSON.stringify(this.state.collectedResponses, null, 4);
    this.setState({
      csv: print
    }); */

    window.location.reload();
  };

  postAnswer = response => {
    console.log(response);
    const data = {
      statement: response.statementId,
      displayTime: response.displayTime,
      changed: response.changeOccured,
      initialChoice: response.initialChoice,
      initialTimestamp: response.initialTimestamp,
      finalChoice: response.finalChoice,
      finalTimestamp: response.finalTimestamp,
      text: "test"
    };
    //console.log(data);

    axios
      .post(CONSTANTS.URL_RESPONSES, JSON.stringify(data))
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const visibleStatements = this.state.statements.filter(
      (statement, index) => {
        if (index < this.state.progress) {
          return true;
        }
        return false;
      }
    );

    return (
      <div className="container statement-list">
        {visibleStatements.map(statement => (
          <div key={statement.id}>
            <Statement
              onResponseSelected={this.onResponseSelected}
              id={statement.id}
              text={statement.text}
              responses={statement.responses}
              progress={this.progress}
            ></Statement>
          </div>
        ))}
        {this.state.allDone ? (
          <div className="actions">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={this.onSubmit}
                className="btn btn-secondary btn-reset"
              >
                Tag test igen
              </button>
              <Link
                target="_blank"
                className="btn-link btn btn-primary"
                to="/chart"
              >
                Se svarfordeling
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default StatementList;
