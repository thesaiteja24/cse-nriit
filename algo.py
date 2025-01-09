from ortools.sat.python import cp_model

def schedule_classes_with_ortools():
    model = cp_model.CpModel()

    # Variables: (day, slot, batch, course)
    days = 6
    slots_per_day = 6
    batches = ["Batch1", "Batch2", "Batch3"]
    courses = ["Math", "Physics Lab", "Chemistry", "Biology", "English"]

    # Decision variables
    timetable = {}
    for batch in batches:
        for course in courses:
            for day in range(days):
                for slot in range(slots_per_day):
                    timetable[(batch, course, day, slot)] = model.NewBoolVar(
                        f"{batch}_{course}_day{day}_slot{slot}")

    # Constraints
    # Ensure each course is scheduled the required number of times (e.g., credits)
    course_credits = {"Math": 3, "Physics Lab": 2, "Chemistry": 4, "Biology": 2, "English": 1}
    for batch in batches:
        for course, credits in course_credits.items():
            model.Add(sum(timetable[(batch, course, day, slot)]
                          for day in range(days) for slot in range(slots_per_day)) == credits)

    # Ensure no overlapping courses for the same batch
    for batch in batches:
        for day in range(days):
            for slot in range(slots_per_day):
                model.Add(
                    sum(timetable[(batch, course, day, slot)] for course in courses) <= 1)

    # Faculty and lab constraints can be added similarly

    # Solve
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.FEASIBLE:
        print("Timetable:")
        for batch in batches:
            print(f"\n{batch}:")
            for day in range(days):
                for slot in range(slots_per_day):
                    for course in courses:
                        if solver.Value(timetable[(batch, course, day, slot)]):
                            print(f"Day {day + 1}, Slot {slot + 1}: {course}")

schedule_classes_with_ortools()
