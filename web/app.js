(() => {
const {
  dailySchedule,
  foodTemplates,
  nutritionTargets,
  profile,
  progression,
  resetRoutines,
  videoLibrary,
  weekPlan
} = window.FIT_DATA;

const storageKeys = {
  trainingLogs: "summer-fit.trainingLogs",
  foodLogs: "summer-fit.foodLogs"
};

const state = {
  tab: "today",
  selectedDay: new Date().getDay(),
  timer: {
    running: false,
    remaining: 0,
    total: 0,
    intervalId: null
  },
  follow: {
    activeIndex: 0,
    running: false,
    intervalId: null,
    elapsedByIndex: {}
  },
  trainingLogs: readJson(storageKeys.trainingLogs, []),
  foodLogs: readJson(storageKeys.foodLogs, []),
  pendingFoodItems: []
};

const tabs = [
  ["today", "今日计划"],
  ["sedentary", "久坐提醒"],
  ["logs", "训练记录"],
  ["videos", "视频跟练库"],
  ["food", "饮食拍照识别"],
  ["nutrition", "每日营养建议"]
];

const app = document.querySelector("#app");
render();

function render() {
  const plan = weekPlan[state.selectedDay];
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <h1>暑假体态增肌教练</h1>
        <p>主目标是体态修复 + 增肌重塑，而不是大幅减脂。训练以弹力带、徒手、自重为主，优先处理久坐圆肩、肩胛不稳和肩前侧压力。</p>
        <div class="profile-strip">
          <div class="profile-chip"><span>身高 / 体重</span><strong>${profile.heightCm}cm / ${profile.weightKg}kg</strong></div>
          <div class="profile-chip"><span>实习</span><strong>${profile.internship}</strong></div>
          <div class="profile-chip"><span>通勤</span><strong>单程 ${profile.commuteMinutes} 分钟</strong></div>
          <div class="profile-chip"><span>目标</span><strong>${profile.goal}</strong></div>
        </div>
      </header>
      <nav class="tabs">
        ${tabs.map(([key, label]) => `<button class="tab ${state.tab === key ? "active" : ""}" data-tab="${key}">${label}</button>`).join("")}
      </nav>
      <main class="page">${renderTab(plan)}</main>
    </div>
  `;

  app.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      render();
    });
  });

  bindTabEvents();
}

function renderTab(plan) {
  if (state.tab === "today") return renderToday(plan);
  if (state.tab === "sedentary") return renderSedentary();
  if (state.tab === "logs") return renderLogs();
  if (state.tab === "videos") return renderVideos();
  if (state.tab === "food") return renderFood();
  return renderNutrition();
}

function renderToday(plan) {
  ensureTimer(plan.minutes * 60);
  const current = currentBlock(plan);
  const followItems = getPlanItems(plan);
  const currentFollow = followItems[state.follow.activeIndex] ?? followItems[0];
  return `
    <section class="grid two">
      <div class="card">
        <div class="section-title">
          <h2>${plan.title}</h2>
          <small>${plan.minutes} 分钟</small>
        </div>
        <div class="button-row">
          ${Object.entries(weekPlan).map(([day, item]) => `<button class="btn ${Number(day) === state.selectedDay ? "primary" : ""}" data-day="${day}">${weekdayName(Number(day))}</button>`).join("")}
        </div>
        <p class="muted">周一、周二、周四、周五强度较高；周三恢复；周六稍长；周日主动恢复。肩前侧刺痛、夹痛、麻痛都不是正常训练感。</p>
      </div>
      <div class="card timer-card">
        <div class="timer-phase">当前阶段：${current?.time ?? "完成"} · ${current?.name ?? "训练完成"}</div>
        <div class="timer-time">${formatSeconds(state.timer.remaining)}</div>
        <div class="button-row">
          <button class="btn primary" data-timer="toggle">${state.timer.running ? "暂停" : "开始倒计时"}</button>
          <button class="btn" data-timer="reset">重置</button>
        </div>
      </div>
    </section>

    ${renderFollowMode(plan, currentFollow, followItems)}

    <section class="card warn">
      <strong>前 8 周避免：</strong>双杠臂屈伸、过深俯卧撑、颈后推举、颈后下拉、大重量肩推、耸肩式划船、一次性几百个卷腹。
    </section>

    <section class="exercise-list">
      ${plan.blocks.map(renderExerciseCard).join("")}
    </section>
  `;
}

function renderFollowMode(plan, current, items) {
  if (!current) {
    return "";
  }
  const video = videoLibrary[current.videoKey];
  const elapsed = state.follow.elapsedByIndex[state.follow.activeIndex] ?? 0;
  const plannedSeconds = plannedDurationForIndex(plan, state.follow.activeIndex);
  const totalElapsed = Object.values(state.follow.elapsedByIndex).reduce((sum, value) => sum + value, 0);
  const progressText = `${state.follow.activeIndex + 1} / ${items.length}`;

  return `
    <section class="card exercise-card">
      <div class="exercise-head">
        <div>
          <h2>主跟练模式</h2>
          <p>当前动作：${current.name} · ${current.english}</p>
        </div>
        <span class="source">${progressText}</span>
      </div>
      <div class="grid two">
        <div>
          ${renderVideo(video)}
        </div>
        <div class="timer-card">
          <div class="timer-phase">本动作已跟练</div>
          <div class="timer-time" id="follow-time">${formatSeconds(elapsed)}</div>
          <div class="detail-grid">
            <div class="metric"><span>组数</span><strong>${current.sets}</strong></div>
            <div class="metric"><span>次数 / 时长</span><strong>${current.reps}</strong></div>
            <div class="metric"><span>休息</span><strong>${current.rest}</strong></div>
          </div>
          <div class="progress">
            <div class="progress-head"><strong>计划进度</strong><span id="follow-progress-text">${formatSeconds(elapsed)} / ${formatSeconds(plannedSeconds)}</span></div>
            <div class="bar"><span id="follow-progress-bar" style="width:${Math.min(elapsed / plannedSeconds, 1) * 100}%"></span></div>
          </div>
          <div class="button-row">
            <button class="btn primary" data-follow="toggle">${state.follow.running ? "暂停跟练" : "开始跟练"}</button>
            <button class="btn" data-follow="prev">上一个</button>
            <button class="btn orange" data-follow="next">记录并下一个</button>
            <button class="btn" data-follow="finish">结束训练</button>
          </div>
          <p class="muted">本次累计跟练 <span id="follow-total">${formatSeconds(totalElapsed)}</span>。切换动作或结束训练时会自动写入训练记录。</p>
        </div>
      </div>
      <div class="split">
        <div>
          <strong>动作要点</strong>
          <ul class="bullet-list">${current.cues.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>常见错误</strong>
          <ul class="bullet-list">${current.mistakes.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderExerciseCard(block) {
  const video = videoLibrary[block.videoKey];
  return `
    <article class="card exercise-card">
      <div class="exercise-head">
        <div>
          <h3>${block.time} · ${block.name}</h3>
          <p>${block.english}</p>
        </div>
        <span class="source">${video?.sourceType ?? "视频"}</span>
      </div>
      <div class="detail-grid">
        <div class="metric"><span>组数</span><strong>${block.sets}</strong></div>
        <div class="metric"><span>次数 / 时长</span><strong>${block.reps}</strong></div>
        <div class="metric"><span>休息</span><strong>${block.rest}</strong></div>
      </div>
      ${renderVideo(video)}
      <div class="split">
        <div>
          <strong>动作要点</strong>
          <ul class="bullet-list">${block.cues.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>常见错误</strong>
          <ul class="bullet-list">${block.mistakes.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
    </article>
  `;
}

function renderSedentary() {
  return `
    <section class="grid two">
      <div class="card">
        <div class="section-title">
          <h2>工作日久坐提醒</h2>
          <small>10:20 / 14:20 / 16:20</small>
        </div>
        <p class="muted">浏览器通知需要页面开着才稳定。真正上生产时可以接 PWA Service Worker 或移动端本地通知。</p>
        <div class="button-row">
          <button class="btn primary" data-notify="enable">开启浏览器提醒</button>
          <button class="btn" data-notify="test">测试 5 秒后提醒</button>
        </div>
      </div>
      ${renderRoutineCard(resetRoutines.sedentary)}
    </section>
    <section class="grid three">
      ${renderRoutineCard(resetRoutines.morning)}
      ${renderRoutineCard(resetRoutines.evening)}
      <div class="card">
        <h3>每日作息</h3>
        ${dailySchedule.map(([time, text]) => `<div class="routine-row"><strong>${time}</strong><span>${text}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function renderRoutineCard(routine) {
  return `
    <div class="card">
      <h3>${routine.title}</h3>
      ${routine.blocks.map(([time, text]) => `<div class="routine-row"><strong>${time}</strong><span>${text}</span></div>`).join("")}
    </div>
  `;
}

function renderLogs() {
  const todayExercises = weekPlan[state.selectedDay].blocks;
  return `
    <section class="card">
      <div class="section-title">
        <h2>训练记录</h2>
        <small>动作、弹力带、RPE、肩痛、平板时间</small>
      </div>
      <form class="form-grid" id="log-form">
        <div class="field"><label>动作</label><select name="exercise">${todayExercises.map((item) => `<option>${item.name}</option>`).join("")}</select></div>
        <div class="field"><label>组数</label><input name="sets" type="number" value="3" min="1" /></div>
        <div class="field"><label>次数</label><input name="reps" type="number" value="12" min="0" /></div>
        <div class="field"><label>弹力带</label><select name="band"><option>徒手</option><option>15kg</option><option>30kg</option></select></div>
        <div class="field"><label>RPE</label><input name="rpe" type="number" value="7" min="1" max="10" /></div>
        <div class="field"><label>肩痛 0-10</label><input name="pain" type="number" value="0" min="0" max="10" /></div>
        <div class="field"><label>平板秒数</label><input name="plank" type="number" value="0" min="0" /></div>
        <div class="field"><label>备注</label><input name="note" placeholder="例如肩前侧无刺痛" /></div>
        <button class="btn orange" type="submit">保存记录</button>
      </form>
      <div class="button-row" style="margin-top: 12px;">
        <button class="btn" data-log="clear">清空训练记录</button>
      </div>
    </section>
    <section class="card">
      <h3>历史记录</h3>
      ${state.trainingLogs.length ? renderTrainingTable() : `<p class="empty">还没有训练记录。先保存一组，系统就开始积累你的渐进数据。</p>`}
    </section>
    <section class="card">
      <h3>8 周进阶规则</h3>
      ${progression.map(([week, text]) => `<div class="routine-row"><strong>${week}</strong><span>${text}</span></div>`).join("")}
    </section>
  `;
}

function renderTrainingTable() {
  return `
    <table class="table">
      <thead><tr><th>时间</th><th>动作</th><th>训练量</th><th>跟练时长</th><th>RPE</th><th>肩痛</th><th>平板</th><th>备注</th><th>操作</th></tr></thead>
      <tbody>
        ${state.trainingLogs.map((log) => `
          <tr>
            <td>${new Date(log.createdAt).toLocaleString()}</td>
            <td>${log.exercise}</td>
            <td>${log.sets} · ${log.reps} · ${log.band}</td>
            <td>${log.durationSeconds ? formatSeconds(log.durationSeconds) : "-"}</td>
            <td>${log.rpe ?? "-"}</td>
            <td>${log.pain ?? 0}/10</td>
            <td>${log.plank ?? 0}s</td>
            <td>${log.note || "-"}</td>
            <td><button class="btn" data-log-delete="${indexOfLog(log)}">删除</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderVideos() {
  return `
    <section class="card">
      <div class="section-title">
        <h2>视频跟练库</h2>
        <small>直接内嵌观看</small>
      </div>
      <p class="muted">视频以公开视频嵌入形式播放，不把用户带离页面。康复类动作优先看康复/物理治疗来源，军队标准更适合俯卧撑、深蹲、平板等标准化体能动作。</p>
    </section>
    <section class="video-grid">
      ${Object.values(videoLibrary).map((video) => `
        <article class="card exercise-card">
          <div class="exercise-head">
            <div>
              <h3>${video.nameCn}</h3>
              <p>${video.nameEn}</p>
            </div>
            <span class="source">${video.sourceType}</span>
          </div>
          ${renderVideo(video)}
        </article>
      `).join("")}
    </section>
  `;
}

function renderFood() {
  return `
    <section class="grid two">
      <div class="card">
        <div class="section-title">
          <h2>饮食拍照识别</h2>
          <small>AI 接口占位</small>
        </div>
        <div class="food-preview" id="food-preview">选择食物照片后会在这里预览</div>
        <div class="button-row" style="margin-top: 12px;">
          <label class="btn primary">
            上传食物照片
            <input id="food-file" type="file" accept="image/*" hidden />
          </label>
          <button class="btn blue" data-food="mock">模拟 AI 识别</button>
        </div>
        <p class="muted">后续接多模态 AI 时，把图片传给 API，返回食物名、估算重量和宏量营养，再进入同一个确认表。</p>
      </div>
      <div class="card">
        <h3>识别结果确认</h3>
        <div id="pending-food">${renderPendingFood()}</div>
        <button class="btn orange" data-food="save">写入今日营养记录</button>
      </div>
    </section>
    <section class="card">
      <div class="section-title">
        <h3>手动添加食物</h3>
        <small>识别漏掉时补一条</small>
      </div>
      <form class="form-grid" id="manual-food-form">
        <div class="field"><label>食物名</label><input name="name" placeholder="例如 鸡蛋" required /></div>
        <div class="field"><label>克数</label><input name="grams" type="number" value="100" min="0" required /></div>
        <div class="field"><label>热量 kcal</label><input name="kcal" type="number" value="100" min="0" required /></div>
        <div class="field"><label>蛋白 g</label><input name="protein" type="number" value="0" min="0" step="0.1" required /></div>
        <div class="field"><label>碳水 g</label><input name="carbs" type="number" value="0" min="0" step="0.1" required /></div>
        <div class="field"><label>脂肪 g</label><input name="fat" type="number" value="0" min="0" step="0.1" required /></div>
        <button class="btn blue" type="submit">添加到待确认</button>
      </form>
    </section>
    <section class="card">
      <h3>今日已记录食物</h3>
      <div class="button-row" style="margin: 10px 0;">
        <button class="btn" data-food="clear">清空饮食记录</button>
      </div>
      ${state.foodLogs.length ? renderFoodTable() : `<p class="empty">还没有饮食记录。可以先用模拟识别体验流程。</p>`}
    </section>
  `;
}

function renderPendingFood() {
  if (!state.pendingFoodItems.length) {
    return `<p class="empty">还没有识别结果。</p>`;
  }
  return state.pendingFoodItems.map((item, index) => `
    <div class="routine-row">
      <strong>${item.name}</strong>
      <span>
        <input data-food-grams="${index}" type="number" value="${item.grams}" min="0" style="width: 90px;" /> g
        <span class="muted"> · ${item.kcal} kcal · P ${item.protein}g · C ${item.carbs}g · F ${item.fat}g</span>
        <button class="btn" data-pending-food-delete="${index}" style="margin-left: 8px;">删除</button>
      </span>
    </div>
  `).join("");
}

function renderFoodTable() {
  return `
    <table class="table">
      <thead><tr><th>时间</th><th>食物</th><th>克数</th><th>热量</th><th>蛋白</th><th>碳水</th><th>脂肪</th><th>操作</th></tr></thead>
      <tbody>
        ${state.foodLogs.map((item, index) => `
          <tr>
            <td>${new Date(item.createdAt).toLocaleTimeString()}</td>
            <td>${item.name}</td>
            <td>${item.grams}g</td>
            <td>${item.kcal}</td>
            <td>${item.protein}g</td>
            <td>${item.carbs}g</td>
            <td>${item.fat}g</td>
            <td><button class="btn" data-food-delete="${index}">删除</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderNutrition() {
  const plan = weekPlan[state.selectedDay];
  const target = nutritionTargets[plan.type];
  const totals = state.foodLogs.reduce(
    (sum, item) => ({
      kcal: sum.kcal + item.kcal,
      protein: sum.protein + item.protein,
      carbs: sum.carbs + item.carbs,
      fat: sum.fat + item.fat
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
  const advice = buildAdvice(totals, target);

  return `
    <section class="grid two">
      <div class="card">
        <div class="section-title">
          <h2>今日营养目标</h2>
          <small>${target.label}</small>
        </div>
        ${progressBar("热量", totals.kcal, target.kcal, "kcal")}
        ${progressBar("蛋白质", totals.protein, target.protein, "g")}
        ${progressBar("碳水", totals.carbs, target.carbs, "g")}
        ${progressBar("脂肪", totals.fat, target.fat, "g")}
      </div>
      <div class="card">
        <h3>还需要补什么</h3>
        <ul class="bullet-list">${advice.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </section>
    <section class="grid three">
      ${mealCard("早餐 06:59-07:20", "燕麦 50-60g + 牛奶 250ml + 鸡蛋 2 个 + 香蕉 1 根。")}
      ${mealCard("午餐 12:00-12:25", "熟米饭 200-250g + 肉蛋奶豆 150-200g + 蔬菜 300g 以上。")}
      ${mealCard("加餐 15:40-15:50", "香蕉 + 无糖酸奶，或牛奶 + 全麦面包，训练日建议吃。")}
      ${mealCard("晚餐 19:35-20:00", "训练后要有碳水和蛋白质，不要只吃沙拉。")}
      ${mealCard("睡前饿了", "牛奶 250ml、无糖酸奶、鸡蛋 1 个或坚果 10-15g。")}
      ${mealCard("调整规则", "体重连续 2 周下降则每日加 150 kcal；腰围明显增加则每日减 100-150 kcal。")}
    </section>
  `;
}

function mealCard(title, text) {
  return `<div class="card"><h3>${title}</h3><p class="muted">${text}</p></div>`;
}

function progressBar(label, current, target, unit) {
  const pct = Math.min(current / target, 1) * 100;
  return `
    <div class="progress" style="margin: 14px 0;">
      <div class="progress-head"><strong>${label}</strong><span>${Math.round(current)} / ${target} ${unit}</span></div>
      <div class="bar"><span style="width:${pct}%"></span></div>
    </div>
  `;
}

function renderVideo(video) {
  if (!video) return "";
  const watchUrl = youtubeWatchUrl(video.embedUrl);
  return `
    <div class="video-box">
      <iframe
        class="video-frame ${video.isShorts ? "shorts-frame" : ""}"
        src="${video.embedUrl}"
        title="${video.nameCn} ${video.nameEn}"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
      <a class="btn video-open" href="${watchUrl}" target="_blank" rel="noreferrer">在 YouTube 打开</a>
    </div>
  `;
}

function youtubeWatchUrl(embedUrl) {
  const match = embedUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (!match) return embedUrl;
  return `https://www.youtube.com/watch?v=${match[1]}`;
}

function bindTabEvents() {
  app.querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      finishFollowSession(weekPlan[state.selectedDay]);
      state.selectedDay = Number(button.dataset.day);
      resetFollowState();
      resetTimer(weekPlan[state.selectedDay].minutes * 60);
      render();
    });
  });

  app.querySelectorAll("[data-timer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.timer === "toggle") toggleTimer();
      if (button.dataset.timer === "reset") resetTimer(weekPlan[state.selectedDay].minutes * 60);
      render();
    });
  });

  app.querySelectorAll("[data-follow]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.follow;
      const plan = weekPlan[state.selectedDay];
      if (action === "toggle") toggleFollowTimer(plan);
      if (action === "next") moveFollow(plan, 1, true);
      if (action === "prev") moveFollow(plan, -1, true);
      if (action === "finish") finishFollowSession(plan);
      render();
    });
  });

  app.querySelector("#log-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.trainingLogs = [
      {
        createdAt: new Date().toISOString(),
        exercise: form.get("exercise"),
        sets: Number(form.get("sets")),
        reps: Number(form.get("reps")),
        band: form.get("band"),
        rpe: Number(form.get("rpe")),
        pain: Number(form.get("pain")),
        plank: Number(form.get("plank")),
        note: form.get("note")
      },
      ...state.trainingLogs
    ];
    writeJson(storageKeys.trainingLogs, state.trainingLogs);
    render();
  });

  app.querySelector("[data-log='clear']")?.addEventListener("click", () => {
    if (!confirm("确定要清空所有训练记录吗？")) return;
    state.trainingLogs = [];
    writeJson(storageKeys.trainingLogs, state.trainingLogs);
    render();
  });

  app.querySelectorAll("[data-log-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.logDelete);
      state.trainingLogs = state.trainingLogs.filter((_, currentIndex) => currentIndex !== index);
      writeJson(storageKeys.trainingLogs, state.trainingLogs);
      render();
    });
  });

  app.querySelector("[data-notify='enable']")?.addEventListener("click", enableNotifications);
  app.querySelector("[data-notify='test']")?.addEventListener("click", () => {
    setTimeout(() => showNotification("3 分钟久坐修复", "下巴回收、肩胛后缩、胸肌拉伸、深蹲。"), 5000);
  });

  app.querySelector("#food-file")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = app.querySelector("#food-preview");
    preview.innerHTML = `<img alt="食物照片预览" src="${URL.createObjectURL(file)}" />`;
  });

  app.querySelector("[data-food='mock']")?.addEventListener("click", () => {
    state.pendingFoodItems = foodTemplates.lunch.map(templateToFoodItem);
    render();
  });

  app.querySelector("#manual-food-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item = makeFoodItem({
      name: String(form.get("name") || "").trim(),
      grams: Number(form.get("grams")) || 0,
      kcal: Number(form.get("kcal")) || 0,
      protein: Number(form.get("protein")) || 0,
      carbs: Number(form.get("carbs")) || 0,
      fat: Number(form.get("fat")) || 0
    });
    if (!item.name) return;
    state.pendingFoodItems = [...state.pendingFoodItems, item];
    render();
  });

  app.querySelectorAll("[data-food-grams]").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.foodGrams);
      const item = state.pendingFoodItems[index];
      const grams = Number(input.value) || 0;
      const ratio = item.baseGrams > 0 ? grams / item.baseGrams : 0;
      state.pendingFoodItems[index] = {
        ...item,
        grams,
        kcal: Math.round(item.baseKcal * ratio),
        protein: round(item.baseProtein * ratio),
        carbs: round(item.baseCarbs * ratio),
        fat: round(item.baseFat * ratio)
      };
      app.querySelector("#pending-food").innerHTML = renderPendingFood();
      bindTabEvents();
    });
  });

  app.querySelectorAll("[data-pending-food-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.pendingFoodDelete);
      state.pendingFoodItems = state.pendingFoodItems.filter((_, currentIndex) => currentIndex !== index);
      render();
    });
  });

  app.querySelector("[data-food='save']")?.addEventListener("click", () => {
    if (!state.pendingFoodItems.length) return;
    state.foodLogs = [
      ...state.pendingFoodItems.map((item) => ({ ...item, createdAt: new Date().toISOString() })),
      ...state.foodLogs
    ];
    state.pendingFoodItems = [];
    writeJson(storageKeys.foodLogs, state.foodLogs);
    render();
  });

  app.querySelectorAll("[data-food-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.foodDelete);
      state.foodLogs = state.foodLogs.filter((_, currentIndex) => currentIndex !== index);
      writeJson(storageKeys.foodLogs, state.foodLogs);
      render();
    });
  });

  app.querySelector("[data-food='clear']")?.addEventListener("click", () => {
    if (!confirm("确定要清空所有饮食记录吗？")) return;
    state.foodLogs = [];
    state.pendingFoodItems = [];
    writeJson(storageKeys.foodLogs, state.foodLogs);
    render();
  });
}

