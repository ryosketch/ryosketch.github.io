let chart = null;

let courseChart = null;

let showAllRounds = false;

let rounds =
JSON.parse(localStorage.getItem("rounds")) || [];

render();

function addRound(){


const date =
document.getElementById("date").value;

const course =
document.getElementById("course").value;

const score =
Number(document.getElementById("score").value);

const putts =
Number(document.getElementById("putts").value);

const ob =
Number(document.getElementById("ob").value);

const memo =
document.getElementById("memo").value;

if(!date || !course || !score){
    alert("必須項目を入力してください");
    return;
}

rounds.push({
    date,
    course,
    score,
    putts,
    ob,
    memo
});

save();
render();


}

function deleteRound(index){


if(confirm("削除しますか？")){

    rounds.splice(index,1);

    save();
    render();

}


}

function save(){


localStorage.setItem(
    "rounds",
    JSON.stringify(rounds)
);


}

function render(){

 const tbody =
 document.getElementById("roundList");
 tbody.innerHTML = "";

 const sortedRounds =
 [...rounds].sort(
 (a,b)=>new Date(b.date)-new Date(a.date)
 );

 const displayRounds =
 showAllRounds
 ? sortedRounds
 : sortedRounds.slice(0,5);

 const scores =
 rounds.map(r => r.score);

 const bestScore =
 Math.min(...scores);

 const worstScore =
 Math.max(...scores);

 const sortedScores =
 [...rounds]
 .map(r => r.score)
 .sort((a,b)=>a-b);

 displayRounds.forEach((round)=>{

 const index =
 rounds.indexOf(round);

 const medal =
 round.score === sortedScores[0]
 ? "🥇"
 : round.score === sortedScores[1]
 ? "🥈"
 : round.score === sortedScores[2]
 ? "🥉"
 : "";
 
 let scoreClass = "";

 if(round.score <= 89){

    scoreClass = "score-excellent";

 }else if(round.score <= 99){

    scoreClass = "score-good";

 }else if(round.score === worstScore){

    scoreClass = "score-worst";

 }

 const crown =
 round.score === bestScore
 ? '<span class="best-crown">👑</span>'
 : '';

 const warning =
 round.score === worstScore
 ? '⚠'
 : '';


    tbody.innerHTML += `
    <tr onclick="showDetail(${index})">

    <td class="rank-cell">
    ${medal}
</td>

    <td>${round.date}</td>
        <td>${round.course}</td>
       <td class="${scoreClass}">
    ${round.score}${crown}${warning}
</td>

<td>
   <button
    class="delete-btn"
    onclick="event.stopPropagation(); deleteRound(${index})">
        削除
    </button>
</td>
    </tr>
    `;

});

updateStats();


}

function updateStats(){


document.getElementById("roundCount")
.textContent = rounds.length;

if(rounds.length === 0){

    document.getElementById("bestScore")
    .textContent = "-";

    document.getElementById("avgScore")
    .textContent = "-";

    document.getElementById("recent5")
    .textContent = "-";

    return;
}

const scores =
rounds.map(r => r.score);

const best =
Math.min(...scores);

const avg =
scores.reduce((a,b)=>a+b,0)
/ scores.length;

document.getElementById("bestScore")
.textContent = best;

document.getElementById("avgScore")
.textContent = avg.toFixed(1);

// 直近5ラウンド平均

const recentRounds =
[...rounds]
.sort(
(a,b)=>new Date(b.date)-new Date(a.date)
)
.slice(0,5);

const recentAvg =
recentRounds.reduce(
(sum,r)=>sum+r.score,
0
) / recentRounds.length;

const recent5Element =
document.getElementById("recent5");

recent5Element.textContent =
recentAvg.toFixed(1);

recent5Element.classList.remove(
"good-score",
"bad-score"
);

const trendElement =
document.getElementById(
"recentTrend"
);

trendElement.className = "";

if(recentAvg <= avg - 1){

    recent5Element.classList.add(
    "good-score"
    );

    trendElement.textContent =
    "▲";

    trendElement.classList.add(
    "good-score"
    );

}else if(recentAvg >= avg + 1){

    recent5Element.classList.add(
    "bad-score"
    );

    trendElement.textContent =
    "▼";

    trendElement.classList.add(
    "bad-score"
    );

}else{

    trendElement.textContent =
    "→";

    trendElement.classList.add(
    "neutral-score"
    );

}

const btn =
document.getElementById(
    "toggleRoundsBtn"
);

if(rounds.length <= 5){

    btn.style.display = "none";

}else{

    btn.style.display = "inline-block";

    btn.textContent =
    showAllRounds
    ? "折りたたむ"
    : "続きを表示";

}

document.getElementById("roundTotal")
.textContent =
`${rounds.length}件`;


drawChart();

renderCourseStats();

}


