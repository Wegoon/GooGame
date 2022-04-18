let MY_GAME_OBJECT = [];

class MyGameObject {
    constructor() {
        MY_GAME_OBJECT.push(this);
        this.has_called_start = false; // 是否执行过start函数
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }
    create_uuid() {
        let res = "";
        for (let i = 0; i < 20; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }
    start() { // 只会在第一帧执行一次

    }
    update() { // 每一帧都会执行一次

    }
    on_destroy() { // 在被销毁前执行一次

    }
    destroy() { // 删掉该物体
        this.on_destroy();
        for (let i = 0; i < MY_GAME_OBJECT.length; i++) {
            if (MY_GAME_OBJECT[i] === this) {
                MY_GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

let last_timestamp;
let MY_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < MY_GAME_OBJECT.length; i++) {
        let obj = MY_GAME_OBJECT[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(MY_GAME_ANIMATION);
}

requestAnimationFrame(MY_GAME_ANIMATION);