function ensureTimer(totalSeconds) {
  if (state.timer.total !== totalSeconds) {
    resetTimer(totalSeconds, false);
  }
}

function getPlanItems(plan) {
  return plan.blocks;
}

function toggleFollowTimer(plan) {
  state.follow.running = !state.follow.running;
  if (state.follow.running) {
    state.follow.intervalId = setInterval(() => {
      state.follow.elapsedByIndex[state.follow.activeIndex] =
        (state.follow.elapsedByIndex[state.follow.activeIndex] ?? 0) + 1;
      state.timer.remaining = Math.max(state.timer.remaining - 1, 0);
      if ((state.follow.elapsedByIndex[state.follow.activeIndex] ?? 0) >= plannedDurationForIndex(plan, state.follow.activeIndex)) {
        autoAdvanceFollow(plan);
        return;
      }
      updateFollowTimerDom();
    }, 1000);
    return;
  }
  clearInterval(state.follow.intervalId);
}

function moveFollow(plan, direction, shouldLog) {
  const items = getPlanItems(plan);
  if (shouldLog) {
    finalizeFollowLog(plan, state.follow.activeIndex);
  }
  state.follow.activeIndex = clamp(state.follow.activeIndex + direction, 0, items.length - 1);
}

function autoAdvanceFollow(plan) {
  const items = getPlanItems(plan);
  finalizeFollowLog(plan, state.follow.activeIndex);
  if (state.follow.activeIndex >= items.length - 1) {
    clearInterval(state.follow.intervalId);
    state.follow.running = false;
    render();
    return;
  }
  state.follow.activeIndex += 1;
  render();
}

