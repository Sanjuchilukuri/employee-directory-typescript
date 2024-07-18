interface Filters {
  searchBar: string;
  active: string;
  location: string;
  department: string;
  alaphabet: string;
  selectAll: string;
  // [k: string]: string;
}

type Options = {
  location: string[];
  status: string[];
  department: string[] ;
  jobTitle:string[]; 
  manager: string[] ;
  project:string[] ;
  [k: string]: string[];
};

type ClickMap = {
  user: number;
  locations: number;
  departments: number;  
  role: number;
  empNo: number;
  status: number;
  joinDt: number;
  [k: string]: number;
};

interface Employee {
  department: string;
  dob: Date;
  empno: string;
  firstname: string;
  jobTitle: string;
  joining: Date;
  lastname: string;
  location: string;
  mail: string;
  manager: string;
  phno: string;
  project: string;
  img: string;
  active: string;
  isCheckedForRoleChange: boolean;
  ischeckedForDelete: boolean;
}

interface Card {
  Role: string;
  Department: string;
  Location: string;
  // [k: string]: string;
}

export { Filters, Options, ClickMap, Employee, Card };