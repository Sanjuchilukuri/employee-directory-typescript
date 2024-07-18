import { storageObject, empServices, utilsObj, rolesObj, Roles, apiObj } from "./main";

class Manager {
  // k = [];
  // manager() { 
  //   this.k = storageObject;
  // }
  loadComponents = async () => {
    let sidebar = document.getElementById("sidebarComponent")!;
    if (sidebar) {
      await fetch("./Components/common/sidebarComponent.html")
        .then((response) => response.text())
        .then((data) => {
          sidebar.innerHTML = data;
        });
    }
  
    let header = document.getElementById("headerComponent")!;
    if (header) {
      await fetch("./Components/common/headerComponent.html")
        .then((response) => response.text())
        .then((data) => {
          header.innerHTML = data;
        });
    }
  };

  changeDisplay = async(displayId:string) => {
    let appRoot = document.getElementById("app-root");
    appRoot!.innerHTML = await apiObj.getData(displayId);
    this.intilizedata(displayId);
  };

  intilizedata(displayId:string) {
    switch (displayId) {
      case "employees":
        document.getElementById("cssLink")!.setAttribute('href','../dist/styles/index.css');
        document.getElementById("employeeSection")!.classList.add("active-employees");
        document.getElementById("rolesSection")!.classList.remove("active");
        empServices.displayEmployees(storageObject.allEmployees);
        utilsObj.generateAlphabets();
        utilsObj.intilizeOptions();
        break;
      case "roles":
        document.getElementById("cssLink")!.setAttribute('href','../dist/styles/roles.css');
        document.getElementById("employeeSection")!.classList.remove("active-employees");
        document.getElementById("rolesSection")!.classList.add("active");
        new Roles();
        utilsObj.intilizeOptions();
        break;
      case "employeeInformation":
        document.getElementById("cssLink")!.setAttribute('href', '../dist/styles/empInf.css');
        document.getElementById("employeeSection")!.classList.remove("active-employees");
        document.getElementById("rolesSection")!.classList.add("active");
        break;
    }
  }
}

let managerObj = new Manager();
managerObj.changeDisplay('employees');
managerObj.loadComponents();
(window as any).managerObj = managerObj;
export { managerObj };