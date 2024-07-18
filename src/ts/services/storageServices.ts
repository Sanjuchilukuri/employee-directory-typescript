import { Employee, Filters, Options } from "../models/types";
import { apiObj } from "../main";
class StorageServices {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filteredEmployeesInRoles: Employee[] = [];
  options: Options = {
    location: [],
    status: [],
    department: [],
    jobTitle: [],
    manager: [],
    project: [],
  };
  searchFilters: Filters = {
    searchBar: "",
    active: "",
    location: "",
    department: "",
    alaphabet: "",
    selectAll: "unchecked",
  };

  updateOptionObject = (): void => {
    storageObject.options = this.fetchOptionsFromDB();
  };

  fetchAllEmployeesFromDB = (): Employee[] => {
    return JSON.parse(localStorage.getItem("data")!) || [];
  };

  saveEmployeeRecordsInDB = (allEmployeeRecords: Employee[]) => {
    localStorage.setItem("data", JSON.stringify(allEmployeeRecords));
  };

  saveOptionsInDB = () => {
    localStorage.setItem("options", JSON.stringify(storageObject.options));
  };

  updatOptionsFromJsonToDB = async () => {
    await apiObj
      .fetchOptionsFromJson()
      .then((result) => (storageObject.options = result));
    this.saveOptionsInDB();
  };

  fetchOptionsFromDB = () => {
    let data = JSON.parse(localStorage.getItem("options")!);
    if (data == null) {
      this.updatOptionsFromJsonToDB();
      this.fetchOptionsFromDB();
      window.location.reload();
    }
    return data;
  };
}

let storageObject: StorageServices = new StorageServices();

storageObject.filteredEmployees = storageObject.allEmployees;

(window as any).storageObject = storageObject;

export { storageObject };
