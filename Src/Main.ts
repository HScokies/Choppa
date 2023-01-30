interface IEmployee{
    ID:number,
    Name:string,
    Salary:number,
    Post:string
}

abstract class EmployeeRepos{
    static Count:number = 0;

    private static Employees:IEmployee[] = [];

 
    protected SaveDB( employee:IEmployee):void{
        EmployeeRepos.Employees.map(prop =>{
            if (prop.ID == employee.ID){
                prop = employee;
                return;
            }
        })
        EmployeeRepos.Employees.push(employee);
    }

    static GetTotalSalary():number{
        let sum:number = 0;
        EmployeeRepos.Employees.map(val => {
            sum+=val.Salary;
        })
        return sum;
    }
}

class Employee extends EmployeeRepos{
    readonly ID:number;
    constructor(
        public Post:string,
        public Name:string,
        public Salary:number =  16_242
    )
    {
        super();
        this.ID = EmployeeRepos.Count++;
        this.Post = Post;
        this.Name = Name;
        this.Salary = Salary;
    }
    Save(){
        let employee:IEmployee = {
            ID: this.ID,
            Post: this.Post,
            Name: this.Name,
            Salary: this.Salary
        };
        super.SaveDB(employee);
        console.log(`Сотрудник ${employee.Name} успешно добавлен в базу данных!`);
    }
}

import e from './Employees.json';
e.forEach(data =>{
    const emp = new Employee(data['Post'], data['Name'], data['Salary']);
    emp.Save();
})

import { House } from './House';
const House1 = new House(1,2,4,0.1,5,9);
House1.ConfigurePaymentPerRoom(10_000, EmployeeRepos.GetTotalSalary());

import a from './Apartments.json';
a.forEach(data =>{
    House1.ConfigureApartment(data);
})
House1.GetApartmentsRepos().forEach(apartment => {
    if (apartment.Number != 110 && apartment.Number != 261)
        House1.ConductPayment(apartment.Number, Math.random() * 3000);
    else if (apartment.Number == 261)
        House1.ConductPayment(apartment.Number, 3000);
})

//console.log(House1);
House1.EndMonth();
console.clear();
console.log(House1.getApartment(110));
console.log(House1.getApartment(261));
House1.ConductPayment(110, 6000);
console.log("\n");
console.log(House1.getApartment(110));
console.log(House1.getApartment(261));
/*
  MonthlyPayment: 1566.275,
  Balance: -31.834192513810308,
  Bonus: 922.8872655299471,
 */


/*
    1. Добавление сотрудника new Employee(Пост, Имя, ЗП);

*/