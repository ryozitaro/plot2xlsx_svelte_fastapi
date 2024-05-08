def delta(out_t, in_t, ini_t) -> str:
    return f"={out_t}-{in_t}-{ini_t}"


def v(spe_height, delta_t) -> str:
    return f"=({spe_height}/100)/{delta_t}"


def poisson(p_v, s_v) -> str:
    return f"=(POWER(({p_v}/{s_v}), 2)-2)/(2*(POWER(({p_v}/{s_v}), 2) - 1))"