function showDetail(index){

   const round = rounds[index];
   
    const scores =
    rounds.map(r => r.score);

    const bestScore =
    Math.min(...scores);

    const worstScore =
    Math.max(...scores);
   
   const rank =
   rounds
   .filter(r => r.score < round.score)
   .length + 1;

   let scoreClass = "";

   if(round.score <= 89){

    scoreClass = "score-excellent";

   }else if(round.score <= 99){

    scoreClass = "score-good";

   }else if(round.score === worstScore){

    scoreClass = "score-worst";

   }

   const crown =
   round.score === bestScore
   ? '<span class="best-crown">👑</span>'
   : '';

   const warning =
   round.score === worstScore
   ? '⚠'
   : '';

   const isBest =
   round.score === bestScore;

    document.getElementById("detailCard").innerHTML = `

        <div class="detail-header">

            <div class="detail-date">
                ${round.date}
            </div>

            <div class="detail-course">
                ${round.course}
            </div>

            <div class="detail-rank">
            ${rank === 1 ? "🏆 ベストラウンド" : `順位：${rank} / ${rounds.length}`}
            </div>

        </div>

        <div class="detail-stats ${isBest ? 'best-round' : ''}">

            <div class="detail-stat">

                <div class="detail-label">
                    SCORE
                </div>

                <div class="detail-value detail-score ${scoreClass}">
                ${round.score}${crown}${warning}
                </div>

            </div>

            <div class="detail-stat">

                <div class="detail-label">
                    PUTTS
                </div>

                <div class="detail-value">
                    ${round.putts}
                </div>

            </div>

            <div class="detail-stat">

                <div class="detail-label">
                    OB
                </div>

                <div class="detail-value">
                    ${round.ob}
                </div>

            </div>

        </div>

        <div class="detail-memo">

            <div class="detail-memo-title">

                メモ

            </div>

            <div>

                ${round.memo || "記録なし"}

            </div>

        </div>

    `;
}


function drawChart(){


    const sortedRounds =
    [...rounds].sort(
    (a,b)=>new Date(a.date)-new Date(b.date)
    );

    const canvas =
    document.getElementById("scoreChart");

    if(!canvas){
        return;
    }

    if(chart){
        chart.destroy();
    }

    chart = new Chart(canvas, {

        type: "line",

        data: {

    labels:
    sortedRounds.map(r => {

        const d = new Date(r.date);

        return `${d.getMonth()+1}/${d.getDate()}`;

    }),

    datasets: [{

        label: "スコア",

        data:
        sortedRounds.map(r => r.score),

        tension: 0

    }]

    },

        options:{

    responsive:true,

    plugins:{

        legend:{
            display:false
        }

    },

    scales:{

        y:{
            reverse:true
        }

    }

    }

    });

}

function toggleRounds(){

    showAllRounds =
    !showAllRounds;

    render();

}

