def air_status(res):
    # Define thresholds for each sensor reading
    # thresholds = {
    #     "aqiscore": (50, 100),  # Safe ≤ 50, Warning 51-100, Critical > 100
    #     "CO2": (400, 1000),  # Safe ≤ 400, Warning 401-1000, Critical > 1000
    #     "benzene": (5, 20),  # Safe ≤ 5, Warning 6-20, Critical > 20
    #     "Ammonia": (25, 50),  # Safe ≤ 25, Warning 26-50, Critical > 50
    #     "Alcohol": (50, 100)  # Safe ≤ 50, Warning 51-100, Critical > 100
    # }
    #
    # overall_status = 0  # Default to Safe ✅
    #
    # for param, (safe_limit, warning_limit) in thresholds.items():
    #     value = res[param]  # Get sensor reading, default to 0 if missing
    #
    #     if value > warning_limit:  # Critical case
    #         return 2  # Critical
    #     elif value > safe_limit:  # Warning case
    #         overall_status = 1  # Warning

    return 0