const { createApp } = Vue
const { createVuetify } = Vuetify
const vuetify = createVuetify({ theme: { defaultTheme: "light" } })

const sheetDataModel = {
    num: {
        p: null,
        s: null,
    },
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
}
const plotDataModel = {
    layout: { paper_bgcolor: "#eee", font: { family: "BIZ UDPGothic", size: 12, color: "#000" } },
    config: { responsive: true, displayModeBar: false }
}
const App = {
    data() {
        return {
            sheetData: JSON.parse(JSON.stringify(sheetDataModel)),
            sheetDataArr: [],
            plotData: JSON.parse(JSON.stringify(plotDataModel)),
            plotDataArr: [],
            sheetIndex: 0,
            isSavePushed: false,
        }
    },
    mounted() {
        this.sheetDataArr.push(this.sheetData);
        this.plotDataArr.push(this.plotData);
        Plotly.newPlot("graph", this.plotData);
    },
    computed: {
        maxSheetIndex: () => 5,
    },
    methods: {
        textRequired: value => value !== "" || "必須",
        changeNum(value, ps) {
            const [thisNum, otherNum] = (ps === "p") ? ["p", "s"] : ["s", "p"],
                beforeNum = this.sheetData.num[thisNum]
            this.sheetData.num[thisNum] = value
            let jsonData = get(value)
            if (jsonData === undefined) {
                jsonData = this.getPSData(value)
                set(value, jsonData)
            }
            if (this.sheetData.num[otherNum] !== null) {
                if (value !== this.sheetData.num[otherNum]) {
                    this.showPlot(jsonData)
                } else {
                    this.sheetData.num[thisNum] = beforeNum
                    alert("同じ値は選べません")
                }
            }
        },
        getPSData(value) {
            fetch("http://localhost:8080/ps_data", {
                method: "GET",
                headers: { "Content-Type": "text/plain" },
                body: value
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`${response.status}, ${response.statusText}`)
                    return response.json()
                })
                .then((jsonData) => this.showPlot(jsonData))
                .catch((error) => {
                    console.error(error)
                    alert("エラー")
                })
        },
        showPlot(jsonData) {
            const data = [],

                layout = {
                    annotations: [],
                    shapes: [],
                    paper_bgcolor: "#eee",
                    clickmode: "event",
                    hovermode: "x",
                    font: { family: "BIZ UDPGothic", size: 12, color: "#000" },
                    grid: { rows: 2, columns: 2, pattern: "independent" },
                    margin: { "t": 35, "b": 35, "l": 60, "r": 20 },
                    showlegend: false,
                },

                config = {
                    responsive: true,
                    displayModeBar: false,
                }

            let index = 1

            for (const [title, values] of Object.entries(jsonData.columns)) {
                const trace = {
                    hoverinfo: "x",
                    line: { color: "blue" },
                    type: "scatter",
                    mode: "lines",
                    x: jsonData.time,
                    xaxis: "x" + index,
                    y: values,
                    yaxis: "y" + index,
                },

                    anno = {
                        font: { size: 16 },
                        showarrow: false,
                        text: title,
                        x: 0.5,
                        xanchor: "center",
                        xref: "x" + index + " domain",
                        y: 1,
                        yanchor: "bottom",
                        yref: "y" + index + " domain",
                    },

                    shape = {
                        line: { color: "red", width: 2 },
                        type: "line",
                        visible: false,
                        xref: "x" + index,
                        y0: 0,
                        y1: 1,
                        yref: "y" + index + " domain",
                    }

                data.push(trace);
                layout.annotations.push(anno);
                layout.shapes.push(shape);

                layout["xaxis" + index] = {
                    anchor: `y${index}`,
                    domain: (index % 2 == 1) ? [0.0, 0.47] : [0.53, 1.0],
                    spikecolor: "gray",
                    spikemode: "across",
                    spikethickness: 2,
                    zeroline: false,
                    linewidth: 1,
                    linecolor: "black",
                    mirror: "allticks",
                    gridcolor: "#ddd",
                    ticksuffix: "s",
                };

                layout["yaxis" + index] = {
                    anchor: `x${index}`,
                    domain: (index < 3) ? [0.54, 1.0] : [0.0, 0.46],
                    zeroline: false,
                    linewidth: 1,
                    linecolor: "black",
                    mirror: "allticks",
                    gridcolor: "#ddd",
                    ticksuffix: "V",
                    exponentformat: "SI",
                    minexponent: 2,
                };

                index++;
            };

            const plotData = { data, layout, config };
            Object.assign(this.plotData, plotData);
            Plotly.newPlot("graph", plotData);
            const graph = document.getElementById("graph");
            graph.on("plotly_click", this.clickPlot);
        },
        spe_heightInput() {
            this.vCalc()
            this.poiCalc()
        },
        init_tInput(ps) {
            this.deltaCalc(ps)
            this.vCalc(ps)
            this.poiCalc()
        },
        clickPlot(data) {
            const curveNumber = data.points[0].curveNumber,
                inOut = ["in_t", "out_t"][curveNumber % 2],
                ps = (curveNumber < 2) ? "p" : "s"
            this.sheetData.selected[inOut][ps] = data.points[0].x;
            const update = {
                [`shapes[${curveNumber}].x0`]: data.points[0].x,
                [`shapes[${curveNumber}].x1`]: data.points[0].x,
                [`shapes[${curveNumber}].visible`]: true,
            }
            Plotly.relayout("graph", update)
            this.deltaCalc(ps)
            this.vCalc(ps)
            this.poiCalc()
            const layout = document.getElementById("graph").layout
            this.plotData.layout = layout
        },
        makePrefix(num, unit = null) {
            if (num === null) return;
            if (unit === "m/s") return num + "[m/s]";
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
                    }
                }
            }
        },
        deltaCalc(ps) {
            if (Object.keys(this.sheetData.selected)
                .filter(key => ["in_t", "out_t", "init_t"].includes(key))
                .every(key => this.sheetData.selected[key][ps] !== null)) {
                const out_t = this.sheetData.selected.out_t[ps],
                    in_t = this.sheetData.selected.in_t[ps],
                    init_t = this.sheetData.selected.init_t[ps],
                    delta = +BigNumber(out_t).minus(in_t).minus(init_t)
                this.sheetData.selected.delta_t[ps] = delta
            }
        },
        vCalc(p_s = null) {
            for (const ps of (p_s) ? p_s : ["p", "s"]) {
                const speHeight = this.sheetData.selected.spe_height,
                    delta = this.sheetData.selected.delta_t[ps]
                if (speHeight !== null && delta !== null) {
                    const v = +BigNumber(BigNumber(speHeight).div(100)).div(delta)
                    this.sheetData.selected.v[ps] = v
                }
            }
        },
        poiCalc() {
            const vObj = this.sheetData.selected.v;
            if (vObj.p !== null && vObj.s !== null) {
                const pow = Math.pow(vObj.p / vObj.s, 2),
                    calc = +BigNumber(BigNumber(pow).minus(2)).div(BigNumber(pow).minus(1).times(2)),
                    poi = (Math.abs(calc) !== Infinity) ? calc : "#DIV/0!"
                this.sheetData.selected.poi = poi
            }
        },
        sheetUpdate() {
            this.sheetData = this.sheetDataArr[this.sheetIndex]
            this.plotData = this.plotDataArr[this.sheetIndex]
            Plotly.newPlot("graph", this.plotData)
            const graph = document.getElementById("graph")
            graph.on("plotly_click", this.clickPlot)
        },
        deleteSheet() {
            this.sheetDataArr.splice(this.sheetIndex, 1)
            this.plotDataArr.splice(this.sheetIndex, 1)
            if (this.sheetDataArr.length === this.sheetIndex) this.sheetIndex--
            this.sheetUpdate()
        },
        numpush(sheetNum) {
            this.sheetIndex = sheetNum
            this.sheetUpdate()
        },
        addSheet() {
            this.sheetIndex++
            this.sheetData = JSON.parse(JSON.stringify(sheetDataModel))
            this.plotData = JSON.parse(JSON.stringify(plotDataModel))
            this.sheetDataArr.push(this.sheetData)
            this.plotDataArr.push(this.plotData)
            Plotly.newPlot("graph", this.plotData)
        },
        disabledDelete() {
            return (this.sheetDataArr.length === 1) ? true : false
        },
        disabledAdd_sheet() {
            return (this.sheetDataArr.length === this.maxSheetIndex) ? true : false
        },
        saveXlsx() {
            const fileName = document.getElementById("save_file_name").value
            let i = 1
            for (const sheetData of this.sheetDataArr) {
                if (sheetData.selected.poi === null) {
                    alert(`${i}枚目のシートに未入力があります`);
                    return;
                };
                i++;
            };
            this.isSavePushed = true
            fetch("http://localhost:8080/convert_xlsx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.sheetDataArr)
            })
                .then((response) => {
                    if (!response.ok) throw `${response.status}, ${response.statusText}`
                    return response.blob()
                })
                .then((data) => {
                    const anchor = document.createElement("a");
                    anchor.download = fileName
                    anchor.href = URL.createObjectURL(data);
                    anchor.click();
                })
                .catch((error) => {
                    console.error(error)
                    alert("エラー")
                })
                .finally(() => {
                    this.isSavePushed = false
                });
        },
    },
}
const app = createApp(App);
app.use(vuetify).mount("#app");
