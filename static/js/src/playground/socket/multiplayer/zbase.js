class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://game.wegoon.top/wss/multiplayer/");
        this.start();
    }

    start() {

    }
}