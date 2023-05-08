window.addEventListener('DOMContentLoaded', function () {
    const pageDataArr = [newPageData()];
    sessionStorage.setItem("pageDataArr", JSON.stringify(pageDataArr));
    const plotDataArr = [{ layout: { paper_bgcolor: "#eee" }, config: { responsive: true, displayModeBar: false } }];
    sessionStorage.setItem("plotDataArr", JSON.stringify(plotDataArr));
    const pageData = pageDataArr[0];
    const speHeight = this.document.getElementById("spe_height");
    speHeight.value = pageData.selected.spe_height;
    const pInit = document.getElementById("p_init_t");
    pInit.value = pageData.selected.init_t.p;
    const sInit = document.getElementById("s_init_t");
    sInit.value = pageData.selected.init_t.s;
});
function newPageData() {
    let pageData = {
        p_num: null,
        s_num: null,
        selected: {
            spe_height: 10,
            init_t: {
                p: 0,
                s: 0,
            },
            in_t: {
                p: null,
                s: null,
            },
            out_t: {
                p: null,
                s: null,
            },
            delta_t: {
                p: null,
                s: null,
            },
            v: {
                p: null,
                s: null,
            },
            poi: null,
        },
        a1: "",
    };
    return pageData;
};
function pageApplyData() {
    const pageData = readPageData();
    const speHeight = document.getElementById("spe_height");
    speHeight.value = pageData.selected.spe_height;
    for (const ps of ["p", "s"]) {
        const numElement = document.getElementById(`${ps}_num`);
        if (pageData[`${ps}_num`]) {
            numElement.value = pageData[`${ps}_num`];
        } else {
            document.wave_select[`${ps}_wave_select`].selectedIndex = 0;
        };
        const initElement = document.getElementById(`${ps}_init_t`);
        initElement.value = pageData.selected.init_t[ps];
        for (const elementName of [`${ps}_in_t`, `${ps}_out_t`, `${ps}_delta_t`, `${ps}_v`]) {
            const element = document.getElementById(elementName);
            const propName = elementName.slice(2);
            const prop = pageData.selected[propName][ps];
            element.innerText = (typeof prop === "number") ? makePrefix(prop) : null;
        };
    };
    const poiElement = document.getElementById("poi");
    poiElement.innerText = pageData.selected.poi;
    const a1Element = document.getElementById("a1");
    a1Element.value = pageData.a1;
}
function pageReset() {
    document.wave_select.reset();
    const pageData = newPageData();
    const plotData = { layout: { paper_bgcolor: "#eee" }, config: { responsive: true, displayModeBar: false } };
    savePageData(pageData);
    savePlotData(plotData);
    Plotly.newPlot("graph", plotData);
    pageApplyData();
}
function getData() {
    const pNum = document.getElementById("p_num").value;
    const sNum = document.getElementById("s_num").value;
    let pageData = readPageData();
    if (pNum && sNum) {
        if (pNum === sNum) {
            alert("同じ番号は選べません。");
            pageReset();
            return;
        };
        const frm = document.getElementById("wave_form");
        const formData = new FormData(frm);
        const urldata = new URLSearchParams(formData).toString();
        fetch("http://localhost:8080/ps_data", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urldata
        })
            .then((response) => response.json())
            .then((jsonData) => showPlot(jsonData))
            .catch((error) => console.error(error));
        pageData = newPageData();
    };
    pageData.p_num = pNum;
    pageData.s_num = sNum;
    savePageData(pageData);
    if (pNum && sNum) pageApplyData();
};
function showPlot(jsonData) {
    let graph = document.getElementById("graph");

    let data = [];
    let layout = {
        annotations: [],
        shapes: [],
        paper_bgcolor: "#eee",
        clickmode: "event",
        hovermode: "x",
        font: { family: "BIZ UDPGothic", size: 12, color: "#000" },
        grid: { rows: 2, columns: 2, pattern: "independent" },
        margin: { "t": 35, "b": 35, "l": 60, "r": 20 },
        showlegend: false,
    };
    let config = {
        responsive: true,
        displayModeBar: false,
    };

    let index = 1;

    for (const [key, value] of Object.entries(jsonData.columns)) {
        let trace = {
            hoverinfo: "x",
            line: { color: "blue" },
            type: "scatter",
            x: jsonData.time,
            xaxis: "x" + index,
            y: value,
            yaxis: "y" + index,
        };
        data.push(trace);

        let anno = {
            font: { size: 16 },
            showarrow: false,
            text: key,
            x: 0.5,
            xanchor: "center",
            xref: "x" + index + " domain",
            y: 1,
            yanchor: "bottom",
            yref: "y" + index + " domain",
        };
        layout.annotations.push(anno);

        let shape = {
            line: { color: "red", width: 2 },
            type: "line",
            visible: false,
            x0: jsonData.time[0],
            x1: jsonData.time[0],
            xref: "x" + index,
            y0: 0,
            y1: 1,
            yref: "y" + index + " domain",
        };
        layout.shapes.push(shape);

        layout["xaxis" + index] = {
            anchor: `y${index}`,
            domain: (index % 2 == 1) ? [0.0, 0.46] : [0.54, 1.0],
            spikecolor: "gray",
            spikemode: "across",
            spikethickness: 2,
            zeroline: false,
            linewidth: 1,
            mirror: "allticks",
            gridcolor: "#ddd"
        };

        layout["yaxis" + index] = {
            anchor: `x${index}`,
            domain: (index < 3) ? [0.54, 1.0] : [0.0, 0.46],
            zeroline: false,
            linewidth: 1,
            mirror: "allticks",
            gridcolor: "#ddd"
        };

        index++;
    };

    Plotly.newPlot("graph", data, layout, config);
    graph.on("plotly_click", clickPlot);
    let plotData = readPlotData();
    plotData = { data: data, layout: layout, config: config };
    savePlotData(plotData);
};
function readPageData() {
    const pageNum = +(document.getElementById("sheet_ctrl").dataset.page_num);
    const pageDataArr = JSON.parse(sessionStorage.getItem("pageDataArr"));
    const pageData = pageDataArr[pageNum];
    return pageData
};
function savePageData(pageData) {
    const pageNum = +(document.getElementById("sheet_ctrl").dataset.page_num);
    const pageDataArr = JSON.parse(sessionStorage.getItem("pageDataArr"));
    pageDataArr[pageNum] = pageData;
    sessionStorage.setItem("pageDataArr", JSON.stringify(pageDataArr));
};
function readPlotData() {
    const pageNum = +(document.getElementById("sheet_ctrl").dataset.page_num);
    const plotDataArr = JSON.parse(sessionStorage.getItem("plotDataArr"));
    const plotData = plotDataArr[pageNum];
    return plotData
}
function savePlotData(plotData) {
    const pageNum = +(document.getElementById("sheet_ctrl").dataset.page_num);
    const plotDataArr = JSON.parse(sessionStorage.getItem("plotDataArr"));
    plotDataArr[pageNum] = plotData;
    sessionStorage.setItem("plotDataArr", JSON.stringify(plotDataArr));
}
function clickPlot(data) {
    let pageData = readPageData();
    const curveNumber = data.points[0].curveNumber;
    const inOut = ["in_t", "out_t"][curveNumber % 2];
    const ps = (curveNumber < 2) ? "p" : "s";
    pageData.selected[inOut][ps] = data.points[0].x;
    const psInoutId = ["p_in_t", "p_out_t", "s_in_t", "s_out_t"][curveNumber];
    const psInoutElement = document.getElementById(psInoutId);
    psInoutElement.innerText = makePrefix(data.points[0].x);
    let update = {
        [`shapes[${curveNumber}].x0`]: data.points[0].x,
        [`shapes[${curveNumber}].x1`]: data.points[0].x,
        [`shapes[${curveNumber}].visible`]: true,
    };
    Plotly.relayout("graph", update);
    pageData = deltaCalc(pageData, ps);
    const layout = document.getElementById("graph").layout;
    const plotData = readPlotData();
    plotData.layout = layout;
    savePageData(pageData);
    savePlotData(plotData);
};
function initOninput(element) {
    const initId = element.id[0];
    let pageData = readPageData();
    pageData.selected.init_t[initId] = +element.value;
    pageData = deltaCalc(pageData, initId);
    savePageData(pageData);
};
function deltaCalc(pageData, ps) {
    if (Object.keys(pageData.selected)
        .filter(key => ["in_t", "out_t", "init_t"].includes(key))
        .every(key => pageData.selected[key][ps] !== null)) {
        const delta = +BigNumber(pageData.selected.out_t[ps]).minus(pageData.selected.in_t[ps]).minus(pageData.selected.init_t[ps]);
        pageData.selected.delta_t[ps] = +delta;
        const deltaElement = document.getElementById(ps + "_delta_t");
        deltaElement.innerText = makePrefix(delta);

        pageData = vCalc(pageData, ps);
    };
    return pageData;
};
function spe_heightOninput(value) {
    let pageData = readPageData();
    pageData.selected.spe_height = +value;
    pageData = vCalc(pageData);
    savePageData(pageData);
};
function vCalc(pageData, p_s = null) {
    for (const ps of (p_s) ? p_s : ["p", "s"]) {
        const speHeight = pageData.selected.spe_height;
        const delta = pageData.selected.delta_t[ps];
        if (speHeight !== null && delta !== null) {
            const v = +BigNumber(BigNumber(speHeight).div(100)).div(delta);
            pageData.selected.v[ps] = v;
            const vElement = document.getElementById(ps + "_v");
            vElement.innerText = v.toString() + " [m/s]";
        };
    };
    pageData = poiCalc(pageData);
    return pageData;
};
function poiCalc(pageData) {
    const vObj = pageData.selected.v;
    if (vObj.p !== null && vObj.s !== null) {
        const pow = Math.pow(vObj.p / vObj.s, 2);
        //const calc = (pow - 2) / (2 * (pow - 1));
        const calc = +BigNumber(BigNumber(pow).minus(2)).div(BigNumber(pow).minus(1).times(2))
        const poi = (Math.abs(calc) !== Infinity) ? calc : "#DIV/0!";
        pageData.selected.poi = poi;
        const poiElement = document.getElementById("poi");
        poiElement.innerText = poi.toString();
    };
    return pageData;
};
function a1Oninput(value) {
    const pageData = readPageData();
    pageData.a1 = value;
    savePageData(pageData);
}
function makePrefix(num) {
    const absNum = Math.abs(num);
    if (absNum >= 1 || absNum === 0) {
        return `${num} [sec]`;
    } else {
        const sign = (num >= 0) ? "" : "-"
        let strNum = absNum.toExponential().replace(".", "");
        strNum = strNum.slice(0, strNum.indexOf("e"));
        const countZero = +(absNum.toExponential().slice(-1)) - 1;
        for (const pair of [[3, "m"], [6, "μ"], [9, "n"]]) {
            if (countZero < pair[0]) {
                const decimalPointLocation = pair[0] - countZero;
                strNum = strNum.padEnd(decimalPointLocation, 0);
                let newStrNum;
                if (decimalPointLocation === strNum.length) {
                    newStrNum = strNum;
                } else {
                    newStrNum = strNum.slice(0, decimalPointLocation) + "." + strNum.slice(decimalPointLocation)
                };
                return `${sign}${newStrNum} [${pair[1]}sec]`;
            };
        };
    };
};
function addSheet() {
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    let pageNum = +sheetCtrlElement.dataset.page_num;
    const pageDataArr = JSON.parse(sessionStorage.getItem("pageDataArr"));
    const plotDataArr = JSON.parse(sessionStorage.getItem("plotDataArr"));
    sheetCtrlElement.dataset.page_num = ++pageNum;
    pageDataArr.splice(pageNum, 0, newPageData());
    plotDataArr.splice(pageNum, 0, { layout: { paper_bgcolor: "#eee" }, config: { responsive: true, displayModeBar: false } });
    sessionStorage.setItem("pageDataArr", JSON.stringify(pageDataArr));
    sessionStorage.setItem("plotDataArr", JSON.stringify(plotDataArr));
    pageChange();
    buttonDisabled();
    indicatorUpdate();
};
function backSheet() {
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    let pageNum = +sheetCtrlElement.dataset.page_num;
    sheetCtrlElement.dataset.page_num = --pageNum;
    pageChange();
    buttonDisabled();
    indicatorUpdate();
};
function forwardSheet() {
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    let pageNum = +sheetCtrlElement.dataset.page_num;
    sheetCtrlElement.dataset.page_num = ++pageNum;
    pageChange();
    buttonDisabled();
    indicatorUpdate();
};
function deleteSheet() {
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    let pageNum = +sheetCtrlElement.dataset.page_num;
    const pageDataArr = JSON.parse(sessionStorage.getItem("pageDataArr"));
    pageDataArr.splice(pageNum, 1);
    sessionStorage.setItem("pageDataArr", JSON.stringify(pageDataArr));
    const plotDataArr = JSON.parse(sessionStorage.getItem("plotDataArr"));
    plotDataArr.splice(pageNum, 1);
    sessionStorage.setItem("plotDataArr", JSON.stringify(plotDataArr));
    if (pageDataArr.length === pageNum) {
        sheetCtrlElement.dataset.page_num = --pageNum;
    };
    pageChange();
    buttonDisabled();
    indicatorUpdate();
};
function pageChange() {
    const plotData = readPlotData();
    Plotly.newPlot("graph", plotData);
    const graph = document.getElementById("graph");
    graph.on("plotly_click", clickPlot);
    pageApplyData();
};
function buttonDisabled() {
    const pageDataArrLength = JSON.parse(sessionStorage.getItem("pageDataArr")).length;
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    const pageNum = +sheetCtrlElement.dataset.page_num;
    const backButtonElement = document.getElementById("back");
    backButtonElement.disabled = (pageNum === 0) ? true : false;
    const forwardButtonElement = document.getElementById("forward");
    forwardButtonElement.disabled = (pageDataArrLength === pageNum + 1) ? true : false;
    const addSheetButton = document.getElementById("add_sheet");
    addSheetButton.disabled = (pageDataArrLength === 5) ? true : false;
    const deleteButtonElement = document.getElementById("delete");
    deleteButtonElement.disabled = (pageDataArrLength === 1) ? true : false;
};
function indicatorUpdate() {
    const pageDataArrLength = JSON.parse(sessionStorage.getItem("pageDataArr")).length;
    const sheetCtrlElement = document.getElementById("sheet_ctrl");
    const pageNum = +sheetCtrlElement.dataset.page_num;
    const indicatorBlock = document.getElementById("indicator_block");
    while (indicatorBlock.firstChild) {
        indicatorBlock.removeChild(indicatorBlock.firstChild);
    };
    let i = 0;
    do {
        const indicator = document.createElement("span");
        indicator.className = "indicator";
        if (i === pageNum) {
            indicator.id = "selected_indicator";
        };
        indicatorBlock.appendChild(indicator);
        i++;
    } while (i < pageDataArrLength);
};
function saveButton() {
    const fileName = document.getElementById("save_file_name").value;
    const pageDataArrStr = sessionStorage.getItem("pageDataArr");
    const pageDataArr = JSON.parse(pageDataArrStr);
    let i = 1;
    for (const pageData of pageDataArr) {
        if (pageData.selected.poi === null) {
            alert(`${i}枚目のシートに未入力があります`);
            return;
        };
        i++;
    };
    const saveDivElement = document.getElementById("save");
    saveDivElement.style.visibility = "hidden";
    const waitingAnim = document.getElementById("waiting_anim");
    waitingAnim.style.visibility = "visible";
    fetch("http://localhost:8080/convert_xlsx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: pageDataArrStr
    })
        .then((response) => response.blob())
        .then((data) => {
            const anchor = document.createElement("a");
            anchor.download = fileName
            anchor.href = URL.createObjectURL(data);
            anchor.click();
        })
        .catch((error) => console.error(error))
        .finally(() => {
            saveDivElement.style.visibility = "visible";
            waitingAnim.style.visibility = "hidden";
        });
};
