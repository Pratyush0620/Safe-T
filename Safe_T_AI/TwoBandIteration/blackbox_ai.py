from menstru import get_period_status


def get_status(temp, humid, hrtbt, spo2, body_temp,
               tempuplim, templowlim, humidup, humidlow,
               heartrateup, heartratedown, spo2up, spo2down,
               body_temp_upper, body_temp_lower, gender):
    status = 0  # normal status

    # Period severity check
    if gender == 1:
        lpd = "2025-01-10"
        print(get_period_status(lpd), end=" ")
        status = max(status, get_period_status(lpd))

    # Define thresholds with appropriate limits
    temp_thresholds = [(tempuplim, tempuplim + 2, 1),
                       (templowlim - 2, templowlim, 1),
                       (tempuplim + 2, float('inf'), 2),
                       (float('-inf'), templowlim - 2, 2)]

    body_temp_thresholds = [(body_temp_upper, body_temp_upper + 2, 1),
                            (body_temp_lower - 2, body_temp_lower, 1),
                            (body_temp_upper + 2, float('inf'), 2),
                            (float('-inf'), body_temp_lower - 2, 2)]

    humid_thresholds = [(humidup, humidup + 8, 1),
                        (humidlow - 8, humidlow, 1),
                        (humidup + 8, float('inf'), 2),
                        (float('-inf'), humidlow - 8, 2)]

    hrtbt_thresholds = [(heartrateup, heartrateup + 10, 1),
                        (heartratedown - 10, heartratedown, 1),
                        (heartrateup + 10, float('inf'), 2),
                        (float('-inf'), heartratedown - 10, 2)]

    spo2_thresholds = [(spo2up, spo2up + 2, 1),
                       (spo2down - 2, spo2down, 1),
                       (spo2up + 2, float('inf'), 2),
                       (float('-inf'), spo2down - 2, 2)]

    for lower, upper, level in temp_thresholds:
        if lower < temp < upper:
            status = max(status, level)

    for lower, upper, level in body_temp_thresholds:
        if lower < body_temp < upper:
            status = max(status, level)

    for lower, upper, level in humid_thresholds:
        if lower < humid < upper:
            status = max(status, level)

    for lower, upper, level in hrtbt_thresholds:
        if lower < hrtbt < upper:
            status = max(status, level)

    for lower, upper, level in spo2_thresholds:
        if lower < spo2 < upper:
            status = max(status, level)

    return status
