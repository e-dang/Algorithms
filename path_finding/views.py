from django.shortcuts import render

DEFAULT_GRID_PARAMS = {
    'num_rows': 40,
    'num_cols': 40,
    'start_row': 4,
    'start_col': 4,
    'end_row': 36,
    'end_col': 36
}


def path_finding(request):
    return render(request, 'path_finding.html', context=DEFAULT_GRID_PARAMS)
