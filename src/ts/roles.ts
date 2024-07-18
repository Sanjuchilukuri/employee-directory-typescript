import { Card, Employee } from "./models/types";
import { utilsObj, apiObj, storageObject } from "./main";
class Roles {
  constructor() {
    apiObj
      .fetchCardDataFromJson()
      .then((result) => this.dynamicCardFromJson(result));
  }

  displayAddRoleForm = () => {
    document.getElementById("mainContent")!.style.display = "none";
    document.getElementById("addRoleSection")!.style.display = "block";
  };

  displaySeletedRoleEmployees = (selectedData: Employee[]) => {
    let Wrapper = document.getElementById("AddRoleFormWrapper")!;
    Wrapper.innerHTML = "";
    selectedData.forEach((employee): void => {
      Wrapper.innerHTML += `<div class="employee-row">
        <div>
          <img src = ${employee.img} />
          <p>${employee.firstname} ${employee.lastname}</p>
        </div>
        <input type=checkbox onchange=rolesObjtoggleCheckedPropertyInRoles('${employee.empno}')>
      </div>`;
    });
  };

  filterEmployeesOnDept = (event: Event): void => {
    const allEmployees = storageObject.allEmployees;
    let selectedDepartmentEmployees = allEmployees.filter((employee) => {
      return employee.department == (event.target as HTMLInputElement).value;
    });
    storageObject.filteredEmployeesInRoles = selectedDepartmentEmployees;
    this.displaySeletedRoleEmployees(selectedDepartmentEmployees);
  };

  searchEmployee = (employeeSearchBar: HTMLInputElement) => {
    const filteredEmployeesInRoles = storageObject.filteredEmployeesInRoles;
    let enteredString = employeeSearchBar.value.toUpperCase();
    let filteredData = filteredEmployeesInRoles.filter((ele) => {
      return ele.firstname.toUpperCase().includes(enteredString);
    });
    this.displaySeletedRoleEmployees(filteredData);
  };

  addRole = (): void => {
    let role = document.getElementById("roleName") as HTMLInputElement;
    if (role.value) {
      const allEmployees = storageObject.allEmployees;
      allEmployees.forEach((employee) => {
        if (employee.isCheckedForRoleChange) {
          employee.jobTitle = role.value;
          employee.isCheckedForRoleChange = false;
          storageObject.allEmployees = allEmployees;
          storageObject.saveEmployeeRecordsInDB(allEmployees);
        }
      });
      if (
        !storageObject.options.jobTitle.some(
          (title: string) => title == role.value
        )
      ) {
        storageObject.options.jobTitle.push(role.value);
        storageObject.saveOptionsInDB();
        utilsObj.intilizeOptions();
      }
    }
  };

  toggleCheckedPropertyInRoles = (empid: string) => {
    storageObject.allEmployees.forEach((employee) => {
      if (employee.empno == empid)
        employee.isCheckedForRoleChange = !employee.isCheckedForRoleChange;
    });
  };

  dynamicCardFromJson = (cardsData: Card[]) => {
    const cardsWrapper = document.getElementById("cardsWrapper")!;
    if (cardsWrapper) {
      cardsData.forEach((card) => {
        cardsWrapper.innerHTML += `<div class="card">
      <div class="text-icon">
          <p>${card.Role}</p>
          <img src="./assets/edit.svg" alt="edit icon" />
      </div>
      <div class="about">
          <div class="department">
          <div class="department-text">
              <img src="./assets/employee.svg" alt="department icon" />
              <p>Department</p>
          </div>
          <p>${card.Department}</p>
          </div>
          <div class="location">
          <div class="location-text">
              <img src="./assets/location.svg" alt="location icon" />
              <p>Location</p>
          </div>
          <p>${card.Location}</p>
          </div>
          <div class="total-employees">
          <p>Total Employees</p>
          <div class="img-container">
              <img src="./assets/profiles/image-eight.webp" alt="employee icon"/>
              <img src="./assets/profiles/image-eleven.webp" alt="employee icon"/>
              <img src="./assets/profiles/image-five.webp" alt="employee icon"/>
              <img src="./assets/profiles/image-four.webp" alt="employee icon"/>
              <p>+43</p>
          </div>
      </div>
      </div>
      <div class="employee-view" onclick="managerObj.changeDisplay('employeeInformation')">
          <p>view all Employees</p>
          <img src="./assets/right-arrow.svg" alt="arrow icon" />
      </div>
      </div>`;
      });
    }
  };
}

let rolesObj = new Roles();
(window as any).rolesObj = rolesObj;
export { Roles, rolesObj };