function finishFollowSession(plan) {
  clearInterval(state.follow.intervalId);
  state.follow.running = false;
  finalizeFollowLog(plan, state.follow.activeIndex);
  writeJson(storageKeys.trainingLogs, state.trainingLogs);
}

function resetFollowState() {
  clearInterval(state.follow.intervalId);
  state.follow = {
    activeIndex: 0,
    running: false,
    intervalId: null,
    elapsedByIndex: {}
  };
}

function finalizeFollowLog(plan, index) {
  const elapsed = state.follow.elapsedByIndex[index] ?? 0;
  if (elapsed < 5) {
    return;
  }

  const item = getPlanItems(plan)[index];
  state.trainingLogs = [
    {
      createdAt: new Date().toISOString(),
      exercise: item.name,
      sets: item.sets,
      reps: item.reps,
      band: inferBand(item),
      rpe: null,
      pain: 0,
      plank: item.videoKey === "plank" ? elapsed : 0,
      durationSeconds: elapsed,
      note: "跟练自动记录"
    },
    ...state.trainingLogs
  ];
  state.follow.elapsedByIndex[index] = 0;
  writeJson(storageKeys.trainingLogs, state.trainingLogs);
}

function updateFollowTimerDom() {
  const activeElapsed = state.follow.elapsedByIndex[state.follow.activeIndex] ?? 0;
  const totalElapsed = Object.values(state.follow.elapsedByIndex).reduce((sum, value) => sum + value, 0);
  const plan = weekPlan[state.selectedDay];
  const plannedSeconds = plannedDurationForIndex(plan, state.follow.activeIndex);
  const followTime = document.querySelector("#follow-time");
  const followTotal = document.querySelector("#follow-total");
  const followProgressText = document.querySelector("#follow-progress-text");
  const followProgressBar = document.querySelector("#follow-progress-bar");
  if (followTime) followTime.textContent = formatSeconds(activeElapsed);
  if (followTotal) followTotal.textContent = formatSeconds(totalElapsed);
  if (followProgressText) followProgressText.textContent = `${formatSeconds(activeElapsed)} / ${formatSeconds(plannedSeconds)}`;
  if (followProgressBar) followProgressBar.style.width = `${Math.min(activeElapsed / plannedSeconds, 1) * 100}%`;
}

