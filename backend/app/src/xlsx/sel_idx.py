import pandas as pd

SPE_HEIGHT = ("供試体高さ", "[cm]")
IN_T = ("in", "[s]")
OUT_T = ("out", "[s]")
INI_T = ("初期補正", "[s]")
DELTA_T = ("Δt", "[s]")
V = ("V", "[m/s]")
POISSON = ("ポアソン比", "")


def temp_sel_df(init: float | str):
    return pd.DataFrame(
        data={
            SPE_HEIGHT: init,
            IN_T: init,
            OUT_T: init,
            INI_T: init,
            DELTA_T: init,
            V: init,
            POISSON: init,
        },
        index=("P", "S"),
    )


def change_name(name):
    match name:
        case "spe_height":
            return SPE_HEIGHT

        case "in_t":
            return IN_T

        case "out_t":
            return OUT_T

        case "init_t":
            return INI_T

        case "delta_t":
            return DELTA_T

        case "v":
            return V

        case "poi":
            return POISSON
