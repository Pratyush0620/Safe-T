from datetime import datetime, timedelta


def get_period_status(last_period_date: str, cycle_length: int = 28, period_duration: int = 7):
    today = datetime(2025, 2, 18).date()  # Fixed today's date for dry run
    last_period_start = datetime.strptime(last_period_date, "%Y-%m-%d").date()

    next_period_start = last_period_start + timedelta(days=cycle_length)

    if last_period_start <= today < (last_period_start + timedelta(days=period_duration)):
        return 2  # Red - Actual period
    elif (next_period_start - timedelta(days=3)) <= today < next_period_start:
        return 1  # Yellow - Approaching period
    else:
        return 0  # Green - Safe


# # Dictionary to map status codes to labels
# status_colors = {0: "Green (Safe)", 1: "Yellow (Approaching Period)", 2: "Red (Period Days)"}
#
# # Test Case 1: Safe Zone (0 - Green)
# last_period_date_1 = "2025-01-10"  # Well outside the period and approaching period ranges
# cycle_length = 28
# period_duration = 7
#
# status_1 = get_period_status(last_period_date_1, cycle_length, period_duration)
# print(f"Test Case 1 - Current Status: {status_colors[status_1]}")  # Expected: Green (Safe)
#
# # Test Case 2: Approaching Period (1 - Yellow)
# last_period_date_2 = "2025-01-24"  # Makes next period start on 2025-02-21, so 3 days before is 2025-02-18 (today)
# status_2 = get_period_status(last_period_date_2, cycle_length, period_duration)
# print(f"Test Case 2 - Current Status: {status_colors[status_2]}")  # Expected: Yellow (Approaching Period)
#
# # Test Case 3: Actual Period Days (2 - Red)
# last_period_date_3 = "2025-02-12"  # This means period days are from 2025-02-12 to 2025-02-18 (today is in range)
# status_3 = get_period_status(last_period_date_3, cycle_length, period_duration)
# print(f"Test Case 3 - Current Status: {status_colors[status_3]}")  # Expected: Red (Period Days)