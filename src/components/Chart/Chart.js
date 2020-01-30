import React from "react";
//import response from "../../data/data.json";
import { Doughnut } from "react-chartjs-2";
import * as CONSTANTS from "../../data/constants.js";

import axios from "axios";
import "./chart.css";

const colorScale = ["#66cfcd", "#00677F"];
const options = {
  tooltips: {
    mode: "label",
    callbacks: {
      label: function(tooltipItem, data) {
        let label = data["datasets"][0]["data"][tooltipItem["index"]];
        return label + "%";
      }
    }
  }
};

class ChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [],
      responseMap: [],
      nodata: true,
      statements: []
    };
    this.convertToMap = this.convertToMap.bind(this);
    this.setData = this.setData.bind(this);
  }
  componentDidMount = () => {
    this.getPublicData();

    this.setInterval = window.setInterval(() => {
      this.getData();
    }, 3000);
  };

  componentWillUnmount() {
    window.clearInterval(this.setInterval);
  }

  getPublicData() {
    fetch(process.env.PUBLIC_URL + "/data.json")
      .then(response => {
        return response.json();
      })
      .then(json => {
        //console.log(json);
        this.setState(
          {
            statements: json.data.statements
          },
          () => {
            this.getData();
          }
        );
      });
  }

  getData = () => {
    //console.log("getting data");

    axios
      .get(CONSTANTS.URL_RESPONSES)
      .then(response => {
        const data = response.data;
        if (data.length) {
          this.setData(response.data);
        } else {
          this.setState({
            nodata: true
          });
        }
      })
      .catch(error => {
        console.log("an error occured", error);
      });
  };

  setData = data => {
    //console.log("updating data");
    this.setState(
      {
        responses: data,
        nodata: false
      },
      () => {
        const map = this.convertToMap();
        this.setState(
          {
            responseMap: map
          }
          //() => console.log(this.state)
        );
      }
    );
  };

  getInitialChoices = responses => {
    const distinctinitialChoices = [
      ...new Set(responses.map(response => response.initialChoice))
    ];

    let chartjsLabels = [],
      chartJsData = [],
      chartjs = {};

    distinctinitialChoices.sort().forEach(choice => {
      const label = "Svar " + choice;
      chartjsLabels.push(label);
      const choices = responses.filter(
        initialChoice => initialChoice.initialChoice === choice
      );

      chartJsData.push(choices.length);

      chartjs = {
        labels: chartjsLabels,
        datasets: [
          {
            data: chartJsData,
            backgroundColor: colorScale,
            hoverBackgroundColor: colorScale
          }
        ]
      };
    });

    return chartjs;
  };

  getFinalChoices = responses => {
    const distinctFinalChoices = [
      ...new Set(responses.map(response => response.finalChoice))
    ];
    let chartjsLabels = [],
      chartJsData = [],
      chartjs = {};

    distinctFinalChoices.sort().forEach(choice => {
      const label = "Svar " + choice;
      chartjsLabels.push(label);
      const choices = responses.filter(
        finalChoice => finalChoice.finalChoice === choice
      );

      chartJsData.push(choices.length);

      chartjs = {
        labels: chartjsLabels,
        datasets: [
          {
            data: chartJsData,
            backgroundColor: colorScale,
            hoverBackgroundColor: colorScale
          }
        ]
      };
    });

    return chartjs;
  };

  getChangedChoices = responses => {
    /* const distinctinitialChoices = [
      ...new Set(responses.map(response => response.initialChoice))
    ]; */

    let chartjsLabels = [],
      chartJsData = [],
      chartjs = {};

    //Ændrede svar
    chartjsLabels.push("I tvivl");
    const changedChoices = responses.filter(
      initialChoice => initialChoice.changed
    );

    const changedPercentage = (changedChoices.length / responses.length) * 100;

    chartJsData.push(changedPercentage.toFixed(2));

    //All responses
    const restPercentage = 100 - changedPercentage;
    chartjsLabels.push("Ikke i tvivl");
    chartJsData.push(restPercentage.toFixed(2));

    chartjs = {
      labels: chartjsLabels,
      ticks: {},
      datasets: [
        {
          data: chartJsData,
          backgroundColor: colorScale,
          hoverBackgroundColor: colorScale
        }
      ]
    };

    return chartjs;
  };

  convertToMap = () => {
    //console.log(this.state.responses);
    const ids = this.state.responses.map(response => response.statement);
    const distinctIds = [...new Set(ids)];
    //console.log(ids, distinctIds);

    let responseMap = [];
    distinctIds.sort().forEach(id => {
      const responses = this.state.responses.filter(
        response => response.statement === id
      );

      const initialChoices = this.getInitialChoices(responses);
      const finalChoices = this.getFinalChoices(responses);
      const changedChoices = this.getChangedChoices(responses);

      //console.log(initialChoices);

      //const text = this.state.statements[id].text;
      const statement = this.state.statements.filter(
        statement => statement.id === id
      );
      //console.log(id, statement[0].text);
      responseMap.push({
        id: id,
        statement: statement[0],
        initialChoices: initialChoices,
        finalChoices: finalChoices,
        changedChoices: changedChoices,
        responseCount: responses.length,
        data: responses
      });
    });
    return responseMap;
  };

  render() {
    const map = this.state.responseMap;
    //const responses = this.state.responses;

    return (
      <>
        {this.state.nodata ? (
          <div className="charts-wrapper">
            <h2>Henter svar...</h2>
          </div>
        ) : (
          <div>
            <h1 className="chart-wrapper-title">Dette er en h1</h1>
            {Object.keys(map).map(index => (
              <div className="chart-wrapper" key={map[index].id}>
                <h2>Henvendelse {map[index].id}</h2>
                <p className="chart__text">"{map[index].statement.text}"</p>
                <div className="charts">
                  <div className="chart__container">
                    <h3 className="chart__container__title">Første valg</h3>
                    <Doughnut data={map[index].initialChoices} />
                    <div className="chart__container__total">
                      Antal svar: {map[index].responseCount}
                    </div>
                  </div>
                  <div className="chart__container">
                    <h3 className="chart__container__title">I tvivl</h3>
                    <Doughnut
                      data={map[index].changedChoices}
                      options={options}
                    />
                    <div className="chart__container__total">
                      Antal svar: {map[index].responseCount}
                    </div>
                  </div>
                  <div className="chart__container">
                    <h3 className="chart__container__title">Valgt svar</h3>
                    <Doughnut data={map[index].finalChoices} />
                    <div className="chart__container__total">
                      Antal svar: {map[index].responseCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default ChartView;
