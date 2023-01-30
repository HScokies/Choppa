interface IApartment{
    Number:number;
    Floor:number;
    NumberOfRooms: number;
    Residents:string[];
    Enterance: number;
    MonthlyPayment:number;
    Balance:number; //Debt / Bonuses
    Bonus:number;
    PaidThisMonth:boolean;
}
interface IApartmentCFG{
    Floor:number;
    NumberOfRooms: number;
    Residents:string[];
    Enterance: number;
}


export class House{
    private MonthlyPaymentPerRoom = 0;
    private TotalExpenses = 0;
    private Apartments:IApartment[] = [];

    constructor(
    private FiveRoomApartmentsPerFloor:number, // На все
    private ThreeRoomApartmentsPerFloor:number,
    private TwoRoomApartmentsPerFloor:number,
    private PersonModifier:number = 1,
    private EnteranceCount:number = 1,
    private FloorsCount:number = 1
    ){
        this.FiveRoomApartmentsPerFloor = FiveRoomApartmentsPerFloor;
        this.ThreeRoomApartmentsPerFloor = ThreeRoomApartmentsPerFloor;
        this.TwoRoomApartmentsPerFloor = TwoRoomApartmentsPerFloor;
        this.PersonModifier = PersonModifier;
        this.EnteranceCount = EnteranceCount;
        this.FloorsCount = FloorsCount;
    }

    ConfigurePaymentPerRoom(ConsumablesCost:number, WagesCost:number){
        this.TotalExpenses = ConsumablesCost + WagesCost;
        this.updatePayment();
    }
    updatePayment(){
        let RoomsCount = 0;
        this.Apartments.map(aps =>{
            RoomsCount += aps.NumberOfRooms;
        });
        if (RoomsCount == 0){
            this.MonthlyPaymentPerRoom = this.TotalExpenses;
        }
        else{
        this.MonthlyPaymentPerRoom =  +(this.TotalExpenses / RoomsCount).toFixed(2);
        this.Apartments.map(aps =>{
            aps.MonthlyPayment = this.MonthlyPaymentPerRoom * aps.NumberOfRooms + (this.MonthlyPaymentPerRoom *  (aps.Residents.length * this.PersonModifier));

        });
        }
        console.log(`Now rate per room is ${this.MonthlyPaymentPerRoom}`);
    }
    private GetApartmentNumber(enterance: number, floor:number):number{
        let c = 0;
        this.Apartments.map(Apartment =>{
            if (Apartment.Floor == floor && Apartment.Enterance == enterance){
                c++;
            }
        });
        return +`${enterance}${floor}${c}` 
    }

    ConfigureApartment(Data:IApartmentCFG):void{
        if (this.MonthlyPaymentPerRoom < 1){
            console.error('ERROR: Payment per room is not configured, you must configure it first before configuring apartments');
            return;
        }
        if (Math.abs(Data.Enterance) > this.EnteranceCount || Math.abs(Data.Floor) > this.FloorsCount || Data.Enterance < 1 || Data.Floor < 1){
            console.error('ERROR: Invalid Enterance / Floor value');
            return;
        }
        let AvailableApartmentsCount:number;
        switch (Data.NumberOfRooms){
            case 2:{
                AvailableApartmentsCount = this.TwoRoomApartmentsPerFloor;
                break;
            }
            case 3:{
                AvailableApartmentsCount = this.ThreeRoomApartmentsPerFloor;
                break;
            }
            default:{
                AvailableApartmentsCount = this.FiveRoomApartmentsPerFloor;
                break;
            }
        }
        this.Apartments.map(
            Apartment => {
                if (Apartment.Floor == Data.Floor && Apartment.Enterance == Data.Enterance && Apartment.NumberOfRooms == Data.NumberOfRooms){
                    AvailableApartmentsCount--;
                }
            }
        )
        if (AvailableApartmentsCount < 1){
            console.error('ERROR: Not enough space on the floor')
            return;
        }
        const NewApartment:IApartment = {
            Number: this.GetApartmentNumber(Data.Enterance, Data.Floor),
            Floor: Data.Floor,
            NumberOfRooms: Data.NumberOfRooms,
            Residents: Data.Residents,
            Enterance: Data.Enterance,
            MonthlyPayment: Data.NumberOfRooms * this.MonthlyPaymentPerRoom * (Data.Residents.length * this.PersonModifier), //Calc
            Balance: 0, //Debt / Bonuses
            Bonus: 0,
            PaidThisMonth:false
        }
        this.Apartments.push(NewApartment);
        this.updatePayment();
    }

    GetApartmentsRepos(){
        return this.Apartments;
    }
   
    ConductPayment(ApartmentNumber:number, Amount:number){
        let total:number = 0;
        let CreditorsCount:number = 0;
        this.Apartments.forEach(Apartment=>{
            if (Apartment.Bonus > 0){
                CreditorsCount++;
            }
        })

        this.Apartments.forEach(Apartment => {
            if (Apartment.Number == ApartmentNumber){
                let debt:number = Apartment.Balance < 0 ? Math.abs(Apartment.Balance) : 0; //Has debt
                total = Apartment.MonthlyPayment + debt;

                Apartment.Balance = Amount - total;
                Apartment.PaidThisMonth = true;

                if (debt > 0 && Apartment.Balance >= 0 && CreditorsCount > 0){
                    this.PayDebt(debt/CreditorsCount);
                }

                
            }
        });
    }

    PayDebt(Amount:number){
        //console.log("DebtToPay:"+Amount);
        this.Apartments.forEach(Apartment =>{
            if (Apartment.Bonus > 0){
                Apartment.Balance+=Amount;
                Apartment.Bonus-=Amount;
            }
        })
    }

    EndMonth(){
        let TotalDebt = 0;
        let CanLend = 0;
        this.Apartments.forEach(Apartment =>{
            if (!Apartment.PaidThisMonth){
                Apartment.Balance -= Apartment.MonthlyPayment;
            }
            else if (Apartment.Balance >= 0){
                CanLend++;
            }

            if (Apartment.Balance < 0){
                TotalDebt+=Apartment.Balance;
            }
            Apartment.PaidThisMonth = false;
        })
        TotalDebt /= CanLend;
        this.Apartments.forEach(Apartment =>{
            if (Apartment.Balance >= 0){
                Apartment.Balance += TotalDebt;
                Apartment.Bonus -= TotalDebt;
            }
        })
    }

    getApartment(ApartmentNumber:number):IApartment | string{
        let data:IApartment | string = 'Not Found';
        this.Apartments.forEach(apartment=>{
            if (ApartmentNumber == apartment.Number){
                data = apartment;
            }
        })
        return data;
    }
    getResidentsInDebt(){
        let InDebt:IApartment[] = [];
        this.Apartments.forEach(apartment=>{
            if (apartment.Balance < 0 && apartment.Bonus < 1){
                InDebt.push(apartment);
            }
        })
        return InDebt;
    }
}