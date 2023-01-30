"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.House = void 0;
class House {
    constructor(FiveRoomApartmentsPerFloor, // На все
    ThreeRoomApartmentsPerFloor, TwoRoomApartmentsPerFloor, PersonModifier = 1, EnteranceCount = 1, FloorsCount = 1) {
        this.FiveRoomApartmentsPerFloor = FiveRoomApartmentsPerFloor;
        this.ThreeRoomApartmentsPerFloor = ThreeRoomApartmentsPerFloor;
        this.TwoRoomApartmentsPerFloor = TwoRoomApartmentsPerFloor;
        this.PersonModifier = PersonModifier;
        this.EnteranceCount = EnteranceCount;
        this.FloorsCount = FloorsCount;
        this.MonthlyPaymentPerRoom = 0;
        this.TotalExpenses = 0;
        this.Apartments = [];
        this.FiveRoomApartmentsPerFloor = FiveRoomApartmentsPerFloor;
        this.ThreeRoomApartmentsPerFloor = ThreeRoomApartmentsPerFloor;
        this.TwoRoomApartmentsPerFloor = TwoRoomApartmentsPerFloor;
        this.PersonModifier = PersonModifier;
        this.EnteranceCount = EnteranceCount;
        this.FloorsCount = FloorsCount;
    }
    ConfigurePaymentPerRoom(ConsumablesCost, WagesCost) {
        this.TotalExpenses = ConsumablesCost + WagesCost;
        this.updatePayment();
    }
    updatePayment() {
        let RoomsCount = 0;
        this.Apartments.map(aps => {
            RoomsCount += aps.NumberOfRooms;
        });
        if (RoomsCount == 0) {
            this.MonthlyPaymentPerRoom = this.TotalExpenses;
        }
        else {
            this.MonthlyPaymentPerRoom = +(this.TotalExpenses / RoomsCount).toFixed(2);
            this.Apartments.map(aps => {
                aps.MonthlyPayment = this.MonthlyPaymentPerRoom * aps.NumberOfRooms + (this.MonthlyPaymentPerRoom * this.PersonModifier);
            });
        }
        console.log(`Now rate per room is ${this.MonthlyPaymentPerRoom}`);
    }
    GetApartmentNumber(enterance, floor) {
        let c = 0;
        this.Apartments.map(Apartment => {
            if (Apartment.Floor == floor && Apartment.Enterance == enterance) {
                c++;
            }
        });
        return +`${enterance}${floor}${c}`;
    }
    ConfigureApartment(Data) {
        if (this.MonthlyPaymentPerRoom < 1) {
            console.error('ERROR: Payment per room is not configured, you must configure it first before configuring apartments');
            return;
        }
        if (Math.abs(Data.Enterance) > this.EnteranceCount || Math.abs(Data.Floor) > this.FloorsCount || Data.Enterance < 1 || Data.Floor < 1) {
            console.error('ERROR: Invalid Enterance / Floor value');
            return;
        }
        let AvailableApartmentsCount;
        switch (Data.NumberOfRooms) {
            case 2: {
                AvailableApartmentsCount = this.TwoRoomApartmentsPerFloor;
                break;
            }
            case 3: {
                AvailableApartmentsCount = this.ThreeRoomApartmentsPerFloor;
                break;
            }
            default: {
                AvailableApartmentsCount = this.FiveRoomApartmentsPerFloor;
                break;
            }
        }
        this.Apartments.map(Apartment => {
            if (Apartment.Floor == Data.Floor && Apartment.Enterance == Data.Enterance && Apartment.NumberOfRooms == Data.NumberOfRooms) {
                AvailableApartmentsCount--;
            }
        });
        if (AvailableApartmentsCount < 1) {
            console.error('ERROR: Not enough space on the floor');
            return;
        }
        const NewApartment = {
            Number: this.GetApartmentNumber(Data.Enterance, Data.Floor),
            Floor: Data.Floor,
            NumberOfRooms: Data.NumberOfRooms,
            Residents: Data.Residents,
            Enterance: Data.Enterance,
            MonthlyPayment: Data.NumberOfRooms * this.MonthlyPaymentPerRoom * (Data.Residents.length * this.PersonModifier),
            Balance: 0,
            Bonus: 0,
            PaidThisMonth: false
        };
        this.Apartments.push(NewApartment);
        this.updatePayment();
    }
    GetApartmentsRepos() {
        return this.Apartments;
    }
    ConductPayment(ApartmentNumber, Amount) {
        let total = 0;
        let CreditorsCount = 0;
        this.Apartments.forEach(Apartment => {
            if (Apartment.Bonus > 0) {
                CreditorsCount++;
            }
        });
        this.Apartments.forEach(Apartment => {
            if (Apartment.Number == ApartmentNumber) {
                let debt = Apartment.Balance < 0 ? Math.abs(Apartment.Balance) : 0; //Has debt
                total = Apartment.MonthlyPayment - Apartment.Balance;
                Apartment.Balance = Amount - total;
                Apartment.PaidThisMonth = true;
                if (debt > 0 && Apartment.Balance >= 0 && CreditorsCount > 0) {
                    this.PayDebt(debt / CreditorsCount);
                }
            }
        });
    }
    PayDebt(Amount) {
        console.log("DebtToPay:" + Amount);
        this.Apartments.forEach(Apartment => {
            if (Apartment.Bonus > 0) {
                Apartment.Balance += Amount;
                Apartment.Bonus -= Amount;
            }
        });
    }
    EndMonth() {
        let TotalDebt = 0;
        let CanLend = 0;
        this.Apartments.forEach(Apartment => {
            if (!Apartment.PaidThisMonth) {
                Apartment.Balance -= Apartment.MonthlyPayment;
            }
            else if (Apartment.Balance >= 0) {
                CanLend++;
            }
            if (Apartment.Balance < 0) {
                TotalDebt += Apartment.Balance;
            }
            Apartment.PaidThisMonth = false;
        });
        TotalDebt /= CanLend;
        this.Apartments.forEach(Apartment => {
            if (Apartment.Balance >= 0) {
                Apartment.Balance += TotalDebt;
                Apartment.Bonus -= TotalDebt;
            }
        });
    }
}
exports.House = House;
