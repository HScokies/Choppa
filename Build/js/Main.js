"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = exports.EmployeeRepos = void 0;
class EmployeeRepos {
    SaveDB(employee) {
        EmployeeRepos.Employees.map(prop => {
            if (prop.ID == employee.ID) {
                prop = employee;
                return;
            }
        });
        EmployeeRepos.Employees.push(employee);
    }
    static GetTotalSalary() {
        let sum = 0;
        EmployeeRepos.Employees.map(val => {
            sum += val.Salary;
        });
        return sum;
    }
}
exports.EmployeeRepos = EmployeeRepos;
EmployeeRepos.Count = 0;
EmployeeRepos.Employees = [];
class Employee extends EmployeeRepos {
    constructor(Post, Name, Salary = 16242) {
        super();
        this.Post = Post;
        this.Name = Name;
        this.Salary = Salary;
        this.ID = EmployeeRepos.Count++;
        this.Post = Post;
        this.Name = Name;
        this.Salary = Salary;
    }
    Save() {
        let employee = {
            ID: this.ID,
            Post: this.Post,
            Name: this.Name,
            Salary: this.Salary
        };
        super.SaveDB(employee);
        console.log(`Сотрудник ${employee.Name} успешно добавлен в базу данных!`);
    }
}
exports.Employee = Employee;
const Employees_json_1 = __importDefault(require("./Employees.json"));
Employees_json_1.default.forEach(data => {
    const emp = new Employee(data['Post'], data['Name'], data['Salary']);
    emp.Save();
});
const House_1 = require("./House");
const House1 = new House_1.House(1, 2, 4, 0.1, 5, 9);
House1.ConfigurePaymentPerRoom(10000, EmployeeRepos.GetTotalSalary());
const Apartments_json_1 = __importDefault(require("./Apartments.json"));
Apartments_json_1.default.forEach(data => {
    House1.ConfigureApartment(data);
    console.log(data);
});
