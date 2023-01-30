
const canvas = document.getElementById("thecanvas")
const ctx = canvas.getContext("2d");

//canvas bằng màn hình
canvas.width = innerWidth;
canvas.height = innerHeight;

//tạo nhân vật
class Nhanvat {
    x;
    y;
    radius;
    color;

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
    }

    drawPl() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill()
    }
}

let player = new Nhanvat(canvas.width / 2, canvas.height / 2, 20, 'white');

//tạo đạn
class Projectile {
    x;
    y;
    radius;
    color;
    vantoc;

    constructor(x, y, r, color, vantoc) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
        this.vantoc = vantoc;
    }

    drawPr() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill()
    }

    capnhat() {
        this.drawPr();
        this.x += this.vantoc.x;
        this.y += this.vantoc.y;
    }
}

let projectiles = [];

//tạo event bắn đạn khi click chuột
addEventListener("click", (event) => {
        let goc = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2 );
        let vantoc = {
            x: Math.cos(goc) * 5,
            y: Math.sin(goc) * 5
        };
        projectiles.push(new Projectile(canvas.width / 2,
            canvas.height / 2,
            5,
            "white",
            vantoc)
        )
    let gun = new Audio("lasergun.mp3");
        gun.play();
    }
)

//tạo score
let score = 0;
document.getElementById("score").innerText = score;

//tạo các hiệu ứng, chuyển động
let aniId;
function animated() {
    //thực hiện lặp lại chức năng animated liên tục
    aniId = requestAnimationFrame(animated);
    //xóa các bản vẽ cũ
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.drawPl();

    //bắn đạn
    projectiles.forEach((projectile, pIndex) => {
        projectile.capnhat();

        //xóa đạn khỏi viền màn hình
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                    projectiles.splice(pIndex, 1)
                }, 0
            )
        }
    })

    //kết thúc trò chơi
    enemies.forEach((enemy, index) => {
            enemy.capnhat();
            let khoangcachple = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            if (khoangcachple - player.radius - enemy.radius < 0.5) {
                cancelAnimationFrame(aniId);
                document.getElementById("totalStart").style.display = "initial";
                document.getElementById("points").innerText = score + " points";
            }

            //xóa đạn và enemy
            projectiles.forEach((projectile, projectileIndex) => {
                let khoangcachpre = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                if (khoangcachpre - projectile.radius - enemy.radius < 0.5) {
                    if (enemy.radius - 10 > 10) {
                        enemy.radius -= 10;
                        setTimeout(() => {
                                projectiles.splice(projectileIndex, 1)
                            }, 0
                        )
                        //tăng 1 điểm khi bắn trúng 1 phát mà ko giết
                        score++;
                        document.getElementById("score").innerText = score;
                    } else {
                        setTimeout(() => {
                                enemies.splice(index, 1);
                                projectiles.splice(projectileIndex, 1)
                            }, 0
                        )
                        //tăng 2 điểm khi giết được địch
                        score += 2;
                        document.getElementById("score").innerText = score;
                    }

                }
            })
        }
    )
}

//tạo enemy
class Enemy {
    x;
    y;
    radius;
    color;
    vantoc;

    constructor(x, y, r, color, vantoc) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
        this.vantoc = vantoc;
    }

    drawE() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill()
    }

    capnhat() {
        this.drawE();
        this.x += this.vantoc.x;
        this.y += this.vantoc.y;
    }
}

let enemies = [];
let time = 1000;

function spawnEnemies() {
    setInterval(() => {
            let radius = Math.random() * (30 - 10) + 10;
            let x;
            let y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            }
            let color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            let goc = Math.atan2(canvas.height / 2 - y,
                canvas.width / 2 - x);
            let vantoc = {
                x: Math.cos(goc),
                y: Math.sin(goc)
            };
            if (score >= 200) {
                vantoc = {
                    x: Math.cos(goc)*3,
                    y: Math.sin(goc)*3
                };
                time = 0.2;
                radius = Math.random() * (50 - 40) + 10;
            } else if (score >= 150) {
                vantoc = {
                    x: Math.cos(goc)*2.2,
                    y: Math.sin(goc)*2.2
                };
                time = 5;
                radius = Math.random() * (40 - 20) + 10;
            } else if (score >= 100) {
                vantoc = {
                    x: Math.cos(goc)*1.6,
                    y: Math.sin(goc)*1.6
                };
                time = 20;
                radius = Math.random() * (30 - 10) + 10;
            } else if (score >= 50) {
                vantoc = {
                    x: Math.cos(goc)*1.3,
                    y: Math.sin(goc)*1.3
                };
                time = 100;
                radius = Math.random() * (20 - 10) + 10;
            } else if (score >= 20) {
                vantoc = {
                    x: Math.cos(goc)*1.1,
                    y: Math.sin(goc)*1.1
                };
                time = 500;
                radius = Math.random() * (10 - 10) + 10;
            }
            enemies.push(new Enemy(
                    x,
                    y,
                    radius,
                    color,
                    vantoc
                )
            )
        }
        , time)
}

//tạo hàm reset để bắt đầu lại
function reset() {
    player = new Nhanvat(canvas.width / 2, canvas.height / 2, 20, 'white');
    projectiles = [];
    enemies = [];
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("points").innerHTML = "points";
    document.getElementById("startgame").innerHTML = "Press to Restart";
    time = 1000;
}

//tạo nhạc chuông
let music = new Audio("music.mp3");

//tạo nút start game
function startGame() {
    reset();
    document.getElementById("totalStart").style.display = "none";
    spawnEnemies();
    animated();
    music.loop = true;
    music.play();
}