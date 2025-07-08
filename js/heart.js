const bgImage = new Image();
bgImage.src = ''; // �  自�  顔画� 

let bgReady = false;

bgImage.onload = () => {
  bgReady = true;
};



var
    NUM = 100, // ハ� ト� 数
    SIZE = 0.004, // ハ� ト� 大きさ
    SPEED = 0.03, // 上� するスピ� � 
    SCREEN_ROTATION = 0.2, // 画面の傾� 

    canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d');


// 3次� ��転行�  ( 参�    http://ja.wikipedia.org/wiki/回転行�  )
function Matrix3() {}

Matrix3.prototype = {
    // 単位行� 
    0:1, 1:0, 2:0, 3:0, 4:1, 5:0, 6:0, 7:0, 8:1,

    // 行� の� 
    mul: function() {
        var a = this, b = arguments, c = new Matrix3();

        c[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
        c[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
        c[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
        c[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
        return c;
    },

    // X軸回転
    rx: function(t) {
        var c = Math.cos(t), s = Math.sin(t);
        return this.mul(1, 0, 0, 0, c, -s, 0, s, c);
    },

    // Y軸回転
    ry: function(t) {
        var c = Math.cos(t), s = Math.sin(t);
        return this.mul(c, 0, s, 0, 1, 0, -s, 0, c);
    },

    // Z軸回転
    rz: function(t) {
        var c = Math.cos(t), s = Math.sin(t);
        return this.mul(c, -s, 0, s, c, 0, 0, 0, 1);
    }
};

// 点
function Point3d() {}

Point3d.prototype = {
    // 原点
    x:0, y:0, z:0,

    // 回転(行� との� )
    rotate: function(m) {
        var p = new Point3d();

        p.x = m[0] * this.x + m[1] * this.y + m[2] * this.z;
        p.y = m[3] * this.x + m[4] * this.y + m[5] * this.z;
        p.z = m[6] * this.x + m[7] * this.y + m[8] * this.z;

        return p;
    }
};

// 適当に数値を決める(ある程度規則性を残して� ��)
function random(n) {
    for (var i = 0; i < 6; i++) {
        n ^= n << 3;
        n ^= n >> 2;
    }
    return (n & 0xffffff) / 0x1000000;
}

// 描画
function draw(ctx) {
    var
        i, j, k = 1 + 1 / NUM, p, grad,
        t = new Date() / 1000,
        r = new Matrix3().ry(-t * 0.123).rx(0.8).rz(SCREEN_ROTATION);

    for (i = 0; i < NUM; i++) {
        j = t * SPEED + i * k;

        // ここからひたすら座標変換
        p = new Point3d();
        p.x = random(j);
        p.y = j % 1;
        p.z = random(j + 10000);

        // 原点が� 体� 中� ��なるよ� ��移� 
        p.x -= 0.5;
        p.y -= 0.5;
        p.z -= 0.5;

        // 画面端で� ��な� ��� ��調整
        p.y *= -5;

        // 回転
        p = p.rotate(r);

        // 左右にユラユラさせ� 
        p.x += Math.sin(t * 0.1 + i) * 0.2;

        // 画面奥に移� 
        p.z += 0.5;

        // 画面より手前は描かな� 
        if (p.z <= 0) continue;

        // 三次� ��標から描く位置と大きさを決める
        ctx.save();
        ctx.globalAlpha *= 1 / (p.z + 0.6);
        ctx.translate(p.x / p.z, p.y / p.z);
        ctx.scale(SIZE / p.z, SIZE / p.z);
        ctx.rotate(SCREEN_ROTATION);

         const colors = [
          ['#ff69b4', '#ffe4e1'], // ピンク系
          ['#87cefa', '#f0ffff'], // 水色系
          ['#98fb98', '#e0ffe0'], // 緑系
          ['#ffa07a', '#fff0f0'], // オレンジ系
          ['#dda0dd', '#f8e8ff'], // 紫系
        ];

        const rand = Math.floor(Math.random() * colors.length);
        grad = ctx.createRadialGradient(0, -0.4, 0, 0, -0.4, 4);
        grad.addColorStop(0, colors[rand][0]);
        grad.addColorStop(1, colors[rand][1]);
        ctx.fillStyle = grad;

        

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 1.8);
        ctx.quadraticCurveTo(2, 0, 2, -1);
        ctx.quadraticCurveTo(2, -2, 1, -2);
        ctx.quadraticCurveTo(0, -2, 0, -1);
        ctx.quadraticCurveTo(0, -2, -1, -2);
        ctx.quadraticCurveTo(-2, -2, -2, -1);
        ctx.quadraticCurveTo(-2, 0, 0, 1.8);
        ctx.fill();

        ctx.restore();
    }
}

// メインルー� 
function loop() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  // 背景を描� 
  if (bgReady) {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = bgImage.width / bgImage.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawHeight = canvas.height * 0.5; // �  高さ� 50%に
    drawWidth = bgImage.width * (drawHeight / bgImage.height);
  } else {
    drawWidth = canvas.width * 0.5; // �  � ��50%に
    drawHeight = bgImage.height * (drawWidth / bgImage.width);
  }

  offsetX = (canvas.width - drawWidth) / 2;
  offsetY = (canvas.height - drawHeight) / 2;

  ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
}


  // ハ� トを描く
  ctx.save();
  const scale = Math.max(canvas.width, canvas.height);
  ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
  ctx.scale(scale, scale);

  draw(ctx); // �  �   draw 関数でハ� ト描� ��るやつ  
  ctx.restore();
}



// リサイズ� 
addEventListener('resize', function resize() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    loop();
    return resize;
}(), false);

setInterval(loop, 16);