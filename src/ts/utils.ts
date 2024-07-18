import { Options } from "./models/types";
import { empServices, storageObject } from "./main";
class Utils {
  constructor() {
    storageObject.allEmployees = storageObject.fetchAllEmployeesFromDB();
    empServices.displayEmployees(storageObject.allEmployees);
    storageObject.updateOptionObject();
  }

  additionalOptionsElement!: HTMLElement;
  toggleOptions = (element?: HTMLElement): void => {
    if (element && this.additionalOptionsElement === element) {
      this.additionalOptionsElement.classList.toggle("show");
      return;
    }
    if (
      this.additionalOptionsElement &&
      this.additionalOptionsElement.classList.contains("show")
    ) {
      this.additionalOptionsElement.classList.remove("show");
    }
    if (element) {
      element.classList.add("show");
      this.additionalOptionsElement = element;
    }
  };

  SidebarVisibility = (): void => {
    const sideBar = document.getElementById("aside")!;
    const mainSection = document.getElementById("main")!;
    const isNotCollapsed = !sideBar.classList.contains("siderbar-collapse");
    sideBar.classList.toggle("siderbar-collapse");
    (document.getElementById("companyLogo") as HTMLImageElement).src =
      isNotCollapsed
        ? "./assets/tezologo-minimize.svg"
        : "./assets/tezoLogo.svg";
    mainSection.style.width = isNotCollapsed
      ? "calc(100% - 3.0625rem - 1.6rem)"
      : "";
    document.getElementById("sideNavRoleText")!.innerHTML = isNotCollapsed
      ? "ROLE"
      : "ROLE/USER MANAGEMENT";
    document.getElementById("sidebarIcon")!.style.rotate = isNotCollapsed
      ? "180deg"
      : "0deg";
  };

  generateAlphabets = (): void => {
    const alphabets = document.getElementById("alphabetsWrapper")!;
    if (alphabets) {
      for (let i = 0; i < 26; i++) {
        alphabets.innerHTML += `<li onclick="utilsObj.activeAlphabet(this)" id="${String.fromCharCode(
          65 + i
        )}">${String.fromCharCode(65 + i)}</li>`;
      }
    }
  };

  previousAlphabetElement!: HTMLElement;
  activeAlphabet = (alphabet: HTMLElement): void => {
    if (this.previousAlphabetElement)
      this.previousAlphabetElement.classList.remove("alphabet-active");
    this.previousAlphabetElement = alphabet;
    alphabet.classList.add("alphabet-active");
    storageObject.searchFilters["alaphabet"] = alphabet.id;
    document
      .getElementById("alphabetsFilter")!
      .classList.add("img-filter-active");
    empServices.displayEmployees(storageObject.allEmployees);
  };

  turnOffAlphabetFilter = (imgFilter: HTMLImageElement): void => {
    imgFilter.classList.remove("img-filter-active");
    if (this.previousAlphabetElement)
      this.previousAlphabetElement.classList.remove("alphabet-active");
    storageObject.searchFilters["alaphabet"] = "";
    empServices.displayEmployees(storageObject.allEmployees);
  };

  toggleAllCheckboxes = (selectAllCheckBox: HTMLInputElement) => {
    if (selectAllCheckBox.checked) {
      storageObject.allEmployees.forEach(
        (employee) => (employee.ischeckedForDelete = true)
      );
      storageObject.searchFilters["selectAll"] = "checked";
    } else {
      storageObject.searchFilters["selectAll"] = "unchecked";
      storageObject.allEmployees.forEach(
        (employee) => (employee.ischeckedForDelete = false)
      );
    }
    empServices.toogleDeleteBtnState(selectAllCheckBox.checked);
    empServices.displayEmployees(storageObject.allEmployees);
  };

  resetAllFilters = (): void => {
    const filterSection = document.getElementById("filter")!;
    const allFilterOptions = Array.from(
      filterSection.getElementsByTagName("select")
    );
    allFilterOptions.forEach((filter) => {
      filter.value = "";
      this.toggleSelectTagState(filter);
    });
    this.updateSelectFilters();
    this.updateButtonState();
  };

  updateSelectFilters = (): void => {
    storageObject.searchFilters["active"] = (
      document.getElementById("status") as HTMLSelectElement
    ).value;
    storageObject.searchFilters["location"] = (
      document.getElementById("Location") as HTMLSelectElement
    ).value;
    storageObject.searchFilters["department"] = (
      document.getElementById("Department") as HTMLSelectElement
    ).value;
    empServices.displayEmployees(storageObject.allEmployees);
  };

  updateButtonState = (): void => {
    const applyFilterButton = document.getElementById(
      "applyBtn"
    ) as HTMLButtonElement;
    const resetFilterButton = document.getElementById(
      "resetBtn"
    ) as HTMLButtonElement;
    const filterSection = document.getElementById("filter")!;
    const allFilterOptions = Array.from(
      filterSection.getElementsByTagName("select")
    );
    const flag = Array.from(allFilterOptions).some(
      (element) => element.value !== ""
    );
    applyFilterButton.disabled = resetFilterButton.disabled = !flag;
    applyFilterButton.style.cursor = resetFilterButton.style.cursor = flag
      ? "pointer"
      : "";
    applyFilterButton.style.backgroundColor = flag ? "#F44848" : "";
  };

  intilizeOptions = (): void => {
    let jsonObj: Options = storageObject.fetchOptionsFromDB();
    this.assignOptions(jsonObj);
  };

  assignOptions = (obj: Options): void => {
    for (let key in obj) {
      let selectTag = document.getElementsByName(
        key
      ) as NodeListOf<HTMLSelectElement>;
      selectTag.forEach((name) => this.addOption(name, obj));
    }
  };

  addOption = (selectTag: HTMLSelectElement, obj: Options): void => {
    for (let field of obj[selectTag.name]) {
      let option = document.createElement("option");
      option.value = field;
      option.text = field ? field : selectTag.name;
      selectTag.add(option);
    }
  };

  updateSearchFilter = (event: Event): void => {
    storageObject.searchFilters["searchBar"] = (
      event?.target as HTMLInputElement
    ).value;
    empServices.displayEmployees(storageObject.allEmployees);
  };

  toggleSelectTagState = (selectElement: HTMLSelectElement): void => {
    selectElement.classList.toggle("active-element", selectElement.value != "");
  };
}

let utilsObj = new Utils();
(window as any).utilsObj = utilsObj;

document.addEventListener("click", (event: Event) => {
  if (utilsObj.additionalOptionsElement) {
    const isAdditionalOption = (
      event.target as HTMLElement
    ).classList?.contains("additional-options");
    const isEllipsis = (event.target as HTMLElement).classList.contains(
      "ellipsis"
    );
    if (!isAdditionalOption && !isEllipsis) utilsObj.toggleOptions();
  }
});

utilsObj.generateAlphabets();
utilsObj.intilizeOptions();

export { utilsObj };
