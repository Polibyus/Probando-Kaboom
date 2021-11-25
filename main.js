const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480
let HP = 3

// initialize kaboom context
kaboom();

// load a sprite polibyus gif 
loadSprite("poli", "sprites/poli.png")

scene("game", () => {

    // gravity
    gravity(2400);

    // add pj to map
    const poli = add([
        sprite("poli"),
        pos(80, 40),
        area(),
        body(),
        health(HP),
    ])
    // add platform
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        origin("botleft"),
        area(),
        solid(),
        color(127, 200, 255),
    ])
    // jump and colides
    // avoid using jump in air
    function jump () {
        if (poli.isGrounded()) {
            poli.jump(JUMP_FORCE);
        }
    };
    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);
    // add a tree like an obstacle 1 sec
    function spawnTree() {
        add([
            // the tree components
            rect(48, rand (24,90)),
            area(),
            outline(2),
            pos(width(), height() - FLOOR_HEIGHT),
            origin("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree", // like a name, or tag
        ]);
        wait(rand(1.5, 3), spawnTree);
    }
    spawnTree();

    // shake it baby
    poli.onCollide("tree", () => {
        addKaboom(poli.pos);
        shake();
        poli.hurt(1);
        HP = HP - 1;
        HPlabel.text = HP;
    });

    poli.on("death", () => {
        destroy(poli)
        go("lose", score)
    })
    // score counter on time
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24)
    ])

    const HPlabel = add([
        text(HP),
        pos(980, 24)
    ])

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    scene("lose", (score) => {

        add([
            sprite("poli"),
            pos(width() / 2, height() / 2 - 80),
            scale(2),
            origin("center"),
        ]);

        // display score
        add([
            text(`perdiste, hiciste ${score} puntos`),
            pos(width() / 2, height() / 2 + 80),
            scale(1),
            origin("center"),
        ]);

        // go back to game with space is pressed
        onKeyPress("space", () => go("game"));
        onClick(() => go("game"));
    });
});


go("game");