import { ClickMap, Employee } from "../models/types";
import { empObj, storageObject } from "../main";
class EmployeeServices {
  displayEmployees = (employeesData: Employee[]): void => {
    employeesData = this.applyFilters(employeesData);
    storageObject.filteredEmployees = employeesData;
    const tableBody = document.getElementById("tableBody") as HTMLTableElement;
    if (employeesData.length && tableBody) {
      tableBody.innerHTML = "";
      employeesData.forEach((employee) => {
        tableBody.innerHTML += `
                <tr>
                    <td><input type="checkbox" id="${employee.empno}" onchange="empServices.toggleEmployeeChecked('${employee.empno}')" ${storageObject.searchFilters["selectAll"]}/></td>
                    <td>
                        <div class="user">
                            <img src="${employee.img}">
                            <div class="user-details">
                                <p class="name">${employee.firstname} ${employee.lastname}</p>
                                <p class="mail">${employee.mail}</p>
                            </div>
                        </div>
                    </td>
                    <td>${employee.location}</td>
                    <td>${employee.department}</td>
                    <td>${employee.jobTitle}</td>
                    <td id="empNo">${employee.empno}</td>
                    <td class="apperance"><p>Active</p></td>
                    <td>${employee.joining}</td>
                    <td >
                      <button class="ellipsis transparent-btn"  onclick="utilsObj.toggleOptions(this)">...</button>
                      <div class="last-element">
                        <button class="additional-options transparent-btn" id="viewEmployee" onclick="empServices.viewEmployee('${employee.empno}')" >View</button>
                        <button class="additional-options transparent-btn" id="editEmployee" onclick="empServices.editEmployee('${employee.empno}')" >Edit</button>
                        <button class="additional-options transparent-btn" id="deleteEmployee" onclick="empServices.deleteEmployeeRecord('${employee.empno}')">Delete</button>
                      </div>
                    </td>
                </tr>`;
      });
    } else {
      tableBody
        ? (tableBody.innerHTML = `<tr><td colspan="9" align="center">No Data Found</td></tr>`)
        : "";
    }
  };

  applyFilters = (employeesData: Employee[]): Employee[] => {
    let selectedEmployees = employeesData.filter(
      (employee) =>
        Object.values(employee).some(
          (value: string) =>
            !storageObject.searchFilters["searchBar"] ||
            value.toString().toLowerCase() ===
              storageObject.searchFilters["searchBar"].toLowerCase()
        ) &&
        (!storageObject.searchFilters["alaphabet"] ||
          employee.firstname.charAt(0).toUpperCase() ===
            storageObject.searchFilters["alaphabet"]) &&
        (!storageObject.searchFilters["active"] ||
          storageObject.searchFilters["active"] === employee.active) &&
        (!storageObject.searchFilters["location"] ||
          storageObject.searchFilters["location"] === employee.location) &&
        (!storageObject.searchFilters["department"] ||
          storageObject.searchFilters["department"] === employee.department)
    );
    return selectedEmployees;
  };

  editEmployee = (empid: string): void => {
    this.fillEmployeeDataTOForm(empid);
    const inputElement = document.getElementById("empno") as HTMLInputElement;
    if (inputElement) inputElement.disabled = true;
    let formSubmitBtn = document.getElementById(
      "formSubmitBtn"
    ) as HTMLButtonElement;
    formSubmitBtn.onclick = () => {
      this.deleteEmployeeRecord(empid);
      if (inputElement) inputElement.disabled = false;
    };
  };

  viewEmployee = (empid: string): void => {
    this.fillEmployeeDataTOForm(empid);
    const allEmployees = storageObject.allEmployees;
    for (let field in allEmployees.find((e) => e.empno == empid)) {
      let element = document.getElementById(field) as HTMLInputElement;
      if (element) element.disabled = true;
    }
    (
      document.getElementById("formSubmitBtn") as HTMLButtonElement
    ).style.display = "none";
  };

  fillEmployeeDataTOForm = (empid: string): void => {
    empObj.displayAddEmployeeForm();
    const allEmployees = storageObject.allEmployees;
    let employee = allEmployees.find((e) => e.empno == empid);
    for (let field in employee) {
      let element = document.getElementById(field) as HTMLInputElement;
      if (element) {
        if (field == "img") element.src = employee[field] || " ";
        else
          element.value = employee[field as keyof Employee].toString() || " ";
      }
    }
  };

