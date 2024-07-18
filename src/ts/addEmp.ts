import { Employee } from "./models/types";
import { storageObject } from "./main";
class AddEmp {
  displayAddEmployeeForm = (): void => {
    const mainContent: HTMLDivElement = document.getElementById(
      "mainContent"
    ) as HTMLDivElement;
    const employeeForm: HTMLDivElement = document.getElementById(
      "employeeModel"
    ) as HTMLDivElement;
    mainContent.style.display = "none";
    employeeForm.style.display = "block";
  };

  updatFormImage = (event: Event): void => {
    const inputImage = document.getElementById("img") as HTMLImageElement;
    const selectedFile: File = (event.target as HTMLInputElement)?.files?.[0]!;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (): void => {
      if (reader.result && inputImage) {
        inputImage.src = reader.result.toString();
      }
    };
  };

  onSubmitEmployee = (event: Event): void => {
    event.preventDefault();
    let formData: any = new FormData(
      document.getElementById("form") as HTMLFormElement
    );
    let employeeData = Object.fromEntries(formData) as Employee;
    if (this.isValidForm(employeeData)) {
      if (this.isEmpNoExistsInDB(employeeData.empno)) {
        (document.getElementById("empno") as HTMLInputElement)?.classList?.add(
          "show"
        );
        (
          document.getElementById("empnoError") as HTMLSpanElement
        ).innerText = `${employeeData["empno"]} is already existed`;
      } else {
        const newEmployee = this.generateEmployeeFromForm(employeeData);
        this.saveEmployee(newEmployee);
        this.showNotification("Employee Added", "green");
      }
    }
  };

  isValidForm = (employeeData: Employee): boolean => {
    let isValid = true;
    const errorElements = document.getElementsByClassName(
      "error"
    ) as HTMLCollectionOf<HTMLSpanElement>;
    const inputErrorElements = document.getElementsByClassName(
      "input-error"
    ) as HTMLCollectionOf<HTMLInputElement>;
    Array.from(errorElements).forEach(
      (errorElement: HTMLSpanElement) => (errorElement.style.display = "none")
    );
    Array.from(inputErrorElements).forEach((errorElement: HTMLSpanElement) =>
      errorElement.classList.remove("input-error")
    );
    for (let field in employeeData) {
      if (
        !employeeData[field as keyof Employee].toString().trim() &&
        this.isRequiredField(field)
      ) {
        isValid = false;
        const inputField = document.getElementById(field) as HTMLInputElement;
        inputField.classList.add("input-error");
        inputField.classList.add("show");
      }
    }
    return isValid;
  };

  isEmpNoExistsInDB = (empno: string): boolean => {
    return storageObject.allEmployees.some(
      (employee): boolean => employee["empno"] == empno
    );
  };

  generateEmployeeFromForm = (newEmployee: Employee): Employee => {
    const inputImage: HTMLImageElement = document.getElementById(
      "img"
    ) as HTMLImageElement;
    newEmployee.img = inputImage.src;
    newEmployee.active = "Active";
    newEmployee.ischeckedForDelete = false;
    newEmployee.isCheckedForRoleChange = false;
    return newEmployee;
  };

  saveEmployee = (newEmployee: Employee): void => {
    const allEmployees = storageObject.allEmployees;
    allEmployees.push(newEmployee);
    storageObject.allEmployees = allEmployees;
    storageObject.saveEmployeeRecordsInDB(allEmployees);
  };

  showNotification = (toasterText: string, bgColor: string): void => {
    let p = document.createElement("p");
    p.innerHTML = toasterText;
    p.classList.add("active-employee-toggle");
    p.style.backgroundColor = bgColor;
    const container = document.getElementById("container") as HTMLDivElement;
    container?.appendChild(p);
    setTimeout((): void => {
      p.remove();
      window.location.href = "./index.html";
    }, 1300);
  };

  isRequiredField = (field: string): boolean => {
    const nonRequiredFields: string[] = [
      "dob",
      "phno",
      "location",
      "jobTitle",
      "department",
      "manager",
      "project",
    ];
    return !nonRequiredFields.includes(field);
  };

  redirectWindow = (): void => {
    window.location.href = "./index.html";
  };
}
let empObj = new AddEmp();
(window as any).empObj = empObj;
export { empObj };