function renderCourseStats(){

    const select =
    document.getElementById(
    "courseSelect"
    );

    const uniqueCourses =
    [...new Set(
    rounds.map(r => r.course)
    )];

   const current = select.value;

   select.innerHTML = uniqueCourses
    .map(course =>
        `<option value="${course}">${course}</option>`
    )
    .join("");

    if (uniqueCourses.includes(current)) {
    select.value = current;
    }

    const selectedCourse =
    select.value;

    const container =
    document.getElementById(
        "courseStats"
    );

    if(!container){
        return;
    }

    const courses = {};

    rounds
    .filter(
    round =>
    round.course === selectedCourse
    )
    .forEach(round=>{

        if(!courses[round.course]){

            courses[round.course] = [];

        }

        courses[round.course].push({
        score: round.score,
        putts: round.putts
        });

    });

    container.innerHTML = "";

    container.className =
    "course-grid";

    Object.entries(courses)
    .forEach(([course,scores])=>{

        const avg =
        scores.reduce(
        (sum,s)=>sum + s.score,
        0
        ) / scores.length;

        const best =
        Math.min(
        ...scores.map(
        s => s.score
        )
        );

        const avgPutts =
        scores.reduce(
       (sum,s)=>sum + s.putts,
       0
       ) / scores.length;

        container.innerHTML += `

        <div class="course-card">

            <div class="course-name">
                ${course}
            </div>

            <div class="course-stat">
                平均：${avg.toFixed(1)}
            </div>

            <div class="course-stat">
                ベスト：${best}
            </div>

            <div class="course-stat">
                ラウンド数：${scores.length}
            </div>

            <div class="course-stat">
            平均パット：${avgPutts.toFixed(1)}
            </div>

        </div>

        `;

    });

    drawCourseChart(selectedCourse);

}

function drawCourseChart(course){

    
    const canvas =
    document.getElementById(
    "courseChart"
    );

    const message =
    document.getElementById(
    "courseChartMessage"
    );

    if(!canvas){
        return;
    }

    const courseRounds =
    rounds
    .filter(
    r => r.course === course
    )
    .sort(
    (a,b)=>
    new Date(a.date)
    -
    new Date(b.date)
    );

    
   if(courseChart){
    courseChart.destroy();
    courseChart = null;
    }

    if(courseRounds.length < 2){

    canvas.style.display = "none";
    message.style.display = "block";

    
    return;
    }

    canvas.style.display = "block";
    message.style.display = "none";

    courseChart =
    new Chart(canvas,{

    type:"line",

    data:{

        labels:
        courseRounds.map(r=>{

            const d = new Date(r.date);

            return `${d.getMonth()+1}/${d.getDate()}`;

        }),

        datasets:[{

            label:`${course} スコア推移`,

            data:
            courseRounds.map(r=>r.score),

            tension:0.3

        }]

    },

    options:{

    responsive:true,

    plugins:{

        legend:{
            display:false
        }

    },

    scales:{

        y:{
            reverse:true
        }

    }

    }

});

    
}


function exportData(){

    const json =
    JSON.stringify(rounds,null,2);

    const blob =
    new Blob(
        [json],
        {type:"application/json"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    const today = new Date();

    const fileName =
    `rounds-${
    today.getFullYear()
    }-${
    String(today.getMonth()+1).padStart(2,"0")
    }-${
    String(today.getDate()).padStart(2,"0")
    }.json`;

    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);

}



function importData(event){

    if(!confirm(
    "現在のデータを上書きしますか？"
    )){

    return;

    }

    const file =
    event.target.files[0];

    if(!file){

        return;

    }

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        try{

             const data =
            JSON.parse(
                e.target.result
            );

            if(!Array.isArray(data)){

                alert(
                "データ形式が正しくありません"
                );

                return;

            }

            rounds = data;

            save();

            render();

            alert("読み込み完了");

        }catch{

            alert(
            "JSONファイルではありません"
            );
        }

    };

    reader.readAsText(file);

}