const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".right");
const prevBtn = document.querySelector(".left");

let current = 0;

function showSlide(index){
  slides[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
}

nextBtn.onclick = () => showSlide(current + 1);
prevBtn.onclick = () => showSlide(current - 1);



document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.category a');
  const items = document.querySelectorAll('.album a');

  // ★ 共通のフィルタリング処理を関数にまとめる


  function filterItems(filterName) {
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      if ( filterName === category) {
        item.classList.remove('hide');
      } else {
        item.classList.add('hide');
      }
    });
  }

  // ★ ページを開いた瞬間に、最初から「Installation」だけでフィルターをかける
  filterItems('Installation');

  // クリックしたときの動き
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // 一度すべてのリンクから active クラスを消し、クリックされたものだけにつける（見た目の切り替え用）
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const filter = link.getAttribute('data-filter');
      filterItems(filter); // クリックされたカテゴリでフィルターを実行
    });
  });
});


// ------------------------------------
// マウスストローク演出（鉛筆風）
// ------------------------------------
(function() {
  // 画面全体を覆うキャンバスを作成
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // スタイルを調整して画面の一番手前に固定（クリックなどは裏の要素に貫通させる）
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none'; // これで裏のボタンやリンクもちゃんと押せます
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  // 画面サイズに合わせる
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // マウスの軌跡（ドット）を記録する配列
  let points = [];

  // マウスが動いた時の処理
  window.addEventListener('mousemove', (e) => {
    points.push({
      x: e.clientX,
      y: e.clientY,
      time: Date.now() // 生まれた時間を記録
    });
  });

  // 描画をループさせる関数（アニメーション）
  function animate() {
    // 毎フレーム画面をクリアにする
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const now = Date.now();
    // 1秒（1000ミリ秒）以上経った古い点を削除
    points = points.filter(p => now - p.time < 700);

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // 点と点を線でつなぐ
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const age = now - p.time; // 生まれてからの経過時間
        const opacity = Math.max(0, 1 - age / 1000); // 1秒かけて0に近づく

        // 鉛筆っぽい線のスタイル設定
        ctx.strokeStyle = `rgba(100, 100, 100, ${opacity * 0.4})`; // 薄いグレー
        ctx.lineWidth = 1.5; // 鉛筆の芯のような細さ
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 途中で透明度が変わるように、1セグメントずつ描画
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();