let names:string[] = "Анна;Иван;Полина;Владимир;Ника;Александра;Анастасия;Артём;Ева;Мария;Кирилл;Дарья;Григорий;Аделина;Лев;Максим;Таисия;Демид;Ярослав;Вера;Олеся;Вероника;Софья;Юрий;Стефания;Михаил;Глеб;Макар;Василиса;Николай;София;Виктория;Евдокия;Всеволод;Юлия;Мирон;Александр;Евгения;Пётр;Давид;Елизавета;Дмитрий;Игорь;Ксения;Ясмина;Злата;Валерия;Платон;Валерий;Илья;Лидия;Матвей;Тимофей;Демьян;Ульяна;Ярослава;Даниил;Егор;Фёдор;Алиса;Алия;Анжелика;Арсений;Савелий;Малика;Эмир;Милана;Павел;Лея;Денис;Андрей;Ольга;Вячеслав;Марк;Руслан;Екатерина;Алина;Кристина;Арсен;Роман;Мариам;Виктор;Сергей;Лилия;Агния;Татьяна;Семён;Данил;Эмилия;Мирослав;Нелли;Асия;Маргарита;Леонид;Кира;Адам;Никита;Лука;Варвара;Георгий".split(';');
let lastNames:string[] = "Иванов;Смирнов;Кузнецов;Попов;Васильев;Петров;Соколов;Михайлов;Новиков;Федоров;Морозов;Волков;Алексеев;Лебедев;Семёнов;Егоров;Павлов;Козлов;Степанов;Николаев;Орлов;Андреев;Макаров;Никитин;Захаров;Зайцев;Соловьёв;Борисов;Яковлев;Григорьев;Романов;Воробьёв;Сергеев;Кузьмин;Фролов;Александров;Дмитриев;Королёв;Гусев;Киселёв;Ильин;Максимов;Поляков;Сорокин;Виноградов;Ковалёв;Белов;Медведев;Антонов;Тарасов;Жуков;Баранов;Филиппов;Комаров;Давыдов;Беляев;Герасимов;Богданов;Осипов;Сидоров;Матвеев;Титов;Марков;Миронов;Крылов;Куликов;Карпов;Власов;Мельников;Денисов;Гаврилов;Тихонов;Казаков;Афанасьев;Данилов;Савельев;Тимофеев;Фомин;Чернов;Абрамов;Мартынов;Ефимов;Федотов;Щербаков;Назаров;Калинин;Исаев;Чернышев;Быков;Маслов;Родионов;Коновалов;Лазарев;Воронин;Климов;Филатов;Пономарёв;Голубев;Кудрявцев;Прохоров".split(';');
interface IApartment{
    Floor: number,
    NumberOfRooms: number,
    Residents: string[],
    Enterance: number
}

let FloorCount = 9;
let EnteranceCount = 5;
let perRoom = 431988 / 315;
let PersonModifier = .1;
let apsPerFloor = 1+2+4;
/*
5 = 1 (per floor)
3 = 2 (per floor)
2 = 4 (per floor)
*/
const getResidents = (NofRooms:number):string[] => {
    let ResidentsC = Math.floor(Math.random() * (NofRooms + 2)) + 1; // 1 - numberOfRooms+2;
    let Residents:string[] = [];
    for (let i=0; i<ResidentsC; i++){
        Residents.push(`${names[Math.floor(Math.random()*100)]} ${lastNames[Math.floor(Math.random()*100)]}`);
    }
    return Residents;
}

let data:IApartment[] = [];
for (let i=1; i <= EnteranceCount; i++){
    for (let j=1; j<= FloorCount; j++){
        for (let k=0; k<apsPerFloor; k++){
            let Apartment:IApartment = {
                Floor: j,
                NumberOfRooms: 2,
                Residents: [],
                Enterance: i
            }
            if (k == 0){
                Apartment.NumberOfRooms = 5;
                Apartment.Residents = getResidents(5);
                data.push(Apartment);
            }
            else if (k < 3){
                Apartment.NumberOfRooms = 3;
                Apartment.Residents = getResidents(3);
                data.push(Apartment);
            }
            else if (k>2){
                Apartment.NumberOfRooms = 2;
                Apartment.Residents = getResidents(2);
                data.push(Apartment);
            }
        }
    }
}
console.log(data);let Json = JSON.stringify(data);
document.write(Json);