function plannedDurationForIndex(plan, index) {
  const items = getPlanItems(plan);
  return parseTimeDuration(items[index]?.time ?? "", plan.minutes, items.length);
}

function inferBand(item) {
  const text = `${item.name} ${item.english} ${item.cues.join(" ")}`;
  if (text.includes("30kg")) return "30kg";
  if (text.includes("15kg")) return "15kg";
  if (item.name.includes("弹力带") || item.english.toLowerCase().includes("band")) return "弹力带";
  return "徒手";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function toggleTimer() {
  state.timer.running = !state.timer.running;
  if (state.timer.running) {
    state.timer.intervalId = setInterval(() => {
      state.timer.remaining = Math.max(state.timer.remaining - 1, 0);
      if (state.timer.remaining === 0) {
        clearInterval(state.timer.intervalId);
        state.timer.running = false;
      }
      render();
    }, 1000);
  } else {
    clearInterval(state.timer.intervalId);
  }
}

function resetTimer(totalSeconds, shouldRender = true) {
  clearInterval(state.timer.intervalId);
  state.timer = { running: false, remaining: totalSeconds, total: totalSeconds, intervalId: null };
  if (shouldRender) render();
}

function currentBlock(plan) {
  const elapsed = plan.minutes * 60 - state.timer.remaining;
  let cursor = 0;
  return plan.blocks.find((item) => {
    const duration = parseTimeDuration(item.time, plan.minutes, plan.blocks.length);
    const starts = cursor;
    cursor += duration;
    return elapsed >= starts && elapsed < cursor;
  }) ?? plan.blocks.at(-1);
}

function parseTimeDuration(time, totalMinutes, count) {
  const match = time.match(/(\d+):(\d+)-(\d+):(\d+)/);
  if (!match) return (totalMinutes * 60) / count;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  return Math.max(end - start, 1);
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("当前浏览器不支持通知。");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("通知权限未开启。");
    return;
  }
  scheduleReminderLoops();
  showNotification("久坐提醒已开启", "工作日 10:20、14:20、16:20 会提醒你做 3 分钟修复。");
}

