import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Response.scss";
import { ReactComponent as Plane } from "../../assets/images/paper-plane.svg";

class Response extends Component {
  _isMounted = false;

  constructor(props, context) {
    super(props, context);

    this.state = {
      id: this.props.id,
      text: this.props.text,
      feedback: this.props.feedback,
      selected: false,
      toggled: false,
      disabled: false
    };

    this.onClick = this.onClick.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onClickOk = this.onClickOk.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };
  toggle = event => {
    if (this._isMounted) {
      this.setState(
        {
          toggled: !this.state.toggled
        },
        () => {}
      );
    }
  };

  onClick = () => {
    if (this._isMounted && !this.state.selected) {
      this.setState(
        {
          selected: !this.state.selected
        },
        () => {
          this.props.onClick(this.state.id);
        }
      );
    }
  };
  onClickBack = () => {
    if (this._isMounted) {
      this.setState(
        {
          selected: false
        },
        () => {
          this.props.onClickBack();
        }
      );
    }
  };
  onClickOk = () => {
    if (this._isMounted) {
      this.setState(
        {
          selected: true,
          toggled: false
        },
        () => {
          this.props.onClickOk(this.state);
        }
      );
    }
  };

  onClickNext = () => {
    if (this._isMounted) {
      this.setState(
        {
          disabled: true,
          toggled: true
        },
        () => {
          this.props.progress();
        }
      );
    }
  };

  render() {
    const { text, feedback } = this.state;
    const { selected, lock } = this.props;

    const responseClass = this.state.selected
      ? "response response--selected"
      : "response response--not-selected";
    const toggleClass =
      "response__feedback chevron " +
      (this.state.toggled ? "bottom closed" : "open");
    const collapseClass = this.state.toggled ? "collapse" : "collapse show";
    return (
      <>
        <div className={responseClass}>
          <div className="response__text">{text}</div>
          {!selected ? (
            <button
              className="response__btn btn btn-primary"
              onClick={this.onClick}
            >
              Vælg dette svar
            </button>
          ) : (
            ""
          )}

          {selected && !lock ? (
            <div className="response__actions">
              <p className="response__feedback__title">
                Vil du sende dette svar til barnet?
              </p>
              <div className="btn-group--response">
                <button className="btn btn-primary" onClick={this.onClickBack}>
                  Vælg et andet svar
                </button>
                <button
                  className="btn btn--icon btn-primary"
                  onClick={this.onClickOk}
                >
                  <div>Svar</div>

                  <div className="icon icon--plane">
                    <Plane></Plane>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {lock ? (
            <>
              <div className="response__feedback">
                <button onClick={this.toggle} className={toggleClass}>
                  <b className="response__feedback__title">Feedback:</b>
                </button>
                <div className={collapseClass}>
                  <div className="response__feedback__text">
                    <p>{feedback}</p>
                  </div>
                </div>
              </div>

              {this.state.disabled ? (
                ""
              ) : (
                <div className="response__actions">
                  <button
                    className="btn btn-primary"
                    onClick={this.onClickNext}
                  >
                    Fortsæt
                  </button>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

Response.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  feedback: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  toggled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onClickOk: PropTypes.func.isRequired,
  progress: PropTypes.func.isRequired,
  lock: PropTypes.bool.isRequired,
  change: PropTypes.bool
  //initialResponseSelected: PropTypes.bool.isRequired
};

export default Response;
