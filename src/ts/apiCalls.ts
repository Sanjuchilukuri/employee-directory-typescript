import { Card, Options } from "./models/types";
class APICalls {
  fetchOptionsFromJson = async (): Promise<Options> => {
    let jsonOptions: Options = {
      location: [],
      status: [],
      department: [],
      jobTitle: [],
      manager: [],
      project: [],
    };
    await fetch("../../src/options.json")
      .then((response) => response.json())
      .then((data) => {
        jsonOptions = data;
      });
    return jsonOptions;
  };

  fetchCardDataFromJson = async () => {
    let cardData: Card[] = [];
    await fetch("../../src/mock-data.json")
      .then((response) => response.json())
      .then((data) => (cardData = data));
    return cardData;
  };

  getData = async (displayId: string) => {
    let data: any;
    switch (displayId) {
      case "employees":
        await fetch("../../src/Components/Employee/employeeComponent.html")
          .then((response) => response.text())
          .then((result) => {
            data = result;
          });
        await fetch(
          "../../src/Components/Employee/addEmployeeFormComponent.html"
        )
          .then((response) => response.text())
          .then((result) => {
            data += result;
          });
        break;
      case "roles":
        await fetch("../../src/Components/Roles/roleComponent.html")
          .then((response) => response.text())
          .then((result) => {
            data = result;
          });

        await fetch("../../src/Components/Roles/addRoleFormComponent.html")
          .then((response) => response.text())
          .then((result) => {
            data += result;
          });
        break;
      case "employeeInformation":
        await fetch(
          "../../src/Components/EmployeeInformation/employeeInfComponent.html"
        )
          .then((response) => response.text())
          .then((result) => {
            data = result;
          });
    }
    return data;
  };
}

let apiObj = new APICalls();
(window as any).apiObj = apiObj;
export { apiObj };