  toggleEmployeeChecked = (empid: string): void => {
    let flag = false;
    storageObject.allEmployees.map((employee) => {
      if (employee.empno == empid)
        employee.ischeckedForDelete = !employee.ischeckedForDelete;
      if (employee.ischeckedForDelete) flag = true;
    });
    this.toogleDeleteBtnState(flag);
  };

  exportDataToExcel = (): void => {
    let csv: string =
      "EmpNo, FirstName, LastName, DateofBirth, Mail, Phno, JoinDt, Location, Role, Department, AssignManager, AssignProject, Status, \n";
    storageObject.filteredEmployees.forEach((employee) => {
      let seperator = "";
      for (let field in employee) {
        if (
          field != "img" &&
          field != "ischeckedForDelete" &&
          field != "isCheckedForRoleChange"
        ) {
          csv += seperator + employee[field as keyof Employee];
          seperator = ",";
        }
      }
      csv += "\n";
    });
    let exportLink = document.createElement("a");
    exportLink.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURI(csv)
    );
    exportLink.setAttribute("download", "employeeInformation.csv");
    exportLink.click();
  };

  clicksMap: ClickMap = {
    user: 0,
    locations: 0,
    departments: 0,
    role: 0,
    empNo: 0,
    status: 0,
    joinDt: 0,
  };

  resetNonSortingFields = (sortingField: string) => {
    for (let clicks in this.clicksMap)
      if (clicks !== sortingField) {
        this.clicksMap[clicks] = 0;
      }
  };

  sortingByOrder = (sortingField: string, order: string, data: Employee[]) => {
    const sortOrder = order == "ASC" ? 1 : -1;
    switch (sortingField) {
      case "user":
        data.sort((a, b) => {
          const nameA = (a.firstname + a.lastname).toUpperCase();
          const nameB = (b.firstname + b.lastname).toUpperCase();
          return sortOrder * nameA.localeCompare(nameB);
        });
        break;
      case "locations":
        data.sort((a, b) => sortOrder * a.location.localeCompare(b.location));
        break;
      case "departments":
        data.sort(
          (a, b) => sortOrder * a.department.localeCompare(b.department)
        );
        break;
      case "role":
        data.sort((a, b) => sortOrder * a.jobTitle.localeCompare(b.jobTitle));
        break;
      case "empNo":
        data.sort((a, b) => sortOrder * a.empno.localeCompare(b.empno));
        break;
      case "status":
        data.sort((a, b) => sortOrder * a.active!.localeCompare(b.active!));
        break;
      case "joinDt":
        data.sort((a, b) => sortOrder * (a.joining < b.joining ? 1 : -1));
        break;
      default:
        break;
    }
    this.displayEmployees(data);
  };

  tableSorting = (heading: HTMLElement): void => {
    const sortingField: string = heading.id;
    this.sortingByOrder(
      sortingField,
      this.clicksMap[sortingField] == 0 ? "ASC" : "DES",
      storageObject.filteredEmployees
    );
    if (!this.clicksMap[sortingField]) this.resetNonSortingFields(sortingField);
    this.clicksMap[sortingField] = (this.clicksMap[sortingField] + 1) % 2;
  };

  deleteSelectedEmployeeRecords = (): void => {
    storageObject.allEmployees.forEach((employee) => {
      if (employee.ischeckedForDelete)
        this.deleteEmployeeRecord(employee.empno);
    });
    empObj.showNotification("Employee Deleted", "red");
  };

  deleteEmployeeRecord = (empno: string) => {
    storageObject.allEmployees = storageObject.allEmployees.filter(
      (employee) => employee["empno"] != empno
    );
    storageObject.saveEmployeeRecordsInDB(storageObject.allEmployees);
    this.displayEmployees(storageObject.allEmployees);
    this.toogleDeleteBtnState(false);
  };

  toogleDeleteBtnState = (flag: boolean) => {
    let isallselected = false;
    let deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement;
    if (
      storageObject.filteredEmployees.length ===
      storageObject.filteredEmployees.filter((x) => x.ischeckedForDelete).length
    ) {
      isallselected = true;
    }
    deleteBtn.disabled = !flag;
    deleteBtn.style.cursor = flag ? "pointer" : "";
    deleteBtn.style.backgroundColor = flag ? "#F44848" : "";
    (document.getElementById("selectAll") as HTMLInputElement).checked =
      isallselected;
  };
}

let empServices = new EmployeeServices();
(window as any).empServices = empServices;

export { empServices };