function scheduleReminderLoops() {
  const times = [
    [10, 20],
    [14, 20],
    [16, 20]
  ];
  times.forEach(([hour, minute]) => {
    const timeout = nextWeekdayTimeout(hour, minute);
    setTimeout(() => {
      showNotification("3 分钟久坐修复", "下巴回收、肩胛后缩、胸肌拉伸、深蹲。");
      setInterval(() => showNotification("3 分钟久坐修复", "下巴回收、肩胛后缩、胸肌拉伸、深蹲。"), 7 * 24 * 60 * 60 * 1000);
    }, timeout);
  });
}

function nextWeekdayTimeout(hour, minute) {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  while (next <= now || next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function buildAdvice(totals, target) {
  const proteinGap = Math.max(target.protein - totals.protein, 0);
  const carbsGap = Math.max(target.carbs - totals.carbs, 0);
  const fatGap = Math.max(target.fat - totals.fat, 0);
  const advice = [];
  if (proteinGap > 15) advice.push(`蛋白质还差约 ${Math.round(proteinGap)}g，建议加鸡胸肉 ${Math.round(proteinGap / 0.31)}g，或 250ml 牛奶 + 2 个鸡蛋。`);
  if (carbsGap > 40) advice.push(`碳水还差约 ${Math.round(carbsGap)}g，建议加熟米饭 ${Math.round(carbsGap / 0.26)}g，或香蕉 + 燕麦。`);
  if (fatGap > 12) advice.push(`脂肪还差约 ${Math.round(fatGap)}g，可加坚果 ${Math.round(fatGap / 0.5)}g 或正常炒菜油脂。`);
  if (!advice.length) advice.push("今天已经接近目标，晚餐保持足量蛋白、蔬菜和适量主食即可。");
  return advice;
}

function templateToFoodItem([name, grams, kcal, protein, carbs, fat]) {
  return makeFoodItem({
    name,
    grams,
    kcal,
    protein,
    carbs,
    fat
  });
}

function makeFoodItem({ name, grams, kcal, protein, carbs, fat }) {
  return {
    name,
    grams,
    kcal,
    protein,
    carbs,
    fat,
    baseGrams: grams,
    baseKcal: kcal,
    baseProtein: protein,
    baseCarbs: carbs,
    baseFat: fat
  };
}

function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function weekdayName(day) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day];
}

function indexOfLog(log) {
  return state.trainingLogs.indexOf(log);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}
})();
