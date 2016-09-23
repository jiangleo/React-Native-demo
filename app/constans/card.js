import config from '../../config.js';
const host = config.host;


export const myCardContent = [
    {
        uri: "http://"+host+"/icon/reading.png",
        title: "我的订阅",
        description: "暂时还没有新的消息哦！",

    },
    {
        uri:"http://"+host+"/icon/calendar.png",
        title:"我的足迹",
        description:"看过的、筛选过的都在这里"
    },
];


export const recommendCardContent = [
    [
        {
            uri:"http://"+host+"/icon/goods.png",
            title:"附近有好货",
            description:"家门口有宝快来",
        },
        {
            uri:"http://"+host+"/icon/house.png",
            title:"精选好房",
            description:"附近好屋是我家",
        },
    ],
    [
        {
            uri:"http://"+host+"/icon/car.png",
            title:"个人好车",
            description:"海量个人车源任你挑",
        },
        {
            uri:"http://"+host+"/icon/money.png",
            title:"贷款神器",
            description:"无抵押 房贷快",
        }
    ],
];