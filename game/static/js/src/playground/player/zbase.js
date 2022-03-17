class Player extends MyGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        // console.log(playground.height);
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x, this.y = y;
        this.vx = 0, this.vy = 0;
        this.damage_x = 0, this.damage_y = 0;
        this.damage_speed = 0;

        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;

        this.cur_skill = null;

        this.start();
    }
    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                console.log("移动");
                outer.move_to(e.clientX, e.clientY);
                // console.log(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    console.log("发射");
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function (e) {
            // console.log(e.which);
            if (e.which === 81) { // Q键
                console.log("准备发射火球");
                outer.cur_skill = "fireball";
                return false;
            }

        });
    }
    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 0.7;
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage)
    }
    is_attacked(angle, damage) {
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return true;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.cos(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        // console.log(this.move_length);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        // console.log(angle);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        // console.log(this.vx, this.vy);
    }

    update() {
        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            console.log("this.x:", this.x);
            console.log("this.y:", this.y);
            this.x = Math.min(Math.max(this.x, 0), this.playground.width);
            this.y = Math.min(Math.max(this.y, 0), this.playground.height);
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                // console.log(this.speed);
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                // console.log(this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}