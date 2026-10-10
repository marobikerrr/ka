(function () {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var sig = document.getElementById('sig');
  var TEXT = 'I love you Kaoutar';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SPEED = 0.5; // texts drawn per frame (~30 per second). Lower = slower.
  var W, H, size, raf;

  // Layer colors, from the outer edge (light pink) to the inside (deep rose)
  var COLORS = ['#ffe3ea', '#ffc2d1', '#ff9db6', '#ff7a9c', '#ff5c8a', '#e8366b', '#c2224f'];

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = Math.min(W, H);
  }

  // Heart curve, same formula as the Python turtle code
  function point(i, steps, scale) {
    var a = i * Math.PI * 2 / steps;
    var x = 16 * Math.pow(Math.sin(a), 3) * scale;
    var y = (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * scale;
    return { x: x, y: y };
  }

  function run() {
    cancelAnimationFrame(raf);
    canvas.classList.remove('beat');
    sig.classList.remove('show');
    resize();
    ctx.clearRect(0, 0, W, H);

    var steps = 120, layers = COLORS.length;
    var unit = size / 44;
    var fontPx = Math.max(9, Math.round(size / 38));
    ctx.font = 'italic bold ' + fontPx + 'px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var stamps = [];
    for (var l = 0; l < layers; l++) {
      var k = unit * (1 - l * 0.045);
      for (var i = 0; i < steps; i++) {
        var p = point(i, steps, k);
        stamps.push({ x: W / 2 + p.x, y: H / 2 - p.y - size * 0.03, c: COLORS[l] });
      }
    }

    var drawn = 0, acc = 0;
    var speed = reduce ? stamps.length : SPEED;

    function tick() {
      acc += speed;
      var count = Math.floor(acc);
      acc -= count;
      for (var n = 0; n < count && drawn < stamps.length; n++, drawn++) {
        var s = stamps[drawn];
        ctx.shadowColor = 'rgba(255, 70, 120, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = s.c;
        ctx.fillText(TEXT, s.x, s.y);
      }
      if (drawn < stamps.length) {
        raf = requestAnimationFrame(tick);
      } else {
        sig.classList.add('show');
        if (!reduce) canvas.classList.add('beat');
      }
    }
    tick();
  }

  document.getElementById('replay').addEventListener('click', run);
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(run, 150); });
  run();
})();
